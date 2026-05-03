import type { Word } from '@music-lyric-kit/lyric'
import { AgentLine, Extended, ExtendedType, LineNormal, WordNormal, WordSpace, WordType } from '@music-lyric-kit/lyric'

import { parseTime, Xml } from '@music-lyric-kit/utils'
import { findElementsByLocalName, getChildElementByLocal, getAttributeByName, getTextContent, processTextToWords } from '@root/utils'

const ALL_EXTRA_ROLE = ['x-bg', 'x-translation', 'x-roman']

const calcEndSpaceCount = (content: string) => {
  let count = 0
  for (let i = content.length - 1; i >= 0 && content[i] === ' '; i--) {
    count++
  }
  return count
}

const calcStartSpaceCount = (content: string) => {
  let count = 0
  for (let i = 0; i < content.length && content[i] === ' '; i++) {
    count++
  }
  return count
}

const processLineAgent = (element: Xml.XmlElement) => {
  const raw = getAttributeByName(element, 'agent', true)
  if (!raw) {
    return null
  }

  const agent = new AgentLine()
  agent.id = raw

  return agent
}

const processLineBackground = (element: Xml.XmlElement, line: LineNormal) => {
  const background = processLine(element, true)
  if (!background) {
    return
  }

  if (!line.background) {
    line.background = [background]
  } else {
    line.background.push(background)
  }
}

const processLineExtra = (element: Xml.XmlElement, line: LineNormal, role: string, background: boolean) => {
  if (!ALL_EXTRA_ROLE.includes(role)) {
    return
  }

  if (role === 'x-bg' && !background) {
    processLineBackground(element, line)
    return
  }

  const text = getTextContent(element)
  if (!text) {
    return
  }

  const extended = new Extended()

  extended.type = role === 'x-translation' ? ExtendedType.Translate : ExtendedType.Roman
  extended.content = text

  if (!line.content.extended) {
    line.content.extended = [extended]
  } else {
    line.content.extended.push(extended)
  }
}

const processLine = (element: Xml.XmlElement, background: boolean = false) => {
  const spans = getChildElementByLocal(element, 'span')

  const rawBegin = getAttributeByName(element, 'begin', true)
  const rawEnd = getAttributeByName(element, 'end', true)
  if (!rawBegin || !rawEnd) {
    return null
  }

  const begin = parseTime(rawBegin)
  const end = parseTime(rawEnd)
  if (!begin || !end) {
    return null
  }

  const line = new LineNormal()
  line.time.start = begin
  line.time.end = end

  const agent = processLineAgent(element)
  if (agent) {
    line.agent = agent
  }

  if (!spans.length) {
    const text = getTextContent(element).trim()
    if (!text.length) {
      return null
    }
    line.content.words = processTextToWords(text)
    return line
  }

  const words: Word[] = []
  for (let i = 0; i < element.children.length; i++) {
    const item = element.children[i]

    if (item.type === Xml.XmlNodeType.Text) {
      const content = item.content
      if (!content.trim() && i !== 0) {
        const space = new WordSpace()
        space.count = item.content.split('').length || 1
        words.push(space)
      }
      continue
    }

    if (item.type === Xml.XmlNodeType.Element && item.local === 'span') {
      const role = getAttributeByName(item, 'role', true)
      if (role) {
        processLineExtra(item, line, role, background)
        continue
      }

      const text = getTextContent(item)
      if (!text) {
        continue
      }

      const trimed = text.trim()
      if (!trimed) {
        continue
      }

      const rawBegin = getAttributeByName(item, 'begin', true)
      const rawEnd = getAttributeByName(item, 'end', true)
      if (!rawBegin || !rawEnd) {
        continue
      }

      const begin = parseTime(rawBegin)
      const end = parseTime(rawEnd)
      if (!begin || !end) {
        continue
      }

      const target: Word[] = []

      const prev = words[words.length - 1]
      if (text.startsWith(' ') && prev?.type !== WordType.Space) {
        const count = calcStartSpaceCount(text)
        const prev = words[words.length - 1]
        if (prev?.type === WordType.Space) {
          prev.count += count
        } else {
          const space = new WordSpace()
          space.count = count
          target.push(space)
        }
      }

      const normal = new WordNormal()
      normal.content = trimed
      normal.time.start = begin
      normal.time.end = end
      target.push(normal)

      if (text.endsWith(' ')) {
        const count = calcEndSpaceCount(text)
        const space = new WordSpace()
        space.count = count
        target.push(space)
      }

      words.push(...target)
    }
  }

  line.content.words = words

  return line
}

export const processLines = (root: Xml.XmlElement) => {
  const body = findElementsByLocalName(root, 'body', true)[0]
  if (!body) {
    return []
  }

  const result: LineNormal[] = []
  const elements = findElementsByLocalName(body, 'p')

  for (const element of elements) {
    const line = processLine(element)
    if (line) {
      result.push(line)
    }
  }

  return result
}
