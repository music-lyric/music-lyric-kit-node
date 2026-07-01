import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { getChildElementsByLocalName, getAttributeByName, getTextContent } from '@root/utils'

/**
 * Apply iTunesMetadata songwriters to the structured meta as credits.
 */
export const applyItunesMetas = (meta: Lyric.Meta, songwriters: Xml.XmlElement[]) => {
  const names: string[] = []
  for (const element of songwriters) {
    const name = getTextContent(element).trim()
    if (name) {
      names.push(name)
    }
  }

  if (!names.length) {
    return
  }

  meta.credits.push(
    Lyric.makeMetaCredit({
      role: 'songWriter',
      names: names.map((name) => Lyric.makeMetaText({ value: name })),
    }),
  )
}

const resolveAgentType = (type: string): Lyric.AgentType => {
  switch (type) {
    case 'person':
      return Lyric.AgentType.PERSON
    case 'group':
      return Lyric.AgentType.GROUP
    case 'other':
      return Lyric.AgentType.OTHER
    default:
      return Lyric.AgentType.UNKNOWN
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

  return Lyric.makeAgentItem({ id, type: resolveAgentType(type), names: parseAgentNames(element) })
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
