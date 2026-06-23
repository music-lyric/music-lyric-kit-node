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
    tokens.push(new Lyric.WordAnnotationContent({ content, time: new Lyric.Time(time.start, time.end) }))
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

  const phraseStart = getAttributeByName(span, 'rubyPhraseStart', true) === 'true'
  const ruby = new Lyric.WordRubyAnnotation({ words: items, time: new Lyric.Time(start, end), phraseStart })

  const word = new Lyric.WordNormal({
    content: base,
    time: new Lyric.Time(start, end),
    annotation: new Lyric.WordAnnotation({ ruby }),
  })

  words.push(word)
  return true
}
