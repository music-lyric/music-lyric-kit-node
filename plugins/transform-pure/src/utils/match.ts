export type MatchRule = string | RegExp

export interface MatchOptions {
  /**
   * match mode
   * @default fuzzy
   */
  mode: 'fuzzy' | 'exact'
  /** fuzzy mode options */
  fuzzy: {}
  /** exact mode options */
  exact: {
    /**
     * need more than this percentage
     * @default 50
     */
    check: number
  }
  /** match rules */
  rule: {
    /**
     * is use default rule
     * @default true
     */
    useDefault: boolean
    /**
     * custom rule, it will be merge with default when useDefault is enable
     * @default []
     */
    custom: MatchRule[]
  }
}

export class Matcher {
  private options: MatchOptions

  private stringRules: string[] = []
  private regexRules: RegExp[] = []

  private defaultRules: MatchRule[] = []
  private combinedRegex: RegExp | null = null

  constructor(options: MatchOptions, defaultRules: MatchRule[]) {
    this.options = options
    this.defaultRules = defaultRules
    this.init()
  }

  private init() {
    const raw = this.options.rule.useDefault ? [...this.defaultRules, ...(this.options.rule.custom || [])] : [...(this.options.rule.custom || [])]

    for (const rule of raw) {
      if (typeof rule === 'string') {
        this.stringRules.push(rule)
      } else if (rule instanceof RegExp) {
        this.regexRules.push(rule)
      }
    }

    if (this.options.mode === 'fuzzy' && this.stringRules.length > 0) {
      const target = this.stringRules.sort((a, b) => b.length - a.length).map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      this.combinedRegex = new RegExp(`(${target.join('|')})`)
    }
  }

  update(options: MatchOptions) {
    this.options = options
    this.init()
  }

  match(line: string): boolean {
    if (!line) {
      return false
    }

    const targetLine = line.trim()
    if (!targetLine.length) {
      return false
    }

    return this.options.mode === 'fuzzy' ? this.withFuzzy(targetLine) : this.withExact(targetLine)
  }

  private withFuzzy(line: string): boolean {
    if (this.combinedRegex && this.combinedRegex.test(line)) {
      return true
    }

    for (let i = 0; i < this.regexRules.length; i++) {
      if (this.regexRules[i].test(line)) return true
    }

    return false
  }

  private withExact(line: string): boolean {
    const thresholdPercent = Math.max(this.options.exact.check, 0)

    const targetMatchCount = Math.ceil((thresholdPercent / 100) * line.length)
    if (targetMatchCount === 0) {
      return true
    }

    const matchedChars = new Uint8Array(line.length)
    let matchedCount = 0

    for (let i = 0; i < this.stringRules.length; i++) {
      const rule = this.stringRules[i]
      const ruleLen = rule.length
      if (ruleLen === 0) continue

      let postion = line.indexOf(rule)
      while (postion !== -1) {
        for (let j = 0; j < ruleLen; j++) {
          if (matchedChars[postion + j] === 0) {
            matchedChars[postion + j] = 1
            matchedCount++
          }
        }

        if (matchedCount >= targetMatchCount) {
          return true
        }

        postion = line.indexOf(rule, postion + ruleLen)
      }
    }

    for (let i = 0; i < this.regexRules.length; i++) {
      const matchResult = line.match(this.regexRules[i])
      if (matchResult && matchResult[0] && matchResult.index !== undefined) {
        const matchStr = matchResult[0]
        const matchLen = matchStr.length
        const pos = matchResult.index

        for (let j = 0; j < matchLen; j++) {
          if (matchedChars[pos + j] === 0) {
            matchedChars[pos + j] = 1
            matchedCount++
          }
        }

        if (matchedCount >= targetMatchCount) {
          return true
        }
      }
    }

    return false
  }
}
