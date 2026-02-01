export interface AlignNumberArrayResult {
  base: number
  target: number | null
  diff: number
}

/**
 * align target number list to base number list
 * @param base base number list
 * @param target target number list
 * @param fuzzyThreshold fuzzy threshold, default 0
 */
export const alignNumberArray = (base: number[], target: number[], fuzzyThreshold: number = 0) => {
  const result: AlignNumberArrayResult[] = []

  const pending: number[] = [...target]

  for (let i = 0; i < base.length; i++) {
    const baseValue = base[i]

    let matchedIndex = -1
    let matchedItem = null
    let matchedDiff = 0

    // find full match
    matchedIndex = pending.findIndex((item) => item === baseValue)

    // fuzzy
    if (matchedIndex < 0) {
      let minDiff = Infinity
      let closestIndex = -1

      for (let j = 0; j < pending.length; j++) {
        const diff = Math.abs(pending[j] - baseValue)
        if (diff <= fuzzyThreshold && diff < minDiff) {
          minDiff = diff
          closestIndex = j
        }
      }

      if (closestIndex !== -1) {
        matchedIndex = closestIndex
        matchedDiff = minDiff
      }
    }

    if (matchedIndex > 0) {
      matchedItem = pending[matchedIndex]
      pending.splice(matchedIndex, 1)
    }

    result.push({
      base: baseValue,
      target: matchedItem ?? null,
      diff: matchedDiff,
    })
  }

  return result
}
