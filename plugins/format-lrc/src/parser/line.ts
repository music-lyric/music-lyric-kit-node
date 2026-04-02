import type { MatchItem } from './utils'
import type { Word } from '@music-lyric-kit/lyric'

import { LineNormal, WordNormal, WordSpace, WordType } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'
import { parseTagTime, processTextToWords } from './utils'

const TIME_CONTENT_REGXP = /(<[^>]+>)([^<]*)/gu
const TIME_TAG_2 = /<([0-9]+),([0-9]+)\>/

const SYLLABLE_CHECK_REGXP = /<[^>]+>/

const processNormal = (lines: MatchItem[]) => {
  const result: LineNormal[] = []
  for (const line of lines) {
    const time = parseTagTime(line.tag) || 0
    const text = line.content.trim()

    const item = new LineNormal()
    item.time.start = time
    item.content.words = processTextToWords(text)

    result.push(item)
  }

  for (let index = 0; index < result.length; index++) {
    const current = result[index]
    const next = result[index + 1]
    if (!next) continue
    current.time.end = next.time.start
  }

  return result
}

const processSyllableLine = (line: MatchItem) => {
  const words: Word[] = []

  const lineTime = parseTagTime(line.tag)
  if (lineTime === null) {
    return null
  }

  for (const wordInfo of line.content.matchAll(TIME_CONTENT_REGXP)) {
    const timeTag = wordInfo[1] || ''

    let time = parseTagTime(timeTag)
    let duration = 0

    if (time === null) {
      const matchs = timeTag.match(TIME_TAG_2)
      if (matchs) {
        time = lineTime + (parseInt(matchs[1]) || 0)
        duration = parseInt(matchs[2]) || 0
      }
    }

    if (time === null) {
      continue
    }

    const content = wordInfo[2] || ''
    if (!content) {
      continue
    }

    const trimed = content.trim()
    if (!trimed || content.startsWith(' ')) {
      if (words.length < 1) {
        continue
      }
      const current = words[words.length - 1]
      if (!current || current.type !== WordType.Space) {
        const item = new WordSpace()
        item.count = 1
        words.push(item)
      }
    }

    if (!trimed) {
      continue
    }

    const item = new WordNormal()
    item.time.start = time
    item.time.end = time + duration
    item.content = removeTextSpaceToOne(content)
    words.push(item)

    if (content.endsWith(' ')) {
      const item = new WordSpace()
      item.count = 1
      words.push(item)
    }
  }

  const start = words.find((item) => item.type === WordType.Normal)?.time.start ?? lineTime
  const duration = words.map((v) => (v.type === WordType.Normal ? v.time.duration : 0)).reduce((a, b) => a + b, 0)

  const target = new LineNormal()
  target.time.start = start
  target.time.end = start + duration
  target.content.words = words

  return target
}

const processSyllable = (lines: MatchItem[]) => {
  const result: LineNormal[] = []
  for (const line of lines) {
    const item = processSyllableLine(line)
    if (!item) continue
    result.push(item)
  }

  return result
}

export const checkIsSyllable = (content: MatchItem[]) => {
  return content.some((line) => SYLLABLE_CHECK_REGXP.test(line.content))
}

export const processLines = (content: MatchItem[], forceNormal = false) => {
  if (!content.length) {
    return []
  }

  if (!forceNormal && checkIsSyllable(content)) {
    return processSyllable(content)
  }

  return processNormal(content)
}
