import type { ContentTypeObject } from './interface'
import type { MatchInfo } from './utils'

import { Extended, ExtendedType, Line, Time, Type } from '@music-lyric-kit/lyric'

import { matchLyric } from './utils'
import { processNormal, processSyllable } from './line'

const processMain = (params: ContentTypeObject): [MatchInfo, Line[], Type] => {
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

export const processLyric = (params: ContentTypeObject) => {
  const [match, lines, type] = processMain(params)

  const extendeds: [Time, Extended][] = []

  const translate = processNormal(matchLyric(params.translate).line)
  for (const item of translate || []) {
    const extended = new Extended()
    extended.type = ExtendedType.Translate
    extended.content = item.content.original
    extendeds.push([item.time, extended])
  }

  const roman = processNormal(matchLyric(params.roman).line)
  for (const item of roman || []) {
    const extended = new Extended()
    extended.type = ExtendedType.Roman
    extended.content = item.content.original
    extendeds.push([item.time, extended])
  }

  return {
    type,
    lines,
    extendeds,
  }
}
