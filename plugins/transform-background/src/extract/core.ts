import { Lyric } from '@music-lyric-kit/lyric'

const isOpenBracket = (ch: string) => ch === '(' || ch === '（'

const isCloseBracket = (ch: string) => ch === ')' || ch === '）'

/**
 * Copy a word verbatim, dropping its language as the original did.
 */
const copyWord = (word: Lyric.Runtime.Word): Lyric.Runtime.Word | undefined => {
  if (Lyric.Runtime.isWordSpace(word)) {
    return Lyric.Runtime.makeWordSpace({ count: word.body.value.count })
  }
  if (Lyric.Runtime.isWordNormal(word)) {
    const value = word.body.value
    return Lyric.Runtime.makeWordNormal({
      content: value.content,
      time: value.time ? Lyric.Common.makeTime({ start: value.time.start, end: value.time.end }) : undefined,
      annotation: value.annotation,
      stress: value.stress,
    })
  }
  return undefined
}

/**
 * Copy a normal word but replace its text content.
 */
const copyNormalWord = (word: Lyric.Runtime.WordNormal, content: string): Lyric.Runtime.Word => {
  return Lyric.Runtime.makeWordNormal({
    content,
    time: word.time ? Lyric.Common.makeTime({ start: word.time.start, end: word.time.end }) : undefined,
    annotation: word.annotation,
    stress: word.stress,
  })
}

/**
 * Turn a line into a background line, carrying over its time and content.
 */
export const toBackground = (line: Lyric.Runtime.Line): Lyric.Runtime.LineBackground => {
  const content = Lyric.Runtime.isLineNormal(line) ? line.body.value.content : undefined
  return Lyric.Runtime.makeLineBackground({
    time: line.time,
    content,
  })
}

const findFirstNormalWord = (line: Lyric.Runtime.LineNormal): Lyric.Runtime.WordNormal | null => {
  const words = line.content?.words ?? []
  for (let i = 0, len = words.length; i < len; i++) {
    const word = words[i]
    if (Lyric.Runtime.isWordNormal(word)) {
      return word.body.value
    }
  }
  return null
}

const findLastNormalWord = (line: Lyric.Runtime.LineNormal): Lyric.Runtime.WordNormal | null => {
  const words = line.content?.words ?? []
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i]
    if (Lyric.Runtime.isWordNormal(word)) {
      return word.body.value
    }
  }
  return null
}

export const addBackground = (line: Lyric.Runtime.LineNormal, background: Lyric.Runtime.LineBackground) => {
  line.backgrounds.push(background)
}

export const hasStartOpenBracket = (line: Lyric.Runtime.LineNormal) => {
  const first = findFirstNormalWord(line)
  if (!first) {
    return false
  }
  return isOpenBracket(first.content.charAt(0))
}

export const hasEndCloseBracket = (line: Lyric.Runtime.LineNormal) => {
  const last = findLastNormalWord(line)
  if (!last) {
    return false
  }
  return isCloseBracket(last.content.charAt(last.content.length - 1))
}

