export interface AlignNumberArrayResult {
  base: number
  targets: Array<{
    value: number
    diff: number
  }>
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

    const matched: AlignNumberArrayResult['targets'] = []

    for (let j = 0; j < pending.length; j++) {
      const diff = Math.abs(pending[j] - baseValue)

      if (diff === 0 || diff <= fuzzyThreshold) {
        matched.push({
          value: pending[j],
          diff,
        })
      }
    }

    if (matched.length > 0) {
      const matchedSet = new Set(matched.map((m) => m.value))
      for (let k = pending.length - 1; k >= 0; k--) {
        if (matchedSet.has(pending[k])) {
          pending.splice(k, 1)
        }
      }
    }

    result.push({
      base: baseValue,
      targets: matched,
    })
  }

  return result
}
