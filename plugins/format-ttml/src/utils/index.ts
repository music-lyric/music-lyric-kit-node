import { Lyric } from '@music-lyric-kit/lyric'
import { removeTextSpaceToOne } from '@music-lyric-kit/utils'

export * from './xml'

export const parseTextToWords = (text: string): Lyric.Runtime.Proto.Word[] => {
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

export const hasWordTiming = (line?: Lyric.Runtime.Proto.Line) => {
  if (!line || !Lyric.Runtime.isLineNormal(line)) {
    return false
  }
  for (const word of line.body.value.content?.words ?? []) {
    if (Lyric.Runtime.isWordNormal(word) && (word.body.value.time?.start ?? 0) > 0) {
      return true
    }
  }
  return false
}

export const ensureContent = (line: Lyric.Runtime.Proto.LineNormal | Lyric.Runtime.Proto.LineBackground): Lyric.Runtime.Proto.LineContent => {
  return line.content ?? (line.content = Lyric.Runtime.makeLineContent())
}

export const ensureAnnotation = (line: Lyric.Runtime.Proto.LineNormal | Lyric.Runtime.Proto.LineBackground): Lyric.Runtime.Proto.LineAnnotation => {
  const content = ensureContent(line)
  return content.annotation ?? (content.annotation = Lyric.Runtime.makeLineAnnotation())
}
