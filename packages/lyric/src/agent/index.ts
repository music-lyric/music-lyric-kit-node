export class Agent {
  /**
   * Unique identifier of the agent.
   */
  id: string = ''

  /**
   * Display name of the agent.
   */
  name: string = ''

  /**
   * Number of lines performed by this agent.
   */
  count: number = 0
}

export class LineAgent {
  /**
   * Identifier of the referenced Agent.
   */
  id: string = ''

  /**
   * Index of this agent occurrence among all lines.
   */
  globalIndex: number = 0

  /**
   * Index of this agent occurrence within its block.
   */
  blockIndex: number = 0
}
