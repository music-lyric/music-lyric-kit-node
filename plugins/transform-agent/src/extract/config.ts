export interface ExtractAgentConfig {
  split: string | RegExp
  /**
   * is replace this line when matched
   * @default true
   */
  replace: boolean
}

export const DEFAULT_AGENT_CONFIG: ExtractAgentConfig = {
  split: '/',
  replace: true,
}
