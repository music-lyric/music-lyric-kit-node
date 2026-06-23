import type { MatchItem } from './utils'

import { Lyric } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'
import { parseTagTime, processTextToWords } from './utils'

const TIME_CONTENT_REGXP = /(<[^>]+>)([^<]*)/gu
const TIME_TAG_2 = /<([0-9]+),([0-9]+)\>/

const SYLLABLE_CHECK_REGXP = /<[^>]+>/

const CORE_CHAR_REGEXP = /[\p{L}\p{N}]/u

const NUMBER_CONNECTORS = new Set([':', '.', ',', '/', '-'])

const hasCoreChar = (text: string) => CORE_CHAR_REGEXP.test(text)

const isDigitChar = (char: string | undefined) => char !== undefined && char >= '0' && char <= '9'

/**
 * Get the trailing run of punctuation characters of a string.
 *
 * Punctuation here means a non-core, non-space character.
 */
const getTrailingPunct = (text: string) => {
  let index = text.length
  while (index > 0) {
    const char = text[index - 1]
    if (char === ' ' || CORE_CHAR_REGEXP.test(char)) {
      break
    }
    index--
  }
  return text.slice(index)
}

/**
 * Get the leading run of punctuation characters of a string.
 *
 * Punctuation here means a non-core, non-space character.
 */
const getLeadingPunct = (text: string) => {
  let index = 0
  while (index < text.length) {
    const char = text[index]
    if (char === ' ' || CORE_CHAR_REGEXP.test(char)) {
      break
    }
    index++
  }
  return text.slice(0, index)
}

/**
 * Normalize punctuation that lands on a syllable boundary between two adjacent words.
 *
 * A numeric connector flanked by digits merges into one word whether it is attached or standalone, e.g. 10: 30 and 10 : 30 both become 10:30.
 *
 * Any other boundary punctuation splits into its own word, e.g. hello, and world become hello , world.
 */
const normalizeBoundaryPunct = (words: Lyric.Word[]): Lyric.Word[] => {
  const result: Lyric.Word[] = []

  for (let index = 0; index < words.length; index++) {
    const word = words[index]
    const prev = result[result.length - 1]

    if (word.type !== Lyric.WordType.Normal || prev?.type !== Lyric.WordType.Normal) {
      result.push(word)
      continue
    }

    // a standalone numeric connector between two digit words joins them, e.g. 10 : 30 becomes 10:30
    const isNumberConnector = word.content.length > 0 && [...word.content].every((char) => NUMBER_CONNECTORS.has(char))
    if (isNumberConnector) {
      const next = words[index + 1]
      const joinable = isDigitChar(prev.content[prev.content.length - 1]) && next?.type === Lyric.WordType.Normal && isDigitChar(next.content[0])

      if (joinable) {
        prev.content += word.content + next.content
        if (prev.time && next.time) {
          prev.time.end = next.time.end
        }
        index++
        continue
      }

      result.push(word)
      continue
    }

    // only two core bearing words can carry boundary punctuation to normalize
    if (!hasCoreChar(prev.content) || !hasCoreChar(word.content)) {
      result.push(word)
      continue
    }

    const trailing = getTrailingPunct(prev.content)
    const leading = getLeadingPunct(word.content)
    if (!trailing && !leading) {
      result.push(word)
      continue
    }

    const leftCore = prev.content.slice(0, prev.content.length - trailing.length)
    const rightCore = word.content.slice(leading.length)

    const leftFlank = leftCore[leftCore.length - 1]
    const rightFlank = rightCore[0]

    const punct = trailing + leading

    const isNumberJoin = isDigitChar(leftFlank) && isDigitChar(rightFlank) && [...punct].every((char) => NUMBER_CONNECTORS.has(char))
    if (isNumberJoin) {
      prev.content += word.content
      if (prev.time && word.time) {
        prev.time.end = word.time.end
      }
      continue
    }

    prev.content = leftCore

    const start = trailing ? prev.time?.start : word.time?.start
    const end = leading ? word.time?.end : prev.time?.end
    const punctTime = start !== void 0 && end !== void 0 ? new Lyric.Time(start, end) : void 0
    result.push(new Lyric.WordNormal({ content: punct, time: punctTime }))

    word.content = rightCore
    result.push(word)
  }

  return result
}

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

  const normalized = normalizeBoundaryPunct(words)

  let first: Lyric.WordNormal | null = null
  let last: Lyric.WordNormal | null = null
  for (const word of normalized) {
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

  const target = new Lyric.LineNormal({ time: new Lyric.Time(start, end), words: normalized })

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
