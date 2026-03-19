import { Agent } from '@music-lyric-kit/lyric'

import { Xml } from '@music-lyric-kit/utils'
import { findElementsByLocalName, getAttributeByName } from '@root/utils'

const processAgent = (element: Xml.XmlElement) => {
  const type = getAttributeByName(element, 'type', true)
  const id = getAttributeByName(element, 'id', true)

  if (!type || !id) {
    return null
  }

  const agent = new Agent()
  agent.id = id

  return agent
}

export const processAgents = (root: Xml.XmlElement) => {
  const data = findElementsByLocalName(root, 'metadata', true)[0]
  if (!data) {
    return []
  }

  const result: Agent[] = []
  const elements = findElementsByLocalName(data, 'agent')

  for (const element of elements) {
    const item = processAgent(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}
