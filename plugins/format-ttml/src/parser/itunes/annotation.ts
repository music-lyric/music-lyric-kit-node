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

  const item = Lyric.createLineAnnotationItem(Lyric.LineAnnotationKind.Translate, { content: text, language: lang || undefined })

  const list = line.annotation.list
  const index = list.findIndex((entry) => entry.kind === Lyric.LineAnnotationKind.Translate && normalizeLanguage(entry.language) === lang)

  if (index < 0) {
    list.push(item)
    return
  }

  if (fromItunes) {
    list[index] = item
  }
}

export const appendLineRoman = (line: Lyric.LineNormal, content: string, language?: string) => {
  const text = content.trim()
  if (!text) {
    return
  }

  const lang = normalizeLanguage(language)

  const item = Lyric.createLineAnnotationItem(Lyric.LineAnnotationKind.Roman, { content: text, language: lang || undefined })

  line.annotation.list.push(item)
}
