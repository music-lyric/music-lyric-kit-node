import { Xml } from '@music-lyric-kit/utils'

export const findElementsByLocalName = (root: Xml.XmlElement, local: string, first: boolean = false) => {
  const stack: Xml.XmlNode[] = [root]
  const result: Xml.XmlElement[] = []

  while (stack.length > 0) {
    const node = stack.pop()!
    if (node.type === Xml.XmlNodeType.Element) {
      if (node.local === local) {
        if (first) {
          return [node]
        } else {
          result.push(node)
        }
      }
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i])
      }
    }
  }

  return result
}

export const getChildElementByLocal = (element: Xml.XmlElement, name: string) => {
  const result: Xml.XmlElement[] = []
  for (const child of element.children) {
    if (child.type === Xml.XmlNodeType.Element && child.local === name) {
      result.push(child)
    }
  }
  return result
}

export const hasChildElementByLocal = (element: Xml.XmlElement, name: string) => {
  for (const child of element.children) {
    if (child.type === Xml.XmlNodeType.Element && child.local === name) {
      return true
    }
  }
  return false
}

export const getAttributeByName = (element: Xml.XmlElement, name: string, local: boolean = false) => {
  for (let i = 0; i < element.attributes.length; i++) {
    const item = element.attributes[i]
    if (local) {
      if (item.local === name) {
        return item.value
      }
    } else {
      if (item.name === name) {
        return item.value
      }
    }
  }
  return void 0
}

export const getTextContent = (node: Xml.XmlNode) => {
  if (node.type !== Xml.XmlNodeType.Element) {
    return node.content
  }
  let result = ''
  for (const child of node.children) {
    result += getTextContent(child)
  }
  return result
}
