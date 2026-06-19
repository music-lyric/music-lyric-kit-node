import { Lyric } from '@music-lyric-kit/lyric'

import { SIMPLIFIED_SET, TRADITIONAL_SET, KANA_RULE, HANGUL_RULE, HAN_RULE, CYRILLIC_RULE, LATIN_RULE } from './constants'

export type Script = 'kana' | 'hangul' | 'han' | 'cyrillic' | 'latin'

export const detectScript = (text: string): Script | undefined => {
  if (!text) {
    return undefined
  }

  // ordered by script specificity: kana and hangul win even when mixed with han
  if (KANA_RULE.test(text)) {
    return 'kana'
  }
  if (HANGUL_RULE.test(text)) {
    return 'hangul'
  }
  if (HAN_RULE.test(text)) {
    return 'han'
  }
  if (CYRILLIC_RULE.test(text)) {
    return 'cyrillic'
  }
  if (LATIN_RULE.test(text)) {
    return 'latin'
  }

  return undefined
}

export const detectChineseVariant = (text: string): Lyric.LanguageTag | undefined => {
  let simplified = 0
  let traditional = 0

  for (const ch of text) {
    if (SIMPLIFIED_SET.has(ch)) {
      simplified++
    } else if (TRADITIONAL_SET.has(ch)) {
      traditional++
    }
  }

  if (traditional > simplified) {
    return Lyric.LanguageType.ChineseTraditional
  }
  if (simplified > traditional) {
    return Lyric.LanguageType.ChineseSimplified
  }

  return undefined
}
