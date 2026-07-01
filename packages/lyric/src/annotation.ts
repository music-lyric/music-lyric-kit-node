import type { LineBackground, LineNormal } from 'music-lyric-model'

import { deriveLineRomans, deriveLineUnknowns, makeLineAnnotation } from 'music-lyric-model'

/**
 * Refresh derived items of an array while preserving explicit ones.
 */
const refreshDerived = <T extends { derived: boolean }>(items: T[], derive: () => T[]): T[] => {
  const kept = items.filter((item) => !item.derived)
  if (kept.length) {
    return kept
  }
  kept.push(...derive())
  return kept
}

/**
 * Refresh a line's derived annotations (romans, unknowns) from its word-level annotations.
 *
 * Refreshes derived items while preserving explicit ones, so it is safe to call repeatedly.
 * Word-level ruby has no line-level counterpart and is intentionally dropped.
 */
export const refreshLineAnnotation = (line: LineNormal | LineBackground): void => {
  const content = line.content
  if (!content) {
    return
  }
  const annotation = content.annotation ?? (content.annotation = makeLineAnnotation())
  const words = content.words

  annotation.romans = refreshDerived(annotation.romans, () => deriveLineRomans(words))
  annotation.unknowns = refreshDerived(annotation.unknowns, () => deriveLineUnknowns(words))
}
