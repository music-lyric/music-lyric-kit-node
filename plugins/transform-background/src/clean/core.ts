import { Lyric } from '@music-lyric-kit/lyric'

const isOpenBracket = (ch: string) => ch === '(' || ch === '（'

const isCloseBracket = (ch: string) => ch === ')' || ch === '）'

export const removeBrackets = (line: Lyric.LineNormal, removeStart: boolean = true, removeEnd: boolean = true): void => {
  const words = line.content.words

  if (removeStart) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (word.type !== Lyric.WordType.Normal) {
        continue
      }

      if (isOpenBracket(word.content.charAt(0))) {
        word.content = word.content.substring(1)
        if (!word.content) words.splice(i, 1)
      }
      break
    }
  }

  if (removeEnd) {
    for (let i = words.length - 1; i >= 0; i--) {
      const word = words[i]
      if (word.type !== Lyric.WordType.Normal) {
        continue
      }

      const lastCharIdx = word.content.length - 1
      if (isCloseBracket(word.content.charAt(lastCharIdx))) {
        word.content = word.content.slice(0, -1)
        if (!word.content) words.splice(i, 1)
      }
      break
    }
  }

  for (const item of line.content.extended) {
    if (!item.content.trim()) continue

    if (removeStart && isOpenBracket(item.content.charAt(0))) {
      item.content = item.content.substring(1)
    }

    if (removeEnd && item.content) {
      const lastCharIdx = item.content.length - 1
      if (isCloseBracket(item.content.charAt(lastCharIdx))) {
        item.content = item.content.slice(0, -1)
      }
    }
  }
}
