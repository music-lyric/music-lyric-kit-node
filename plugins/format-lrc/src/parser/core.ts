import type { ParserContentObject } from './interface'
import type { MatchInfo } from './utils'

import { Extended, ExtendedType, LineNormal, Type } from '@music-lyric-kit/lyric'

import { matchLyric } from './utils'
import { processNormal, processSyllable } from './line'
import { processMeta } from './meta'
import { alignNumberArray } from '@music-lyric-kit/utils'

const processMain = (params: ParserContentObject): [MatchInfo, LineNormal[], Type] => {
  const syllableMatch = matchLyric(params.syllable)
  const syllable = processSyllable(syllableMatch.line)
  if (syllable && syllable.length > 0) {
    return [syllableMatch, syllable, Type.Syllable]
  }

  const originalMatch = matchLyric(params.original)
  const original = processNormal(originalMatch.line)
  if (original && original.length > 0) {
    return [originalMatch, original, Type.Normal]
  }

  return [originalMatch, [], Type.Empty]
}

const processExtended = (lines: LineNormal[], params: ParserContentObject) => {
  const lineMap: Map<number, LineNormal> = new Map()
  const extendedMap: Map<number, Extended[]> = new Map()

  for (const line of lines) {
    lineMap.set(line.time.start, line)
  }

  const translate = processNormal(matchLyric(params.translate).line)
  for (const item of translate || []) {
    const current = extendedMap.get(item.time.start) || []
    const extended = new Extended()
    extended.type = ExtendedType.Translate
    extended.content = item.content.original
    current.push(extended)
    extendedMap.set(item.time.start, current)
  }

  const roman = processNormal(matchLyric(params.roman).line) || []
  for (const item of roman || []) {
    const current = extendedMap.get(item.time.start) || []
    const extended = new Extended()
    extended.type = ExtendedType.Roman
    extended.content = item.content.original
    current.push(extended)
    extendedMap.set(item.time.start, current)
  }

  const result = alignNumberArray([...lineMap.keys()], [...extendedMap.keys()])
  for (const item of result) {
    const line = lineMap.get(item.base)
    if (!line) {
      continue
    }

    if (!line.content.extended) {
      line.content.extended = []
    }

    for (const target of item.targets) {
      const extended = extendedMap.get(target.value)
      if (!extended) {
        continue
      }
      line.content.extended.push(...extended)
    }
  }
}

export const processLyric = (params: ParserContentObject) => {
  const [match, lines, type] = processMain(params)

  const metas = processMeta(match.meta)

  processExtended(lines, params)

  return {
    type,
    lines,
    metas,
  }
}
