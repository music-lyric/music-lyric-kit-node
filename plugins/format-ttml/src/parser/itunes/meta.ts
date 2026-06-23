import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { getChildElementsByLocalName, getAttributeByName, getTextContent } from '@root/utils'

const parseSongwriters = (elements: Xml.XmlElement[]): Lyric.MetaItem | undefined => {
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

  return Lyric.createMetaItem(Lyric.MetaType.Creator, 'songWriter', { role: 'songWriter', name: names })
}

export const parseItunesMetas = (songwriters: Xml.XmlElement[]): Lyric.MetaItem[] => {
  const result: Lyric.MetaItem[] = []

  const creator = parseSongwriters(songwriters)
  if (creator) {
    result.push(creator)
  }

  return result
}

const resolveAgentType = (type: string): Lyric.AgentType => {
  switch (type) {
    case 'person':
      return Lyric.AgentType.Person
    case 'group':
      return Lyric.AgentType.Group
    case 'other':
      return Lyric.AgentType.Other
    default:
      return Lyric.AgentType.Unknown
  }
}

const parseAgentNames = (element: Xml.XmlElement): string[] => {
  const result: string[] = []
  for (const child of getChildElementsByLocalName(element, 'name')) {
    const name = getTextContent(child).trim()
    if (name) {
      result.push(name)
    }
  }
  return result
}

const parseAgent = (element: Xml.XmlElement) => {
  const type = getAttributeByName(element, 'type', true)
  const id = getAttributeByName(element, 'id', true)

  if (!type || !id) {
    return null
  }

  return new Lyric.AgentItem({ id, type: resolveAgentType(type), names: parseAgentNames(element) })
}

export const parseAgents = (agents: Xml.XmlElement[]) => {
  const result: Lyric.AgentItem[] = []

  for (const element of agents) {
    const item = parseAgent(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}
