import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { findElementsByLocalName, getChildElementByLocal, getAttributeByName, getTextContent } from '@root/utils'
import { processSpanWords } from '@root/common'

const hasTimedSpans = (text: Xml.XmlElement): boolean => {
  const spans = getChildElementByLocal(text, 'span')
  for (const span of spans) {
    if (getAttributeByName(span, 'begin', true) && getAttributeByName(span, 'end', true)) {
      return true
    }
  }
  return false
}

// find the body word owning a romaji span: exact start first, otherwise the largest time overlap.
const findWordByTime = (words: Lyric.Word[], start: number, end: number): Lyric.WordNormal | undefined => {
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

// whether any body word between two indices is a space.
const hasSpaceBetween = (words: Lyric.Word[], a: number, b: number): boolean => {
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

// attach per-syllable romaji to the matching body words; returns false when nothing aligned.
const attachWordRomans = (text: Xml.XmlElement, line: Lyric.LineNormal, language?: string): boolean => {
  const words = line.words
  const indexOf = new Map<Lyric.WordNormal, number>()
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word.type === Lyric.WordType.Normal) {
      indexOf.set(word, i)
    }
  }

  // pass 1: map each romaji syllable to a body word, noting where the romaji breaks into words.
  const romaji = processSpanWords(text)
  const entries: RomanEntry[] = []
  for (let i = 0; i < romaji.length; i++) {
    const span = romaji[i]
    if (span.type !== Lyric.WordType.Normal || !span.time) {
      continue
    }
    const target = findWordByTime(words, span.time.start, span.time.end)
    if (!target) {
      continue
    }
    entries.push({
      content: span.content,
      start: span.time.start,
      end: span.time.end,
      target,
      boundary: romaji[i + 1]?.type === Lyric.WordType.Space,
    })
  }

  if (!entries.length) {
    return false
  }

  // pass 2: group tokens by body word, keeping a romaji word break only where the body has no space of its own.
  const groups = new Map<Lyric.WordNormal, Lyric.WordAnnotationContent[]>()
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const next = entries[i + 1]

    let content = entry.content
    if (entry.boundary && next) {
      const from = indexOf.get(entry.target)
      const to = indexOf.get(next.target)
      const bodySpaced = from !== undefined && to !== undefined && hasSpaceBetween(words, from, to)
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

  for (const [word, tokens] of groups) {
    const item = new Lyric.WordAnnotationItem()
    item.words = tokens
    if (language) {
      item.language = language
    }
    item.time = new Lyric.Time()
    item.time.start = tokens[0].time!.start
    item.time.end = tokens[tokens.length - 1].time!.end

    word.annotation ??= new Lyric.WordAnnotation()
    word.annotation.romans = [...(word.annotation.romans || []), item]
  }

  return true
}

export const attachRoman = (root: Xml.XmlElement, keyMap: Map<string, Lyric.LineNormal>) => {
  const transliterations = findElementsByLocalName(root, 'transliteration')

  for (const transliteration of transliterations) {
    const language = getAttributeByName(transliteration, 'lang', true)
    const texts = findElementsByLocalName(transliteration, 'text')

    for (const text of texts) {
      const key = getAttributeByName(text, 'for')
      if (!key) {
        continue
      }

      const line = keyMap.get(key)
      if (!line) {
        continue
      }

      // per-syllable timing attaches to the matching words; plain text falls back to line level.
      if (hasTimedSpans(text) && attachWordRomans(text, line, language)) {
        continue
      }

      const content = getTextContent(text).trim()
      if (!content) {
        continue
      }

      const item = new Lyric.LineAnnotationItem()
      item.content = content
      if (language) {
        item.language = language
      }
      line.annotation.romans = [...(line.annotation.romans || []), item]
    }
  }
}
