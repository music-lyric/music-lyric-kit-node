import { Lyric } from '@music-lyric-kit/lyric'

import { ensureAnnotation } from '@root/utils'

/**
 * Normalize a language tag to lower case.
 *
 * Chinese tags collapse to their script, e.g. zh-hans-cn -> zh-hans, zh-hant-tw -> zh-hant.
 */
export const normalizeLanguage = (language?: string): string | undefined => {
  const value = language?.trim().toLowerCase()
  if (!value) {
    return undefined
  }

  if (value.startsWith('zh')) {
    if (value.includes('hant')) {
      return 'zh-hant'
    }
    if (value.includes('hans')) {
      return 'zh-hans'
    }
  }

  return value
}

export const appendLineTranslate = (
  line: Lyric.Runtime.LineNormal | Lyric.Runtime.LineBackground,
  content: string,
  language?: string,
  fromItunes: boolean = false,
) => {
  const text = content.trim()
  if (!text) {
    return
  }

  const lang = normalizeLanguage(language)

  const item = Lyric.Runtime.makeLineAnnotationTranslate({ content: text, language: lang || undefined })

  const annotation = ensureAnnotation(line)
  const list = annotation.translates
  const index = list.findIndex((entry) => normalizeLanguage(entry.language) === lang)

  if (index < 0) {
    list.push(item)
    return
  }

  if (fromItunes) {
    list[index] = item
  }
}

export const appendLineRoman = (line: Lyric.Runtime.LineNormal | Lyric.Runtime.LineBackground, content: string, language?: string) => {
  const text = content.trim()
  if (!text) {
    return
  }

  const lang = normalizeLanguage(language)

  const item = Lyric.Runtime.makeLineAnnotationRoman({ content: text, language: lang || undefined })

  const annotation = ensureAnnotation(line)
  annotation.romans.push(item)
}
