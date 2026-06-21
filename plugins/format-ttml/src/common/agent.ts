import { Lyric } from '@music-lyric-kit/lyric'

import { Xml } from '@music-lyric-kit/utils'
import { findElementsByLocalName, getChildElementByLocal, getAttributeByName, getTextContent } from '@root/utils'

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

const processAgentNames = (element: Xml.XmlElement): string[] => {
  const names: string[] = []
  for (const child of getChildElementByLocal(element, 'name')) {
    const name = getTextContent(child).trim()
    if (name) {
      names.push(name)
    }
  }
  return names
}

const processAgent = (element: Xml.XmlElement) => {
  const type = getAttributeByName(element, 'type', true)
  const id = getAttributeByName(element, 'id', true)

  if (!type || !id) {
    return null
  }

  const agent = new Lyric.Agent()
  agent.id = id
  agent.type = resolveAgentType(type)
  agent.names = processAgentNames(element)

  return agent
}

export const processAgents = (metadata?: Xml.XmlElement) => {
  if (!metadata) {
    return []
  }

  const result: Lyric.Agent[] = []
  const elements = findElementsByLocalName(metadata, 'agent')

  for (const element of elements) {
    const item = processAgent(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}
