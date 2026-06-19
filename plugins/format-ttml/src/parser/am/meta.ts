import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { findElementsByLocalName, getTextContent } from '@root/utils'

const processSongWriters = (metadata: Xml.XmlElement): Lyric.MetaItem | undefined => {
  const elements = findElementsByLocalName(metadata, 'songwriter')

  const names: string[] = []
  for (const element of elements) {
    const name = getTextContent(element).trim()
    if (name) {
      names.push(name)
    }
  }

  if (!names.length) {
    return undefined
  }

  return Lyric.createMetaItem(Lyric.MetaType.Creator, 'songwriter', { role: 'songwriter', name: names })
}

export const processMetas = (metadata?: Xml.XmlElement) => {
  if (!metadata) {
    return []
  }

  const result: Lyric.MetaItem[] = []

  const songWriters = processSongWriters(metadata)
  if (songWriters) {
    result.push(songWriters)
  }

  return result
}
