import { Lyric } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'

export * from './xml'

export const processTextToWords = (text: string): Lyric.Word[] => {
  const normalized = removeTextSpaceToOne(text).trim()
  const words = normalized.split(/(\s+)/g)

  const result: Lyric.Word[] = []

  for (let i = 0; i < words.length; i++) {
    const current = words[i]

    if (current === void 0 || current === null) {
      continue
    }

    if (current.trim() === '') {
      const item = new Lyric.WordSpace()
      item.count = 1
      result.push(item)
      continue
    }

    const item = new Lyric.WordNormal()
    item.content = current.trim()
    result.push(item)
  }

  return result
}

export const checkIsSyllable = (line: Lyric.LineNormal) => {
  if (!line) {
    return false
  }
  const words = line.words.filter((item) => item.type === Lyric.WordType.Normal)
  const time = words.reduce((sum, word) => sum + (word.time?.start ?? 0), 0)
  return time > 0
}
