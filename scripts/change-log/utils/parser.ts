import type { CommitInfo } from './git'

import { formatDate } from '../../utils'
import { targets } from '../../target'

const ALLOW_TYPES = ['fix', 'feat', 'perf', 'revert', 'docs', 'refactor']

const PRIVATE_SCOPES = new Set(targets.filter((t) => t.private).map((t) => t.id))

const TYPE_TITLE_MAP: Record<string, string> = {
  fix: 'Fix',
  feat: 'Feature',
  perf: 'Performance',
  docs: 'Document',
  revert: 'Revert',
  refactor: 'Refactor',
  breaking: 'Breaking',
}

const BREAKING_CHANGE_REGEXP = /^breaking:\s*(.*)/i

/**
 * Extract breaking change descriptions from a commit body.
 */
const extractBreakingChangeInfo = (text: string): string[] => {
  if (!text) {
    return []
  }

  const trimed = text.trim()
  if (!trimed) {
    return []
  }

  const result: string[] = []
  for (const line of trimed.split('\n')) {
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

/**
 * Build the version header line.
 */
export const buildHeader = (version: string, info: CommitInfo | null): string => {
  const date = info?.date
  const now = formatDate(new Date())

  return `## ${version} (${date || now})`
}

/**
 * Build the header for a commit type group.
 */
const buildTypeHeader = (type: string): string => {
  const title = TYPE_TITLE_MAP[type]
  return `### ${title}`
}

/**
 * Build the breaking change block.
 */
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

/**
 * Build a single commit list item.
 */
const buildBody = (commit: CommitInfo, repo: RepoInfo, isCommon: boolean = false): string => {
  const { hash, message } = commit
  return `${isCommon ? '' : '  '}- ${message} ([${hash.short}](https://github.com/${repo.owner}/${repo.name}/commit/${hash.short}))`
}

/**
 * Build scope-grouped content for a type and append breaking changes.
 */
const buildTypeContents = (data: Map<string, CommitInfo[]>, repo: RepoInfo): string[] => {
  const result: string[] = []
  const breaking: string[] = []

  const processCommits = (commits: CommitInfo[], isCommon: boolean = false) => {
    for (const commit of commits) {
      const body = buildBody(commit, repo, isCommon)
      result.push(body)
      const breakingChange = extractBreakingChangeInfo(commit.body)
      if (breakingChange.length) {
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

/**
 * Organize all commits by type and scope into markdown content.
 */
export const buildContents = (infos: CommitInfo[], repo: RepoInfo): string[] => {
  const result: string[] = []

  const typeMap = new Map<string, Map<string, CommitInfo[]>>()

  for (const info of infos) {
    const type = info.type
    if (!type || !ALLOW_TYPES.includes(type)) {
      continue
    }

    if (info.scope && PRIVATE_SCOPES.has(info.scope)) {
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
