import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { parseTime } from '@music-lyric-kit/utils'
import { findElementsByLocalName, hasChildElementByLocalName, getAttributeByName, getTextContent, parseTextToWords, parseSpanTime } from '@root/utils'
import { appendLineTranslate, appendLineRoman } from './annotation'

export interface ParseSpanOptions {
  /**
   * Intercept a span before the default word handling.
   *
   * Returns true when the hook has consumed the span.
   */
  onSpan?: (span: Xml.XmlElement, words: Lyric.Word[]) => boolean
}

export interface ProcessLinesResult {
  /**
   * Parsed normal lines in document order.
   */
  lines: Lyric.LineNormal[]
  /**
   * Lines indexed by their itunes:key, for attaching head annotations.
   */
  lineMap: Map<string, Lyric.LineNormal>
}

const calcEndSpaceCount = (content: string) => {
  let count = 0
  for (let i = content.length - 1; i >= 0 && content[i] === ' '; i--) {
    count++
  }
  return count
}

const calcStartSpaceCount = (content: string) => {
  let count = 0
  for (let i = 0; i < content.length && content[i] === ' '; i++) {
    count++
  }
  return count
}

const parseLineAgent = (element: Xml.XmlElement) => {
  const raw = getAttributeByName(element, 'agent', true)
  if (!raw) {
    return null
  }

  return new Lyric.LineAgent({ id: raw })
}

const resolveLineTime = (element: Xml.XmlElement, background: boolean) => {
  const rawBegin = getAttributeByName(element, 'begin', true)
  const begin = rawBegin ? parseTime(rawBegin) : null

  const rawEnd = getAttributeByName(element, 'end', true)
  const end = rawEnd ? parseTime(rawEnd) : null

  if ((begin === null || end === null) && !background) {
    return null
  }
  return { start: begin ?? 0, end: end ?? 0 }
}

const resolveWordSpace = (content: string, isFirst: boolean) => {
  if (isFirst || content.trim()) {
    return null
  }
  const space = new Lyric.WordSpace({ count: content.length || 1 })
  return space
}

const appendWordSpan = (words: Lyric.Word[], element: Xml.XmlElement): void => {
  const text = getTextContent(element)
  const trimed = text.trim()
  if (!trimed) {
    return
  }

  const time = parseSpanTime(element)
  if (!time) {
    return
  }

  const prev = words[words.length - 1]
  if (text.startsWith(' ') && prev?.type !== Lyric.WordType.Space) {
    words.push(new Lyric.WordSpace({ count: calcStartSpaceCount(text) }))
  }

  words.push(new Lyric.WordNormal({ content: trimed, time: new Lyric.Time(time.start, time.end) }))

  if (text.endsWith(' ')) {
    words.push(new Lyric.WordSpace({ count: calcEndSpaceCount(text) }))
  }
}

/**
 * Builds the ordered word list from a span-bearing element.
 *
 * Text nodes turn into spaces and plain timed spans into words.
 *
 * Spans carrying a ttm:role are handed to onRole and skipped here.
 *
 * A span consumed by options.onSpan is skipped here too.
 */
export const parseSpanWords = (
  element: Xml.XmlElement,
  onRole?: (span: Xml.XmlElement, role: string) => void,
  options?: ParseSpanOptions,
): Lyric.Word[] => {
  const words: Lyric.Word[] = []
  const children = element.children
  for (let i = 0; i < children.length; i++) {
    const item = children[i]

    if (item.type === Xml.XmlNodeType.Text) {
      const space = resolveWordSpace(item.content, i === 0)
      if (space) {
        words.push(space)
      }
      continue
    }

    if (item.type !== Xml.XmlNodeType.Element || item.local !== 'span') {
      continue
    }

    const role = getAttributeByName(item, 'role', true)
    if (role) {
      onRole?.(item, role)
      continue
    }

    if (options?.onSpan?.(item, words)) {
      continue
    }

    appendWordSpan(words, item)
  }
  return words
}

const applyLineRole = (line: Lyric.LineNormal, span: Xml.XmlElement, role: string, background: boolean, options?: ParseSpanOptions) => {
  if (role === 'x-bg') {
    if (background) {
      return
    }
    const bg = parseLine(span, true, options)
    if (bg) {
      line.background ??= []
      line.background.push(bg)
    }
    return
  }

  const text = getTextContent(span).trim()
  if (!text) {
    return
  }

  switch (role) {
    case 'x-translation':
      appendLineTranslate(line, text, getAttributeByName(span, 'lang', true))
      break
    case 'x-roman':
      appendLineRoman(line, text, getAttributeByName(span, 'lang', true))
      break
  }
}

export const parseLine = (element: Xml.XmlElement, background: boolean = false, options?: ParseSpanOptions): Lyric.LineNormal | null => {
  const time = resolveLineTime(element, background)
  if (!time) {
    return null
  }

  const line = new Lyric.LineNormal({ time: new Lyric.Time(time.start, time.end) })

  const agent = parseLineAgent(element)
  if (agent) {
    line.agent = agent
  }

  if (!hasChildElementByLocalName(element, 'span')) {
    const text = getTextContent(element).trim()
    if (!text.length) {
      return null
    }
    line.words = parseTextToWords(text)
    return line
  }

  line.words = parseSpanWords(element, (span, role) => applyLineRole(line, span, role, background, options), options)
  return line
}

export const parseLines = (body?: Xml.XmlElement, options?: ParseSpanOptions): ProcessLinesResult => {
  const lines: Lyric.LineNormal[] = []
  const lineMap = new Map<string, Lyric.LineNormal>()

  if (!body) {
    return { lines, lineMap }
  }

  const elements = findElementsByLocalName(body, 'p')
  for (const element of elements) {
    const line = parseLine(element, false, options)
    if (!line) {
      continue
    }
    lines.push(line)
    const key = getAttributeByName(element, 'key', true)
    if (key) {
      lineMap.set(key, line)
    }
  }

  return { lines, lineMap }
}
