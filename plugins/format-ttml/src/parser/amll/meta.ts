import { Lyric } from '@music-lyric-kit/lyric'

import { Xml } from '@music-lyric-kit/utils'
import { findElementsByLocalName, getAttributeByName } from '@root/utils'

const processMeta = (element: Xml.XmlElement): Lyric.MetaItem | undefined => {
  const key = getAttributeByName(element, 'key', true)
  const value = getAttributeByName(element, 'value', true)

  if (!key || !value) {
    return undefined
  }

  switch (key) {
    case 'musicName':
      return Lyric.createMetaItem(Lyric.MetaType.Title, key, value.trim())
    case 'artists':
      return Lyric.createMetaItem(Lyric.MetaType.Singer, key, value.trim())
    case 'album':
      return Lyric.createMetaItem(Lyric.MetaType.Album, key, value.trim())
    case 'isrc':
      return Lyric.createMetaItem(Lyric.MetaType.Isrc, key, value.trim())
    case 'ttmlAuthorGithubLogin':
      return Lyric.createMetaItem(Lyric.MetaType.Author, key, value.trim())
    default:
      // keep every other amll:meta (platform ids, github id, ...) under its original key for round-trip
      return Lyric.createMetaItem(Lyric.MetaType.Unknown, key, value.trim())
  }
}

export const processMetas = (metadata?: Xml.XmlElement) => {
  if (!metadata) {
    return []
  }

  const result: Lyric.MetaItem[] = []
  const elements = findElementsByLocalName(metadata, 'meta')

  for (const element of elements) {
    const item = processMeta(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}
