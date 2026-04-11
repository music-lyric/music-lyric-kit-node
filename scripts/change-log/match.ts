import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync } from 'node:fs'

import { CHANGE_LOG_FILE, CURRENT_CHANGE_LOG_FILE } from './constant'

import { mainVersion } from '../target'
import { getLatestTag } from './utils/git'

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

const handleMatchChangeLogByVersion = (content: string, version: string, includeHeader: boolean = false): string => {
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
  const version = args.version || latestTag || mainVersion
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
