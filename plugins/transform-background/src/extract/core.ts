import { LineNormal, Word, WordNormal, WordSpace, WordType } from '@music-lyric-kit/lyric'

const isOpenBracket = (ch: string) => ch === '(' || ch === '（'

const isCloseBracket = (ch: string) => ch === ')' || ch === '）'

const copyWord = (word: Word) => {
  if (word.type === WordType.Space) {
    const space = new WordSpace()
    space.count = word.count
    return space
  }
  if (word.type === WordType.Normal) {
    const normal = new WordNormal()
    normal.content = word.content
    normal.extended = word.extended
    normal.time = word.time
    return normal
  }
}

export const addBackground = (line: LineNormal, background: LineNormal) => {
  if (!line.background) {
    line.background = [background]
  } else {
    line.background.push(background)
  }
}

export const removeBrackets = (line: LineNormal): void => {
  const words = line.content.words

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word.type !== WordType.Normal) {
      continue
    }
    word.content = word.content.substring(1)
    if (!word.content) {
      words.splice(i, 1)
    }
    break
  }

  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i]
    if (word.type !== WordType.Normal) {
      continue
    }
    word.content = word.content.slice(0, -1)
    if (!word.content) {
      words.splice(i, 1)
    }
    break
  }
}

export const isFullLine = (line: LineNormal) => {
  const words = line.content.words.filter((w) => w.type === WordType.Normal)
  if (words.length < 2) {
    return false
  }

  const start = words[0]
  const end = words[words.length - 1]
  if (!start || !end) {
    return false
  }

  const startChar = start.content.charAt(0)
  const endChar = end.content.charAt(end.content.length - 1)

  return isOpenBracket(startChar) && isCloseBracket(endChar)
}

export const extractInLine = (line: LineNormal) => {
  let hasOpen = false
  let hasClose = false

  for (const word of line.content.words) {
    if (word.type === WordType.Normal) {
      const content = word.content
      for (let i = 0; i < content.length; i++) {
        if (isOpenBracket(content[i])) hasOpen = true
        if (isCloseBracket(content[i])) hasClose = true
      }
    }
  }

  if (!hasOpen && !hasClose) {
    return
  }

  const words = line.content.words
  const mainWords: Word[] = []
  const backgroundGroups: Word[][] = []

  let currentBackground: Word[] = []
  let inBracket = false
  let lastOpenChar = ''
  let lastOpenWord: Word | null = null

  for (const word of words) {
    if (word.type !== WordType.Normal) {
      const copy = copyWord(word)!
      if (inBracket) {
        currentBackground.push(copy)
      } else {
        mainWords.push(copy)
      }
      continue
    }

    const content = word.content
    let buffer = ''

    for (let j = 0; j < content.length; j++) {
      const char = content[j]

      if (isOpenBracket(char)) {
        if (inBracket) {
          buffer += char
        } else {
          if (buffer) {
            const copy = copyWord(word) as WordNormal
            copy.content = buffer
            mainWords.push(copy)
            buffer = ''
          }
          inBracket = true
          lastOpenChar = char
          lastOpenWord = word
        }
      } else if (isCloseBracket(char)) {
        if (inBracket) {
          if (buffer) {
            const copy = copyWord(word) as WordNormal
            copy.content = buffer
            currentBackground.push(copy)
            buffer = ''
          }
          if (currentBackground.length > 0) {
            backgroundGroups.push(currentBackground)
            currentBackground = []
          }
          inBracket = false
        } else {
          buffer += char
        }
      } else {
        buffer += char
      }
    }

    if (buffer) {
      const target = inBracket ? currentBackground : mainWords
      const copy = copyWord(word) as WordNormal
      copy.content = buffer
      target.push(copy)
    }
  }

  // no close (
  if (inBracket) {
    if (lastOpenWord) {
      const copyOpen = copyWord(lastOpenWord) as WordNormal
      copyOpen.content = lastOpenChar
      mainWords.push(copyOpen)
    }
    mainWords.push(...currentBackground)
    currentBackground = []
  }

  if (backgroundGroups.length === 0) {
    return
  }

  line.content.words = mainWords

  for (const item of backgroundGroups) {
    const result = new LineNormal()

    const normals = item.filter((w) => w.type === WordType.Normal)
    if (normals.length > 0) {
      result.time.start = normals[0].time.start || 0
      result.time.end = normals[normals.length - 1].time.end || 0
    }
    result.content.words = item

    addBackground(line, result)
  }
}
