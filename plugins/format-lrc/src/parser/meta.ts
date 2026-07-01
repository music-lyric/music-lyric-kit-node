import type { MatchItem } from './utils'

import { Lyric } from '@music-lyric-kit/lyric'
import { parseTime } from '@music-lyric-kit/utils'

/**
 * Apply one parsed meta tag to the structured meta container.
 */
const applyMeta = (meta: Lyric.Meta, key: string, rawKey: string, value: string) => {
  switch (key) {
    case 'offset':
      meta.offset = Number(value) || 0
      return
    case 'length':
    case 'duration':
      meta.duration = parseTime(value) || 0
      return
    case 'ti':
    case 'title':
      meta.titles.push(Lyric.makeMetaText({ value }))
      return
    case 'ar':
    case 'artist':
      meta.artists.push(Lyric.makeMetaText({ value }))
      return
    case 'al':
    case 'album':
      meta.albums.push(Lyric.makeMetaText({ value }))
      return
    case 'by':
      meta.authors.push(Lyric.makeMetaText({ value }))
      return
    case 'isrc':
      meta.isrcs.push(value)
      return
  }
  meta.unknowns.push(Lyric.makeMetaUnknown({ key: rawKey, value }))
}

const LYRIC_META_REGEXP = /^\s*\[\s*([A-Za-z0-9_-]+)\s*:\s*([^\]]*)\s*\]\s*$/

export const processMetas = (metas: MatchItem[]): Lyric.Meta => {
  const result = Lyric.makeMeta()

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

    applyMeta(result, key, rawKey, value)
  }

  return result
}
