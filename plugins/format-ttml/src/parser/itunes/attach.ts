import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import type { ElementGroups } from '@root/utils'
import {
  findElementsByLocalName,
  getChildElementsByLocalName,
  hasChildElementByLocalName,
  getAttributeByName,
  getTextContent,
  parseTextToWords,
} from '@root/utils'
import { parseSpanWords } from './line'
import { appendLineTranslate, appendLineRoman, normalizeLanguage } from './annotation'

type AnnotationTextHandler = (text: Xml.XmlElement, line: Lyric.LineNormal, language?: string, type?: string) => void

const eachAnnotationText = (blocks: Xml.XmlElement[], lineMap: Map<string, Lyric.LineNormal>, handle: AnnotationTextHandler) => {
  for (const item of blocks) {
    const language = getAttributeByName(item, 'lang', true)
    const type = getAttributeByName(item, 'type')

    const texts = findElementsByLocalName(item, 'text')
    for (const text of texts) {
      const key = getAttributeByName(text, 'for')
      if (!key) {
        continue
      }
      const line = lineMap.get(key)
      if (line) {
        handle(text, line, language, type)
      }
    }
  }
}

const readReplacementWords = (text: Xml.XmlElement): Lyric.Word[] => {
  if (hasChildElementByLocalName(text, 'span')) {
    return parseSpanWords(text)
  }
  const plain = getTextContent(text).trim()
  return plain ? parseTextToWords(plain) : []
}

const attachTranslate = (blocks: Xml.XmlElement[], lineMap: Map<string, Lyric.LineNormal>) => {
  eachAnnotationText(blocks, lineMap, (text, line, language, type) => {
    // replacement overrides the original wording (e.g. traditional to simplified).
    if (type === 'replacement') {
      const words = readReplacementWords(text)
      if (words.length) {
        line.words = words
      }
      return
    }
    // head subtitle wins over an inline x-translation of the same language.
    appendLineTranslate(line, getTextContent(text), language, true)
  })
}

const hasTimedSpans = (text: Xml.XmlElement): boolean => {
  const spans = getChildElementsByLocalName(text, 'span')
  for (const span of spans) {
    if (getAttributeByName(span, 'begin', true) && getAttributeByName(span, 'end', true)) {
      return true
    }
  }
  return false
}

const findBodyWordByTime = (
  words: Lyric.Word[],
  startMap: Map<number, Lyric.WordNormal>,
  start: number,
  end: number,
): Lyric.WordNormal | undefined => {
  // roman spans align to body words by exact start time (1:1 in practice).
  const exact = startMap.get(start)
  if (exact) {
    return exact
  }
  // otherwise fall back to the largest time overlap.
  let best: Lyric.WordNormal | undefined
  let bestOverlap = 0
  for (const word of words) {
    if (word.type !== Lyric.WordType.Normal || !word.time) {
      continue
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
  const startMap = new Map<number, Lyric.WordNormal>()
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word.type === Lyric.WordType.Normal) {
      indexMap.set(word, i)
      if (word.time) {
        startMap.set(word.time.start, word)
      }
    }
  }

  const roman = parseSpanWords(text)
  const entries: RomanEntry[] = []
  for (let i = 0; i < roman.length; i++) {
    const span = roman[i]
    if (span.type !== Lyric.WordType.Normal || !span.time) {
      continue
    }
    const target = findBodyWordByTime(words, startMap, span.time.start, span.time.end)
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

  const lang = normalizeLanguage(language)
  for (const [word, tokens] of groups) {
    const item = new Lyric.WordAnnotationItem()
    item.words = tokens

    item.time = new Lyric.Time()
    item.time.start = tokens[0].time!.start
    item.time.end = tokens[tokens.length - 1].time!.end

    if (lang) {
      item.language = lang
    }

    word.annotation ??= new Lyric.WordAnnotation()
    word.annotation.romans = [...(word.annotation.romans || []), item]
  }

  return true
}

const attachRoman = (blocks: Xml.XmlElement[], lineMap: Map<string, Lyric.LineNormal>) => {
  eachAnnotationText(blocks, lineMap, (text, line, language) => {
    if (hasTimedSpans(text) && attachWordRomans(text, line, language)) {
      return
    }
    appendLineRoman(line, getTextContent(text), language)
  })
}

/**
 * Attach head iTunesMetadata translations and transliterations to body lines by itunes:key.
 *
 * Shared by every TTML dialect, since amll is itunes plus its own amll:meta.
 */
export const attachHeadAnnotations = (groups: ElementGroups, lineMap: Map<string, Lyric.LineNormal>) => {
  if (!lineMap.size) {
    return
  }
  attachTranslate(groups.get('translation') ?? [], lineMap)
  attachRoman(groups.get('transliteration') ?? [], lineMap)
}
