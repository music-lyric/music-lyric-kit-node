// @ts-check

import { formatDate } from '../../utils.js'

const ALLOW_TYPES = ['feat', 'fix', 'revert', 'docs', 'refactor']

const TYPE_TITLE_MAP = {
  feat: 'Feature',
  fix: 'Bug Fix',
  docs: 'Document',
  revert: 'Revert Chnage',
  refactor: 'Code Refactor',
  breaking: 'Breaking Change',
}

const BREAKING_CHANGE_REGEXP = /^breaking:\s*(.*)/i

/**
 * @param {string} text
 */
const extractBreakingChangeInfo = (text) => {
  if (!text) {
    return []
  }

  const trimed = text.trim()
  if (!trimed) {
    return []
  }

  const result = []
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

/**
 * @param {string} version
 * @param {*} info
 */
export const buildHeader = (version, info) => {
  const { date } = info || {}

  const now = formatDate(new Date())

  return `## ${version} (${date || now})`
}

/**
 * @param {string} type
 */
const buildTypeHeader = (type) => {
  // @ts-expect-error
  const title = TYPE_TITLE_MAP[type]
  return `### ${title}`
}

/**
 * @param {string[]} changes
 */
const buildBreakingChange = (changes) => {
  if (!changes || !changes.length) {
    return null
  }

  const result = []

  const header = buildTypeHeader('breaking')
  result.push('\n')
  result.push(header)
  result.push('\n')

  for (const change of changes) {
    result.push(`- ${change}`)
  }

  return result
}

/**
 *
 * @param {any[]} infos
 * @param {any} repo
 */
const buildScopeContent = (infos, repo) => {
  /** @type {Map<string, any[]>} */
  const typeMap = new Map()

  for (const info of infos) {
    const type = info.type

    const current = typeMap.get(type)
    if (current) {
      current.push(info)
      continue
    }

    typeMap.set(type, [info])
  }

  /** @type string[] */
  const result = []
  /** @type string[] */
  const breaking = []

  /**
   *
   * @param {string} type
   */
  const buildTypeHeader = (type) => {
    // @ts-expect-error
    const title = TYPE_TITLE_MAP[type]
    return `- ${title}`
  }

  /**
   *
   * @param {any} commit
   * @param {any} repo
   */
  const buildBody = (commit, repo) => {
    const { hash, message } = commit
    return `  - ${message} ([${hash.short}](https://github.com/${repo.owner}/${repo.name}/commit/${hash.short}))`
  }

  /**
   * @param {any[]} commits
   */
  const processCommits = (commits) => {
    for (const commit of commits) {
      const body = buildBody(commit, repo)
      result.push(body)
      const breakingChange = extractBreakingChangeInfo(commit.body)
      if (breakingChange) {
        breaking.push(...breakingChange)
      }
    }
  }

  for (const [key, value] of typeMap.entries()) {
    result.push('\n')
    result.push(buildTypeHeader(key))

    processCommits(value)
  }

  return result
}

/**
 *
 * @param {string} scope
 */
const buildScopeHeader = (scope) => {
  return '- `' + scope + '`'
}

/**
 *
 * @param {any} commit
 * @param {any} repo
 */
const buildBody = (commit, repo, isCommon = false) => {
  const { hash, message } = commit
  return `${isCommon ? '' : '  '}- ${message} ([${hash.short}](https://github.com/${repo.owner}/${repo.name}/commit/${hash.short}))`
}

/**
 * @param {*} data
 * @param {*} repo
 */
const buildTypeContents = (data, repo) => {
  /** @type {string[]} */
  const result = []
  /** @type {string[]} */
  const breaking = []

  /**
   * @param {any[]} commits
   * @param {boolean} isCommon
   */
  const processCommits = (commits, isCommon = false) => {
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
    result.push('\n')
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
 * @param {*[]} infos
 * @param {*} repo
 */
export const buildContents = (infos, repo) => {
  /** @type {string[]} */
  const result = []

  const typeMap = new Map()

  for (const info of infos) {
    const type = info.type
    if (!type || !ALLOW_TYPES.includes(type)) {
      continue
    }

    const scope = info.scope || 'common'
    const scopeMap = typeMap.get(type) || new Map()

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
