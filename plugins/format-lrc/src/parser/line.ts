import type { MatchItem } from './utils'

import { Lyric } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'
import { parseTagTime, processTextToWords } from './utils'

const TIME_CONTENT_REGXP = /(<[^>]+>)([^<]*)/gu
const TIME_TAG_2 = /<([0-9]+),([0-9]+)\>/

const SYLLABLE_CHECK_REGXP = /<[^>]+>/

const processNormal = (lines: MatchItem[]) => {
  const result: Lyric.LineNormal[] = []
  for (const line of lines) {
    const time = parseTagTime(line.tag) || 0
    const text = line.content.trim()

    const item = new Lyric.LineNormal({ time: new Lyric.Time(time), words: processTextToWords(text) })

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
  const words: Lyric.Word[] = []

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
      if (!current || current.type !== Lyric.WordType.Space) {
        words.push(new Lyric.WordSpace())
      }
    }

    if (!trimed) {
      continue
    }

    const item = new Lyric.WordNormal({
      time: new Lyric.Time(time, time + duration),
      content: removeTextSpaceToOne(content),
    })
    words.push(item)

    if (content.endsWith(' ')) {
      words.push(new Lyric.WordSpace())
    }
  }

  let first: Lyric.WordNormal | null = null
  let last: Lyric.WordNormal | null = null
  for (const word of words) {
    if (word.type !== Lyric.WordType.Normal) {
      continue
    }
    if (!first) {
      first = word
    }
    last = word
  }

  const start = first?.time?.start ?? lineTime
  const end = last?.time?.end ?? start

  const target = new Lyric.LineNormal({ time: new Lyric.Time(start, end), words })

  return target
}

const processSyllable = (lines: MatchItem[]) => {
  const result: Lyric.LineNormal[] = []
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
