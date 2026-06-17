import { Lyric } from '@music-lyric-kit/lyric'

import { Xml } from '@music-lyric-kit/utils'
import { findElementsByLocalName, getAttributeByName } from '@root/utils'

const processMeta = (element: Xml.XmlElement) => {
  const key = getAttributeByName(element, 'key', true)
  const value = getAttributeByName(element, 'value', true)

  if (!key || !value) {
    return null
  }

  switch (key) {
    case 'musicName':
      const title = new Lyric.MetaTitle()
      title.content = value.trim()
      return title
    case 'artists':
      const singer = new Lyric.MetaSinger()
      singer.content = value.trim()
      return singer
    case 'album':
      const album = new Lyric.MetaAlbum()
      album.content = value.trim()
      return album
  }
}

export const processMetas = (metadata?: Xml.XmlElement) => {
  if (!metadata) {
    return []
  }

  const result: Lyric.Meta[] = []
  const elements = findElementsByLocalName(metadata, 'meta')

  for (const element of elements) {
    const item = processMeta(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}
