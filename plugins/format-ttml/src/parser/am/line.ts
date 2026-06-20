import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import {
  findElementsByLocalName,
  hasChildElementByLocal,
  getChildElementByLocal,
  getAttributeByName,
  getTextContent,
  processTextToWords,
} from '@root/utils'
import { processLine, processSpanWords } from '@root/common'

type LineTextHandler = (text: Xml.XmlElement, line: Lyric.LineNormal, language?: string, type?: string) => void

const eachAnnotationText = (root: Xml.XmlElement, keyMap: Map<string, Lyric.LineNormal>, block: string, handle: LineTextHandler) => {
  const blocks = findElementsByLocalName(root, block)
  for (const item of blocks) {
    const language = getAttributeByName(item, 'lang', true)
    const type = getAttributeByName(item, 'type')
    const texts = findElementsByLocalName(item, 'text')

    for (const text of texts) {
      const key = getAttributeByName(text, 'for')
      if (!key) {
        continue
      }

      const line = keyMap.get(key)
      if (!line) {
        continue
      }

      handle(text, line, language, type)
    }
  }
}

const createLineAnnotationItem = (text: Xml.XmlElement, language?: string): Lyric.LineAnnotationItem | undefined => {
  const content = getTextContent(text).trim()
  if (!content) {
    return undefined
  }

  const item = new Lyric.LineAnnotationItem()
  item.content = content
  if (language) {
    item.language = language
  }

  return item
}

const readReplacementWords = (text: Xml.XmlElement): Lyric.Word[] => {
  if (hasChildElementByLocal(text, 'span')) {
    return processSpanWords(text)
  }
  const plain = getTextContent(text).trim()
  return plain ? processTextToWords(plain) : []
}

const attachTranslate = (root: Xml.XmlElement, keyMap: Map<string, Lyric.LineNormal>) => {
  eachAnnotationText(root, keyMap, 'translation', (text, line, language, type) => {
    // replacement overrides the original wording (e.g. traditional to simplified).
    if (type === 'replacement') {
      const words = readReplacementWords(text)
      if (words.length) {
        line.words = words
      }
      return
    }

    const item = createLineAnnotationItem(text, language)
    if (item) {
      line.annotation.translates = [...(line.annotation.translates || []), item]
    }
  })
}

const hasTimedSpans = (text: Xml.XmlElement): boolean => {
  const spans = getChildElementByLocal(text, 'span')
  for (const span of spans) {
    if (getAttributeByName(span, 'begin', true) && getAttributeByName(span, 'end', true)) {
      return true
    }
  }
  return false
}

const findBodyWordByTime = (words: Lyric.Word[], start: number, end: number): Lyric.WordNormal | undefined => {
  let best: Lyric.WordNormal | undefined
  let bestOverlap = 0
  for (const word of words) {
    if (word.type !== Lyric.WordType.Normal || !word.time) {
      continue
    }
    if (word.time.start === start) {
      return word
    }
    const overlap = Math.min(end, word.time.end) - Math.max(start, word.time.start)
    if (overlap > bestOverlap) {
      bestOverlap = overlap
      best = word
    }
  }
  return best
}

const hasWordSpaceBetween = (words: Lyric.Word[], a: number, b: number): boolean => {
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  for (let i = lo + 1; i < hi; i++) {
    if (words[i].type === Lyric.WordType.Space) {
      return true
    }
  }
  return false
}

interface RomanEntry {
  content: string
  start: number
  end: number
  target: Lyric.WordNormal
  boundary: boolean
}

const attachWordRomans = (text: Xml.XmlElement, line: Lyric.LineNormal, language?: string): boolean => {
  const words = line.words

  const indexMap = new Map<Lyric.WordNormal, number>()
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word.type === Lyric.WordType.Normal) {
      indexMap.set(word, i)
    }
  }

  const roman = processSpanWords(text)
  const entries: RomanEntry[] = []
  for (let i = 0; i < roman.length; i++) {
    const span = roman[i]
    if (span.type !== Lyric.WordType.Normal || !span.time) {
      continue
    }
    const target = findBodyWordByTime(words, span.time.start, span.time.end)
    if (!target) {
      continue
    }
    entries.push({
      content: span.content,
      start: span.time.start,
      end: span.time.end,
      target,
      boundary: roman[i + 1]?.type === Lyric.WordType.Space,
    })
  }

  if (!entries.length) {
    return false
  }

  const groups = new Map<Lyric.WordNormal, Lyric.WordAnnotationContent[]>()
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const next = entries[i + 1]

    let content = entry.content
    if (entry.boundary && next) {
      const from = indexMap.get(entry.target)
      const to = indexMap.get(next.target)
      const bodySpaced = from !== undefined && to !== undefined && hasWordSpaceBetween(words, from, to)
      if (!bodySpaced) {
        content += ' '
      }
    }

    const token = new Lyric.WordAnnotationContent()
    token.content = content
    token.time = new Lyric.Time()
    token.time.start = entry.start
    token.time.end = entry.end

    const list = groups.get(entry.target)
    if (list) {
      list.push(token)
    } else {
      groups.set(entry.target, [token])
    }
  }

  let head: Lyric.WordAnnotationContent | undefined
  let tail: Lyric.WordAnnotationContent | undefined
  let headIndex = Infinity
  let tailIndex = -Infinity
  for (const [word, tokens] of groups) {
    const index = indexMap.get(word)
    if (index === undefined) {
      continue
    }
    if (index < headIndex) {
      headIndex = index
      head = tokens[0]
    }
    if (index > tailIndex) {
      tailIndex = index
      tail = tokens[tokens.length - 1]
    }
  }
  if (head) {
    head.content = head.content.trimStart()
  }
  if (tail) {
    tail.content = tail.content.trimEnd()
  }

  for (const [word, tokens] of groups) {
    const item = new Lyric.WordAnnotationItem()
    item.words = tokens

    item.time = new Lyric.Time()
    item.time.start = tokens[0].time!.start
    item.time.end = tokens[tokens.length - 1].time!.end

    word.annotation ??= new Lyric.WordAnnotation()
    word.annotation.romans = [...(word.annotation.romans || []), item]

    if (language) {
      item.language = language
    }
  }

  return true
}

const attachRoman = (root: Xml.XmlElement, keyMap: Map<string, Lyric.LineNormal>) => {
  eachAnnotationText(root, keyMap, 'transliteration', (text, line, language) => {
    if (hasTimedSpans(text) && attachWordRomans(text, line, language)) {
      return
    }
    const item = createLineAnnotationItem(text, language)
    if (!item) {
      return
    }
    if (!line.annotation.romans) {
      line.annotation.romans = [item]
    } else {
      line.annotation.romans.push(item)
    }
  })
}

export const processLines = (body: Xml.XmlElement | undefined, root: Xml.XmlElement): Lyric.LineNormal[] => {
  const lines: Lyric.LineNormal[] = []
  if (!body) {
    return lines
  }

  const lineMap = new Map<string, Lyric.LineNormal>()

  const elements = findElementsByLocalName(body, 'p')
  for (const element of elements) {
    const line = processLine(element)
    if (!line) {
      continue
    }
    lines.push(line)
    const key = getAttributeByName(element, 'key', true)
    if (key) {
      lineMap.set(key, line)
    }
  }

  attachTranslate(root, lineMap)
  attachRoman(root, lineMap)

  return lines
}
