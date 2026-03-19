export interface ExtractConfig {
  split: string | RegExp
  /**
   * is replace this line when matched
   * @default true
   */
  replace: boolean
}

export const DEFAULT_CONFIG: ExtractConfig = {
  split: '/',
  replace: true,
}
