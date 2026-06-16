import { Lyric } from '@music-lyric-kit/lyric'

const isOpenBracket = (ch: string) => ch === '(' || ch === '（'

const isCloseBracket = (ch: string) => ch === ')' || ch === '）'

const copyWord = (word: Lyric.Word) => {
  if (word.type === Lyric.WordType.Space) {
    const space = new Lyric.WordSpace()
    space.count = word.count
    return space
  }
  if (word.type === Lyric.WordType.Normal) {
    const normal = new Lyric.WordNormal()
    normal.content = word.content

    normal.time = new Lyric.Time()
    normal.time.start = word.time.start
    normal.time.end = word.time.end

    normal.extended = word.extended.map((item) => {
      const extended = new Lyric.Extended()
      extended.type = item.type
      extended.content = item.content
      return extended
    })

    normal.config.stress = word.config.stress

    return normal
  }
}

export const addBackground = (line: Lyric.LineNormal, background: Lyric.LineNormalBackground) => {
  if (!line.background) {
    line.background = [background]
  } else {
    line.background.push(background)
  }
}

export const hasStartOpenBracket = (line: Lyric.LineNormal) => {
  const words = line.content.words.filter((w) => w.type === Lyric.WordType.Normal)
  if (!words.length) {
    return false
  }
  return isOpenBracket(words[0].content.charAt(0))
}
export const hasEndCloseBracket = (line: Lyric.LineNormal) => {
  const words = line.content.words.filter((w) => w.type === Lyric.WordType.Normal)
  if (!words.length) {
    return false
  }
  const last = words[words.length - 1]
  return isCloseBracket(last.content.charAt(last.content.length - 1))
}

export const isFullLine = (line: Lyric.LineNormal) => {
  const words = line.content.words.filter((w) => w.type === Lyric.WordType.Normal)
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

const extractInLineExtended = (content: string): [string, string[]] => {
  let main = ''
  let current = ''

  let inBracket = false
  let lastChar = ''

  const result: string[] = []

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (isOpenBracket(char)) {
      if (inBracket) {
        current += char
      } else {
        inBracket = true
        lastChar = char
      }
    } else if (isCloseBracket(char)) {
      if (inBracket) {
        result.push(current)
        current = ''
        inBracket = false
      } else {
        main += char
      }
    } else {
      if (inBracket) {
        current += char
      } else {
        main += char
      }
    }
  }

  // no close (
  if (inBracket) {
    main += lastChar + current
  }

  return [main, result]
}
export const extractInLine = (line: Lyric.LineNormal) => {
  let hasOpen = false
  let hasClose = false

  for (const word of line.content.words) {
    if (word.type === Lyric.WordType.Normal) {
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
  const mainWords: Lyric.Word[] = []
  const backgroundGroups: Lyric.Word[][] = []

  let currentBackground: Lyric.Word[] = []
  let inBracket = false
  let lastOpenChar = ''
  let lastOpenWord: Lyric.Word | null = null

  for (const word of words) {
    if (word.type !== Lyric.WordType.Normal) {
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
            const copy = copyWord(word) as Lyric.WordNormal
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
            const copy = copyWord(word) as Lyric.WordNormal
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
      const copy = copyWord(word) as Lyric.WordNormal
      copy.content = buffer
      target.push(copy)
    }
  }

  // no close (
  if (inBracket) {
    if (lastOpenWord) {
      const copyOpen = copyWord(lastOpenWord) as Lyric.WordNormal
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

  const backgroundLines: Lyric.LineNormalBackground[] = []
  for (const item of backgroundGroups) {
    const result = new Lyric.LineNormalBackground()

    const normals = item.filter((w) => w.type === Lyric.WordType.Normal)
    if (normals.length > 0) {
      result.time.start = normals[0].time.start || 0
      result.time.end = normals[normals.length - 1].time.end || 0
    }
    result.content.words = item

    backgroundLines.push(result)
    addBackground(line, result)
  }

  for (const item of line.content.extended) {
    if (!item.content.trim()) {
      continue
    }

    const [main, backgrounds] = extractInLineExtended(item.content)

    item.content = main
    for (let i = 0; i < backgrounds.length; i++) {
      if (i < backgroundLines.length) {
        const target = new Lyric.Extended()
        target.type = item.type
        target.content = backgrounds[i]
        backgroundLines[i].content.extended.push(target)
      }
    }
  }
}

export const extractCrossLine = (lines: Lyric.Line[]) => {
  const result: Lyric.Line[] = []

  for (let i = 0; i < lines.length; i++) {
    const current = lines[i]

    const next = lines[i + 1]
    if (!next) {
      result.push(current)
      continue
    }

    const prev = result[result.length - 1]
    if (!prev) {
      result.push(current)
      continue
    }

    if (current.type === Lyric.LineType.Normal && next.type === Lyric.LineType.Normal) {
      // Skip if current line has complete brackets
      if (hasStartOpenBracket(current) && hasEndCloseBracket(current)) {
        result.push(current)
        continue
      }

      if (hasStartOpenBracket(current) && hasEndCloseBracket(next)) {
        if (prev.type === Lyric.LineType.Normal) {
          addBackground(prev, current)
          addBackground(prev, next)

          // skip next
          i++
          continue
        }
      }
    }

    result.push(current)
  }

  return result
}
