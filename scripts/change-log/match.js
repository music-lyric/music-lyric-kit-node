// @ts-check

import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync } from 'node:fs'

import { CHANGE_LOG_FILE, CURRENT_CHANGE_LOG_FILE } from './constant.js'

import { rootVersion } from '../target.js'
import { getLatestTag } from './utils/git.js'

const { values: args } = parseArgs({
  allowPositionals: true,
  options: {
    version: {
      type: 'string',
      default: '',
    },
    includeHeader: {
      type: 'boolean',
      default: false,
    },
  },
})

/**
 * @param {string} content
 * @param {string} version
 * @param {boolean} includeHeader
 * @returns {string}
 */
const handleMatchChangeLogByVersion = (content, version, includeHeader = false) => {
  const target = version.replace(/^v/i, '').replace(/\./g, '\\.')

  const regex = new RegExp(`(##\\s*v${target}.*)[\\r\\n]+([\\s\\S]*?)(?=##\\s*v|$)`)
  const match = content.match(regex)

  if (!match) {
    return ''
  }

  const [_, header, body] = match

  return includeHeader ? `${header.trim()}\n\n${body.trim()}` : body.trim()
}

const main = async () => {
  const latestTag = await getLatestTag()
  const version = args.version || latestTag || rootVersion
  if (!version) {
    return
  }

  const data = readFileSync(CHANGE_LOG_FILE, { encoding: 'utf-8' }).toString()
  if (!data) {
    return
  }

  const result = handleMatchChangeLogByVersion(data, version, args.includeHeader)
  writeFileSync(CURRENT_CHANGE_LOG_FILE, result, { encoding: 'utf-8' })
}

main()
