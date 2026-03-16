export interface InterludeConfig {
  /**
   * If these conditions are met, add an interlude.
   */
  checkTime: {
    /**
     * First line check time.
     * @unit ms
     * @default 5000
     */
    first: number
    /**
     * Normal line check time
     * @unit ms
     * @default 10000
     */
    normal: number
  }
}

export const DEFAULT_CONFIG: InterludeConfig = {
  checkTime: {
    first: 5000,
    normal: 10000,
  },
}
