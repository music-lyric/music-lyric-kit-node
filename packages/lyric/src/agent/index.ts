import type { Init } from '@root/init'

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
  id: string

  /**
   * Performing type of the agent.
   */
  type: AgentType

  /**
   * Number of lines performed by this agent.
   */
  count: number

  /**
   * Display names of the agent; a group may carry more than one.
   */
  names: string[]

  constructor(init: Init<Agent> = {}) {
    this.id = init.id ?? ''
    this.type = init.type ?? AgentType.Unknown
    this.count = init.count ?? 0
    this.names = init.names ?? []
  }
}

export class LineAgent {
  /**
   * Identifier of the referenced Agent.
   */
  id: string

  /**
   * Index of this agent occurrence among all lines.
   */
  globalIndex: number

  /**
   * Index of this agent occurrence within its block.
   */
  blockIndex: number

  constructor(init: Init<LineAgent> = {}) {
    this.id = init.id ?? ''
    this.globalIndex = init.globalIndex ?? 0
    this.blockIndex = init.blockIndex ?? 0
  }
}
