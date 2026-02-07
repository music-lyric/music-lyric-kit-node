// @ts-check

import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { writeFileSync } from 'node:fs'

import { root, rootVersion } from '../target.js'
import { getRepoInfo, getCommitInfo, getAllTags, buildContents, buildHeader, formatResult } from './utils/index.js'

const CHANGE_LOG_FILE = 'CHANGELOG.md'
const CURRENT_CHANGE_LOG_FILE = 'CURRENT_CHANGELOG.md'

const { values: args } = parseArgs({
  allowPositionals: true,
  options: {
    current: {
      type: 'boolean',
      default: false,
    },
    showCurrentHead: {
      type: 'boolean',
      default: false,
    },
  },
})

/**
 * @param {string} start
 * @param {string} end
 * @param {any} repo
 * @param {boolean} showHead
 */
const handleBuild = async (start, end, repo, showHead = true) => {
  const commits = await getCommitInfo(start, end)

  let key = `v${rootVersion}`

  /** @type any */
  const wait = {}

  for (const item of commits) {
    if (item.type === 'release') {
      key = item.message
      wait[key] = {
        head: item,
        list: [],
      }
      continue
    }

    if (!key) {
      continue
    }

    if (!wait[key]) {
      wait[key] = {
        head: null,
        list: [],
      }
    }

    wait[key].list.push(item)
  }

  /** @type string[] */
  const result = []

  for (const version in wait) {
    const content = wait[version]

    result.push('\n')

    if (showHead) {
      const head = buildHeader(version, content.head)
      result.push(head)
    }

    const body = buildContents(content.list, repo)
    result.push(...body)
  }

  return formatResult(result.join('\n'))
}

const main = async () => {
  const repo = await getRepoInfo()
  if (!repo) {
    throw new Error('get repo info failed.')
  }

  let result
  let file

  if (args.current) {
    const [latest, old] = await getAllTags()
    if (!latest) {
      return
    }
    result = await handleBuild(old || '', latest, repo, args.showCurrentHead)
    file = CURRENT_CHANGE_LOG_FILE
  } else {
    result = await handleBuild('', '', repo)
    file = CHANGE_LOG_FILE
  }

  if (!result) {
    throw new Error('build change log failed.')
  }

  const output = join(root, file)

  writeFileSync(output, result, { encoding: 'utf-8' })
}

main()
