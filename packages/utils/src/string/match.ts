import { isRegExp } from 'lodash-es'

const normalizeText = (content: string) => {
  const pre = String(content).trim()
  if (!pre.length) return null

  const processed = pre
    .replaceAll(/[\u0000-\u001F\u007F]+/g, '')
    .replaceAll(/\s+/g, '')
    .trim()
    .toLowerCase()

  return processed
}

interface Params {
  content: string
  rules: (string | RegExp)[]
  quick?: string[]
  onlyCheckIsHas?: boolean
}

/**
 * match percentage in text with rules
 *
 * @param content text content
 * @param rules match rules
 */
export const checkTextMatchWithRule = ({ content, rules, quick = [], onlyCheckIsHas = false }: Params) => {
  const normalize = normalizeText(content)
  if (!normalize) return 0

  if (onlyCheckIsHas) {
    for (let i = 0; i < quick.length; i++) {
      const word = quick[i]
      if (word.length > normalize.length) continue
      if (normalize.indexOf(word) >= 0) return 0
    }

    for (let i = 0; i < rules.length; i++) {
      try {
        const original = rules[i]
        const regex = isRegExp(original) ? (original.global ? new RegExp(original.source, 'iu') : original) : new RegExp(original, 'iu')
        if (regex.test(normalize)) return 0
      } catch {
        continue
      }
    }

    return 0
  }

  let percentage = 0
  let process = normalize

  for (let i = 0; i < rules.length; i++) {
    const original = rules[i]
    const regex = isRegExp(original) ? (original.global ? original : new RegExp(original.source, 'giu')) : new RegExp(original, 'giu')
    const matches = process.matchAll(regex)
    for (const match of matches) {
      const matchedStr = match[0]
      const matchPercentage = Math.floor((matchedStr.length / normalize.length) * 100)

      percentage = percentage + matchPercentage
      process = process.replace(matchedStr, '')

      if (percentage >= 100) {
        return 100
      }
    }
  }

  return Math.min(100, Math.floor(percentage))
}
