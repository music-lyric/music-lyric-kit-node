import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { getChildElementsByLocalName, getAttributeByName, getTextContent } from '@root/utils'

export const applyItunesMetas = (meta: Lyric.Runtime.Proto.Meta, songwriters: Xml.XmlElement[]) => {
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
    Lyric.Runtime.makeMetaCredit({
      role: 'songWriter',
      names: names.map((name) => Lyric.Runtime.makeMetaText({ content: name })),
    }),
  )
}

const resolveAgentType = (type: string): Lyric.Common.Proto.AgentType => {
  switch (type) {
    case 'person':
      return Lyric.Common.Proto.AgentType.PERSON
    case 'group':
      return Lyric.Common.Proto.AgentType.GROUP
    case 'other':
      return Lyric.Common.Proto.AgentType.OTHER
    default:
      return Lyric.Common.Proto.AgentType.UNKNOWN
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

  return Lyric.Runtime.makeAgentItem({ id, type: resolveAgentType(type), names: parseAgentNames(element) })
}

export const parseAgents = (agents: Xml.XmlElement[]): Lyric.Runtime.Proto.AgentItem[] => {
  const result: Lyric.Runtime.Proto.AgentItem[] = []

  for (const element of agents) {
    const item = parseAgent(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}
