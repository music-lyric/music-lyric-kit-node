import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { getChildElementsByLocalName, getAttributeByName, getTextContent, parseSpanTime } from '@root/utils'

const parseRubyItems = (container: Xml.XmlElement): Lyric.Runtime.WordAnnotationContent[] => {
  const tokens: Lyric.Runtime.WordAnnotationContent[] = []
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
    tokens.push(Lyric.Runtime.makeWordAnnotationContent({ content, time: Lyric.Common.makeTime({ start: time.start, end: time.end }) }))
  }
  return tokens
}

export const interceptRubySpan = (span: Xml.XmlElement, words: Lyric.Runtime.Word[]): boolean => {
  if (getAttributeByName(span, 'ruby', true) !== 'container') {
    return false
  }

  let base = ''
  let items: Lyric.Runtime.WordAnnotationContent[] = []
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
  const ruby = Lyric.Runtime.makeWordAnnotationRuby({ words: items, time: Lyric.Common.makeTime({ start, end }), phraseStart })

  const word = Lyric.Runtime.makeWordNormal({
    content: base,
    time: Lyric.Common.makeTime({ start, end }),
    annotation: Lyric.Runtime.makeWordAnnotation({ ruby }),
  })

  words.push(word)
  return true
}
