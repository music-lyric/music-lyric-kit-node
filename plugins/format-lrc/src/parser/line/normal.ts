import type { MatchItem } from '../utils'

import { LineNormal } from '@music-lyric-kit/lyric'

import { parseTagTime, processTextToWords } from '../utils'

const processLine = (line: MatchItem) => {
  const time = parseTagTime(line.tag) || 0
  const text = line.content.trim()

  const result = new LineNormal()
  result.time.start = time
  result.content.words = processTextToWords(text)

  return result
}

export const processNormal = (lines: MatchItem[]) => {
  if (lines.length < 0) {
    return null
  }

  const result: LineNormal[] = []
  for (const line of lines) {
    const item = processLine(line)
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
