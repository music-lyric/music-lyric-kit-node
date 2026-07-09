import type { MatchItem } from './utils'

import { Lyric } from '@music-lyric-kit/lyric'
import { parseTime } from '@music-lyric-kit/utils'

const applyMeta = (meta: Lyric.Runtime.Proto.Meta, key: string, rawKey: string, content: string) => {
  switch (key) {
    case 'offset':
      meta.offset = Number(content) || 0
      return
    case 'length':
    case 'duration':
      meta.duration = parseTime(content) || 0
      return
    case 'ti':
    case 'title':
      meta.titles.push(Lyric.Runtime.makeMetaText({ content }))
      return
    case 'ar':
    case 'artist':
      meta.artists.push(Lyric.Runtime.makeMetaText({ content }))
      return
    case 'al':
    case 'album':
      meta.albums.push(Lyric.Runtime.makeMetaText({ content }))
      return
    case 'by':
      meta.authors.push(Lyric.Runtime.makeMetaText({ content }))
      return
    case 'isrc':
      meta.isrcs.push(content)
      return
  }
  meta.unknowns.push(Lyric.Runtime.makeMetaUnknown({ key: rawKey, value: content }))
}

const LYRIC_META_REGEXP = /^\s*\[\s*([A-Za-z0-9_-]+)\s*:\s*([^\]]*)\s*\]\s*$/

export const processMetas = (metas: MatchItem[]): Lyric.Runtime.Proto.Meta => {
  const result = Lyric.Runtime.makeMeta()

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