export const isFullLine = (line: Lyric.Runtime.LineNormal) => {
  const start = findFirstNormalWord(line)
  const end = findLastNormalWord(line)
  if (!start || !end || start === end) {
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
export const extractInLine = (line: Lyric.Runtime.LineNormal) => {
  const content = line.content
  if (!content) {
    return
  }

  let hasOpen = false
  let hasClose = false

  for (const word of content.words) {
    if (Lyric.Runtime.isWordNormal(word)) {
      const text = word.body.value.content
      for (let i = 0; i < text.length; i++) {
        if (isOpenBracket(text[i])) hasOpen = true
        if (isCloseBracket(text[i])) hasClose = true
      }
    }
  }

  if (!hasOpen && !hasClose) {
    return
  }

  const words = content.words
  const mainWords: Lyric.Runtime.Word[] = []
  const backgroundGroups: Lyric.Runtime.Word[][] = []

  let currentBackground: Lyric.Runtime.Word[] = []
  let inBracket = false
  let lastOpenChar = ''
  let lastOpenWord: Lyric.Runtime.WordNormal | null = null

  for (const word of words) {
    if (!Lyric.Runtime.isWordNormal(word)) {
      const copy = copyWord(word)
      if (copy) {
        if (inBracket) {
          currentBackground.push(copy)
        } else {
          mainWords.push(copy)
        }
      }
      continue
    }

    const value = word.body.value
    const text = value.content
    let buffer = ''

    for (let j = 0; j < text.length; j++) {
      const char = text[j]

      if (isOpenBracket(char)) {
        if (inBracket) {
          buffer += char
        } else {
          if (buffer) {
            mainWords.push(copyNormalWord(value, buffer))
            buffer = ''
          }
          inBracket = true
          lastOpenChar = char
          lastOpenWord = value
        }
      } else if (isCloseBracket(char)) {
        if (inBracket) {
          if (buffer) {
            currentBackground.push(copyNormalWord(value, buffer))
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
      target.push(copyNormalWord(value, buffer))
    }
  }

  // no close (
  if (inBracket) {
    if (lastOpenWord) {
      mainWords.push(copyNormalWord(lastOpenWord, lastOpenChar))
    }
    mainWords.push(...currentBackground)
    currentBackground = []
  }

  if (backgroundGroups.length === 0) {
    return
  }

  content.words = mainWords

  for (const item of backgroundGroups) {
    const normals = item.filter(Lyric.Runtime.isWordNormal).map((w) => w.body.value)
    const result = Lyric.Runtime.makeLineBackground({
      time:
        normals.length > 0
          ? Lyric.Common.makeTime({ start: normals[0].time?.start ?? 0, end: normals[normals.length - 1].time?.end ?? 0 })
          : undefined,
      content: { words: item },
    })

    addBackground(line, result)
  }
}

export const assignBackgroundAnnotation = (line: Lyric.Runtime.LineNormal) => {
  const backgroundLines = line.backgrounds
  if (!backgroundLines.length) {
    return
  }

  const annotation = line.content?.annotation
  if (!annotation) {
    return
  }

  const split = (
    items: { content: string; language?: string }[],
    push: (background: Lyric.Runtime.LineBackground, content: string, language?: string) => void,
  ) => {
    for (const item of items) {
      if (!item.content.trim()) {
        continue
      }

      const [main, backgrounds] = extractInLineExtended(item.content)
      item.content = main

      for (let i = 0; i < backgrounds.length; i++) {
        if (i >= backgroundLines.length) {
          continue
        }
        push(backgroundLines[i], backgrounds[i], item.language)
      }
    }
  }

  split(annotation.translates, (background, text, language) => {
    const content = background.content ?? (background.content = Lyric.Runtime.makeLineContent())
    const target = content.annotation ?? (content.annotation = Lyric.Runtime.makeLineAnnotation())
    target.translates.push(Lyric.Runtime.makeLineAnnotationTranslate({ content: text, language }))
  })
  split(annotation.romans, (background, text, language) => {
    const content = background.content ?? (background.content = Lyric.Runtime.makeLineContent())
    const target = content.annotation ?? (content.annotation = Lyric.Runtime.makeLineAnnotation())
    target.romans.push(Lyric.Runtime.makeLineAnnotationRoman({ content: text, language }))
  })
}

export const extractCrossLine = (lines: Lyric.Runtime.Line[]): Lyric.Runtime.Line[] => {
  const result: Lyric.Runtime.Line[] = []

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

    if (Lyric.Runtime.isLineNormal(current) && Lyric.Runtime.isLineNormal(next)) {
      // Skip if current line has complete brackets
      if (hasStartOpenBracket(current.body.value) && hasEndCloseBracket(current.body.value)) {
        result.push(current)
        continue
      }

      if (hasStartOpenBracket(current.body.value) && hasEndCloseBracket(next.body.value)) {
        if (Lyric.Runtime.isLineNormal(prev)) {
          addBackground(prev.body.value, toBackground(current))
          addBackground(prev.body.value, toBackground(next))

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
