import { Lyric } from '@music-lyric-kit/lyric'

import { Xml, parseTime } from '@music-lyric-kit/utils'
import { findElementsByLocalName, hasChildElementByLocal, getAttributeByName, getTextContent, processTextToWords } from '@root/utils'

export interface LineRoleContext {
  /**
   * The span element that carries the role.
   */
  element: Xml.XmlElement
  /**
   * Value of the ttm:role attribute.
   */
  role: string
  /**
   * Line the role span belongs to.
   */
  line: Lyric.LineNormal
  /**
   * Whether the current line is itself a background line.
   */
  background: boolean
}

export type LineRoleHandler = (context: LineRoleContext) => void

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

  const agent = new Lyric.LineAgent()
  agent.id = raw
  return agent
}

const resolveLineTime = (element: Xml.XmlElement, background: boolean) => {
  const rawBegin = getAttributeByName(element, 'begin', true)
  const begin = rawBegin ? parseTime(rawBegin) : null

  const rawEnd = getAttributeByName(element, 'end', true)
  const end = rawEnd ? parseTime(rawEnd) : null

  if ((begin === null || end === null) && !background) {
    return null
  }
  return { start: begin ?? 0, end: end ?? 0 }
}

const resolveWordSpace = (content: string, isFirst: boolean) => {
  if (isFirst || content.trim()) {
    return null
  }
  const space = new Lyric.WordSpace()
  space.count = content.length || 1
  return space
}

const resolveWordSpan = (element: Xml.XmlElement, prev: Lyric.Word | undefined): Lyric.Word[] | null => {
  const text = getTextContent(element)
  const trimed = text.trim()
  if (!trimed) {
    return null
  }

  const rawBegin = getAttributeByName(element, 'begin', true)
  const rawEnd = getAttributeByName(element, 'end', true)
  if (!rawBegin || !rawEnd) {
    return null
  }

  const begin = parseTime(rawBegin)
  const end = parseTime(rawEnd)
  if (begin === null || end === null) {
    return null
  }

  const result: Lyric.Word[] = []

  if (text.startsWith(' ') && prev?.type !== Lyric.WordType.Space) {
    const space = new Lyric.WordSpace()
    space.count = calcStartSpaceCount(text)
    result.push(space)
  }

  const normal = new Lyric.WordNormal()
  normal.content = trimed
  normal.time = new Lyric.Time()
  normal.time.start = begin
  normal.time.end = end
  result.push(normal)

  if (text.endsWith(' ')) {
    const space = new Lyric.WordSpace()
    space.count = calcEndSpaceCount(text)
    result.push(space)
  }

  return result
}

export const processLine = (element: Xml.XmlElement, background: boolean = false, onRole?: LineRoleHandler): Lyric.LineNormal | null => {
  const time = resolveLineTime(element, background)
  if (!time) {
    return null
  }

  const line = new Lyric.LineNormal()
  line.time.start = time.start
  line.time.end = time.end

  const agent = processLineAgent(element)
  if (agent) {
    line.agent = agent
  }

  if (!hasChildElementByLocal(element, 'span')) {
    const text = getTextContent(element).trim()
    if (!text.length) {
      return null
    }
    line.words = processTextToWords(text)
    return line
  }

  const words: Lyric.Word[] = []
  const children = element.children
  for (let i = 0; i < children.length; i++) {
    const item = children[i]

    if (item.type === Xml.XmlNodeType.Text) {
      const space = resolveWordSpace(item.content, i === 0)
      if (space) {
        words.push(space)
      }
      continue
    }

    if (item.type !== Xml.XmlNodeType.Element || item.local !== 'span') {
      continue
    }

    const role = getAttributeByName(item, 'role', true)
    // background is common field.
    if (role === 'x-bg') {
      if (!background) {
        const bg = processLine(item, true, onRole)
        if (bg) {
          line.background ??= []
          line.background.push(bg)
        }
      }
      continue
    }
    // other roles.
    if (role) {
      onRole?.({ element: item, role, line, background })
      continue
    }

    const parsed = resolveWordSpan(item, words[words.length - 1])
    if (parsed) {
      words.push(...parsed)
    }
  }

  line.words = words
  return line
}

export const processLines = (body?: Xml.XmlElement, onRole?: LineRoleHandler) => {
  if (!body) {
    return []
  }

  const result: Lyric.LineNormal[] = []
  const elements = findElementsByLocalName(body, 'p')

  for (const element of elements) {
    const line = processLine(element, false, onRole)
    if (line) {
      result.push(line)
    }
  }

  return result
}
