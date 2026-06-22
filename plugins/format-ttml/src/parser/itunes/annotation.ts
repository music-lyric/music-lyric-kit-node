import { Lyric } from '@music-lyric-kit/lyric'

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

export const appendLineTranslate = (line: Lyric.LineNormal, content: string, language?: string, fromItunes: boolean = false) => {
  const text = content.trim()
  if (!text) {
    return
  }

  const lang = normalizeLanguage(language)

  const item = new Lyric.LineAnnotationItem()
  item.content = text
  if (lang) {
    item.language = lang
  }

  const list = line.annotation.translates || []
  const index = list.findIndex((entry) => normalizeLanguage(entry.language) === lang)

  if (index < 0) {
    line.annotation.translates = [...list, item]
    return
  }

  if (fromItunes) {
    list[index] = item
    line.annotation.translates = list
  }
}

export const appendLineRoman = (line: Lyric.LineNormal, content: string, language?: string) => {
  const text = content.trim()
  if (!text) {
    return
  }

  const item = new Lyric.LineAnnotationItem()
  item.content = text

  const lang = normalizeLanguage(language)
  if (lang) {
    item.language = lang
  }

  line.annotation.romans = [...(line.annotation.romans || []), item]
}
