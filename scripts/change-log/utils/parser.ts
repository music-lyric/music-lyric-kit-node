import type { CommitInfo } from './git'

import { formatDate } from '../../utils'

const ALLOW_TYPES = ['feat', 'fix', 'revert', 'docs', 'refactor']

const TYPE_TITLE_MAP: Record<string, string> = {
  feat: 'Feature',
  fix: 'Bug Fix',
  docs: 'Document',
  revert: 'Revert Chnage',
  refactor: 'Code Refactor',
  breaking: 'Breaking Change',
}

const BREAKING_CHANGE_REGEXP = /^breaking:\s*(.*)/i

const extractBreakingChangeInfo = (text: string): string[] => {
  if (!text) {
    return []
  }

  const trimed = text.trim()
  if (!trimed) {
    return []
  }

  const result: string[] = []
  for (const line of trimed.split('\n') || []) {
    const trimed = line.trim()
    if (!trimed) {
      continue
    }

    const match = trimed.match(BREAKING_CHANGE_REGEXP)
    if (!match) {
      continue
    }

    const target = match[1]?.trim()
    if (!target) {
      continue
    }

    result.push(target)
  }

  return result
}

export const buildHeader = (version: string, info: CommitInfo | null): string => {
  const date = info?.date
  const now = formatDate(new Date())

  return `## ${version} (${date || now})`
}

const buildTypeHeader = (type: string): string => {
  const title = TYPE_TITLE_MAP[type]
  return `### ${title}`
}

const buildBreakingChange = (changes: string[]): string[] | null => {
  if (!changes || !changes.length) {
    return null
  }

  const result: string[] = []

  const header = buildTypeHeader('breaking')
  result.push('\n')
  result.push(header)
  result.push('\n')

  for (const change of changes) {
    result.push(`- ${change}`)
  }

  return result
}

interface RepoInfo {
  owner: string
  name: string
}

const buildBody = (commit: CommitInfo, repo: RepoInfo, isCommon: boolean = false): string => {
  const { hash, message } = commit
  return `${isCommon ? '' : '  '}- ${message} ([${hash.short}](https://github.com/${repo.owner}/${repo.name}/commit/${hash.short}))`
}

const buildTypeContents = (data: Map<string, CommitInfo[]>, repo: RepoInfo): string[] => {
  const result: string[] = []
  const breaking: string[] = []

  const processCommits = (commits: CommitInfo[], isCommon: boolean = false) => {
    for (const commit of commits) {
      const body = buildBody(commit, repo, isCommon)
      result.push(body)
      const breakingChange = extractBreakingChangeInfo(commit.body)
      if (breakingChange) {
        breaking.push(...breakingChange)
      }
    }
  }

  const common = data.get('common')
  data.delete('common')

  if (common) {
    processCommits(common, true)
  }

  const keys = [...data.keys()].sort()
  for (const key of keys) {
    const value = data.get(key)
    if (!value) {
      continue
    }
    const buildScopeHeader = (scope: string) => '- `' + scope + '`'
    result.push(buildScopeHeader(key))
    processCommits(value)
  }

  const breakings = buildBreakingChange(breaking)
  if (breakings) {
    result.push(...breakings)
  }

  return result
}

export const buildContents = (infos: CommitInfo[], repo: RepoInfo): string[] => {
  const result: string[] = []

  const typeMap = new Map<string, Map<string, CommitInfo[]>>()

  for (const info of infos) {
    const type = info.type
    if (!type || !ALLOW_TYPES.includes(type)) {
      continue
    }

    const scope = info.scope || 'common'
    const scopeMap = typeMap.get(type) || new Map<string, CommitInfo[]>()

    const current = scopeMap.get(scope)
    if (current) {
      current.push(info)
      scopeMap.set(scope, current)
    } else {
      scopeMap.set(scope, [info])
    }

    typeMap.set(type, scopeMap)
  }

  const typeKeys = [...typeMap.keys()].sort()
  for (const key of typeKeys) {
    const value = typeMap.get(key)
    if (!value) {
      continue
    }

    result.push('\n')
    result.push(buildTypeHeader(key))
    result.push('\n')

    const target = buildTypeContents(value, repo)
    if (target) {
      result.push(...target)
    }
  }

  return result
}
