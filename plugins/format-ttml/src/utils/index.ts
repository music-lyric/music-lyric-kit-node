import { Lyric } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'

export * from './xml'

export const parseTextToWords = (text: string): Lyric.Word[] => {
  const normalized = removeTextSpaceToOne(text).trim()
  const words = normalized.split(/(\s+)/g)

  const result: Lyric.Word[] = []

  for (let i = 0; i < words.length; i++) {
    const current = words[i]

    if (current === void 0 || current === null) {
      continue
    }

    if (current.trim() === '') {
      result.push(new Lyric.WordSpace())
      continue
    }

    result.push(new Lyric.WordNormal({ content: current.trim() }))
  }

  return result
}

/**
 * Detect per-word timing by finding any timed word in the line.
 */
export const hasWordTiming = (line?: Lyric.LineNormal) => {
  if (!line) {
    return false
  }
  for (const word of line.words) {
    if (word.type === Lyric.WordType.Normal && (word.time?.start ?? 0) > 0) {
      return true
    }
  }
  return false
}
