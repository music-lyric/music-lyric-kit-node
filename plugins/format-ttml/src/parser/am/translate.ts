import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import {
  findElementsByLocalName,
  getChildElementByLocal,
  hasChildElementByLocal,
  getAttributeByName,
  getTextContent,
  processTextToWords,
} from '@root/utils'
import { processSpanWords } from '@root/common'

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

const readReplacementWords = (text: Xml.XmlElement): Lyric.Word[] => {
  if (hasChildElementByLocal(text, 'span')) {
    return processSpanWords(text)
  }
  const plain = getTextContent(text).trim()
  return plain ? processTextToWords(plain) : []
}

export const attachTranslate = (root: Xml.XmlElement, keyMap: Map<string, Lyric.LineNormal>) => {
  const translations = findElementsByLocalName(root, 'translation')

  for (const translation of translations) {
    const type = getAttributeByName(translation, 'type')
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

      // replacement overrides the original wording (e.g. traditional to simplified).
      if (type === 'replacement') {
        const words = readReplacementWords(text)
        if (words.length) {
          line.words = words
        }
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
