import type { MatchItem } from './utils'

import { Lyric } from '@music-lyric-kit/lyric'
import { parseTime } from '@music-lyric-kit/utils'

const processItem = (key: string, rawKey: string, value: string): Lyric.MetaItem => {
  switch (key) {
    case 'offset':
      return Lyric.createMetaItem(Lyric.MetaType.Offset, rawKey, Number(value) || 0)
    case 'length':
    case 'duration':
      return Lyric.createMetaItem(Lyric.MetaType.Duration, rawKey, parseTime(value) || 0)
    case 'ti':
    case 'title':
      return Lyric.createMetaItem(Lyric.MetaType.Title, rawKey, value.trim())
    case 'ar':
    case 'artist':
      return Lyric.createMetaItem(Lyric.MetaType.Singer, rawKey, value.trim())
    case 'al':
    case 'album':
      return Lyric.createMetaItem(Lyric.MetaType.Album, rawKey, value.trim())
    case 'by':
      return Lyric.createMetaItem(Lyric.MetaType.Author, rawKey, value.trim())
    case 'isrc':
      return Lyric.createMetaItem(Lyric.MetaType.Isrc, rawKey, value.trim())
  }
  return Lyric.createMetaItem(Lyric.MetaType.Unknown, rawKey, value.trim())
}

const LYRIC_META_REGEXP = /^\s*\[\s*([A-Za-z0-9_-]+)\s*:\s*([^\]]*)\s*\]\s*$/

export const processMetas = (metas: MatchItem[]) => {
  const result: Lyric.MetaItem[] = []

  for (const meta of metas) {
    if (!meta.tag) {
      continue
    }

    const matched = meta.tag.match(LYRIC_META_REGEXP)
    if (!matched) {
      continue
    }

    const rawKey = (matched[1] || '').trim()
    const key = rawKey.toLowerCase()
    const value = (matched[2] || '').trim()
    if (!key || !value) {
      continue
    }

    const target = processItem(key, rawKey, value)

    result.push(target)
  }

  return result
}
