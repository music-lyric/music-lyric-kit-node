import type { LineRoleContext } from '@root/common'

import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { processLines as processCommonLines } from '@root/common'
import { getTextContent } from '@root/utils'

const AMLL_ANNOTATION_ROLE = ['x-translation', 'x-roman']

const handleRole = (context: LineRoleContext) => {
  const { element, role, line } = context
  if (!AMLL_ANNOTATION_ROLE.includes(role)) {
    return
  }

  const text = getTextContent(element)
  if (!text) {
    return
  }

  const item = new Lyric.LineAnnotationItem()
  item.content = text
  if (role === 'x-translation') {
    line.annotation.translates = [...(line.annotation.translates || []), item]
  } else {
    line.annotation.romans = [...(line.annotation.romans || []), item]
  }
}

export const processLines = (body?: Xml.XmlElement) => {
  return processCommonLines(body, handleRole)
}
