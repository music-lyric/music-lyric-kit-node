export interface ExtractConfig {
  /**
   * remove rackets
   * @default true
   */
  removeBrackets: boolean
  /**
   * extract full line
   * @example (this is lyric)
   * @default true
   */
  fullLine?: boolean
  /**
   * extract in line
   * @example test (will extract) test
   * @default true
   */
  inLine?: boolean
}

export const DEFAULT_CONFIG: ExtractConfig = {
  removeBrackets: true,
  fullLine: true,
  inLine: true,
}
