export enum AgentType {
  /**
   * A single person.
   */
  Person = 'Person',
  /**
   * A group of voices, such as a duet, harmony or chorus.
   */
  Group = 'Group',
  /**
   * Another kind of agent that is neither a person nor a group.
   */
  Other = 'Other',
  /**
   * An unrecognized agent type.
   */
  Unknown = 'Unknown',
}

export class Agent {
  /**
   * Unique identifier of the agent.
   */
  id: string = ''

  /**
   * Performing type of the agent.
   */
  type: AgentType = AgentType.Unknown

  /**
   * Number of lines performed by this agent.
   */
  count: number = 0

  /**
   * Display names of the agent; a group may carry more than one.
   */
  names: string[] = []
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
