import { Lyric } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'

export * from './time'
export * from './match'

export const processTextToWords = (text: string): Lyric.Runtime.Proto.Word[] => {
  const normalized = removeTextSpaceToOne(text).trim()
  const words = normalized.split(/(\s+)/g)

  const result: Lyric.Runtime.Proto.Word[] = []

  for (let i = 0; i < words.length; i++) {
    const current = words[i]

    if (current === void 0 || current === null) {
      continue
    }

    if (current.trim() === '') {
      result.push(Lyric.Runtime.makeWordSpace({ count: 1 }))
      continue
    }

    result.push(Lyric.Runtime.makeWordNormal({ content: current.trim() }))
  }

  return result
}
