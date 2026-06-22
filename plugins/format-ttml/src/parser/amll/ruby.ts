import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { getChildElementsByLocalName, getAttributeByName, getTextContent, parseSpanTime } from '@root/utils'

const parseRubyItems = (container: Xml.XmlElement): Lyric.WordAnnotationContent[] => {
  const tokens: Lyric.WordAnnotationContent[] = []
  for (const span of getChildElementsByLocalName(container, 'span')) {
    if (getAttributeByName(span, 'ruby', true) !== 'text') {
      continue
    }
    const content = getTextContent(span).trim()
    if (!content) {
      continue
    }
    const time = parseSpanTime(span)
    if (!time) {
      continue
    }
    const token = new Lyric.WordAnnotationContent()
    token.content = content
    token.time = new Lyric.Time()
    token.time.start = time.start
    token.time.end = time.end
    tokens.push(token)
  }
  return tokens
}

export const interceptRubySpan = (span: Xml.XmlElement, words: Lyric.Word[]): boolean => {
  if (getAttributeByName(span, 'ruby', true) !== 'container') {
    return false
  }

  let base = ''
  let items: Lyric.WordAnnotationContent[] = []
  for (const child of getChildElementsByLocalName(span, 'span')) {
    const kind = getAttributeByName(child, 'ruby', true)
    if (kind === 'base') {
      base = getTextContent(child).trim()
    } else if (kind === 'textContainer') {
      items = parseRubyItems(child)
    }
  }

  // a span already identified as a ruby container is fully owned here, even when malformed.
  if (!base || !items.length) {
    return true
  }

  const start = items[0].time!.start
  const end = items[items.length - 1].time!.end

  const word = new Lyric.WordNormal()
  word.content = base
  word.time = new Lyric.Time()
  word.time.start = start
  word.time.end = end

  const ruby = new Lyric.WordAnnotationItem()
  ruby.words = items
  ruby.time = new Lyric.Time()
  ruby.time.start = start
  ruby.time.end = end

  word.annotation = new Lyric.WordAnnotation()
  word.annotation.ruby = ruby

  words.push(word)
  return true
}
