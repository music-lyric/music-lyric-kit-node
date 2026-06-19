import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { findElementsByLocalName, getChildElementByLocal, getAttributeByName, getTextContent } from '@root/utils'

const readTranslationText = (text: Xml.XmlElement): string => {
  const spans = getChildElementByLocal(text, 'span')
  if (spans.length) {
    let result = ''
    for (const span of spans) {
      result += getTextContent(span)
    }
    return result.trim()
  }
  return getTextContent(text).trim()
}

export const attachTranslations = (root: Xml.XmlElement, keyMap: Map<string, Lyric.LineNormal>) => {
  const translations = findElementsByLocalName(root, 'translation')

  for (const translation of translations) {
    const language = getAttributeByName(translation, 'lang', true)
    const texts = findElementsByLocalName(translation, 'text')

    for (const text of texts) {
      const key = getAttributeByName(text, 'for')
      if (!key) {
        continue
      }

      const line = keyMap.get(key)
      if (!line) {
        continue
      }

      const content = readTranslationText(text)
      if (!content) {
        continue
      }

      const item = new Lyric.LineAnnotationItem()
      item.content = content
      if (language) {
        item.language = language
      }
      line.annotation.translates = [...(line.annotation.translates || []), item]
    }
  }
}
