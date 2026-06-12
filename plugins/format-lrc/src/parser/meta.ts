import type { MatchItem } from './utils'

import { Lyric } from '@music-lyric-kit/lyric'
import { parseTime } from '@music-lyric-kit/utils'

const processItem = (key: string, value: string): Lyric.Meta | null => {
  switch (key) {
    case 'offset':
      const offset = new Lyric.MetaOffset()
      offset.content = Number(value) || 0
      return offset
    case 'length':
    case 'duration':
      const duration = new Lyric.MetaDuration()
      duration.content = parseTime(value) || 0
      return duration
    case 'ti':
    case 'title':
      const title = new Lyric.MetaTitle()
      title.content = value.trim()
      return title
    case 'ar':
    case 'artist':
      const singer = new Lyric.MetaSinger()
      singer.content = value.trim()
      return singer
    case 'al':
    case 'album':
      const album = new Lyric.MetaAlbum()
      album.content = value.trim()
      return album
  }
  return null
}

const LYRIC_META_REGEXP = /^\s*\[\s*([A-Za-z0-9_-]+)\s*:\s*([^\]]*)\s*\]\s*$/

export const processMetas = (metas: MatchItem[]) => {
  const result: Lyric.Meta[] = []

  for (const meta of metas) {
    if (!meta.tag) {
      continue
    }

    const matched = meta.tag.match(LYRIC_META_REGEXP)
    if (!matched) {
      continue
    }

    const key = (matched[1] || '').trim().toLowerCase()
    const value = (matched[2] || '').trim()
    if (!key || !value) {
      continue
    }

    const target = processItem(key, value)
    if (!target) {
      continue
    }

    result.push(target)
  }

  return result
}
