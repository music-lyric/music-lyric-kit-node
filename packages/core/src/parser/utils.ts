import { Line, Extended, LineType, LineNormal } from '@music-lyric-kit/lyric'
import { alignNumberArray } from '@music-lyric-kit/utils'

import type { Runtime } from './context'

export const handleAlignExtended = (lines: Line[], extendeds: Runtime['extendeds']) => {
  const target = [...lines]

  const baseMap: Map<number, number> = new Map()
  for (let i = 0; i < target.length; i++) {
    const item = target[i]
    if (!item) {
      continue
    }
    if (item.type !== LineType.Normal) {
      continue
    }
    baseMap.set(item.time.start, i)
  }

  const extendedMap: Map<number, Extended[]> = new Map()
  for (let i = 0; i < extendeds.length; i++) {
    const [time, extended] = extendeds[i]
    const current = extendedMap.get(time.start)
    if (current) {
      current.push(extended)
      extendedMap.set(time.start, current)
      continue
    }
    extendedMap.set(time.start, [extended])
  }

  const handleApplyToTarget = (line: LineNormal, time: number) => {
    const content = extendedMap.get(time)
    if (content === void 0 || !content.length) {
      return
    }

    if (!Array.isArray(line.content.extended)) {
      line.content.extended = [...content]
      return
    }

    line.content.extended.push(...content)
  }

  const result = alignNumberArray([...baseMap.keys()], [...extendedMap.keys()])
  for (const item of result) {
    const base = item.base
    const baseIndex = baseMap.get(base)
    if (baseIndex === void 0) {
      continue
    }

    const line = target[baseIndex] as LineNormal
    if (!line) {
      continue
    }

    for (const matched of item.targets) {
      handleApplyToTarget(line, matched.value)
    }
  }

  return lines
}
