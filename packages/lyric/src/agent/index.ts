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

export class AgentItem {
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
   *
   * Snapshot filled by `calcAgentIndex` at parse time; stale after lines change.
   */
  count: number

  /**
   * Display names of the agent; a group may carry more than one.
   */
  names: string[]

  constructor(init: Init<AgentItem> = {}) {
    this.id = init.id ?? ''
    this.type = init.type ?? AgentType.Unknown
    this.count = init.count ?? 0
    this.names = init.names ?? []
  }
}

export class LineAgent {
  /**
   * Identifier of the referenced agent.
   */
  id: string

  /**
   * Index of this agent occurrence among all lines.
   *
   * Snapshot filled by `calcAgentIndex` at parse time.
   */
  globalIndex: number

  /**
   * Index of this agent occurrence within its block.
   *
   * Snapshot filled by `calcAgentIndex` at parse time.
   */
  blockIndex: number

  constructor(init: Init<LineAgent> = {}) {
    this.id = init.id ?? ''
    this.globalIndex = init.globalIndex ?? 0
    this.blockIndex = init.blockIndex ?? 0
  }
}

export class Agent {
  /**
   * All agents in order.
   */
  list: AgentItem[]

  constructor(init: Init<Agent> = {}) {
    this.list = init.list ?? []
  }

  /**
   * Whether any agent of a type exists.
   */
  has(type: AgentType): boolean {
    return this.list.some((item) => item.type === type)
  }

  /**
   * All agents of a type.
   */
  all(type: AgentType): AgentItem[] {
    return this.list.filter((item) => item.type === type)
  }

  /**
   * The agent with the given id, used to resolve a LineAgent reference.
   */
  byId(id: string): AgentItem | undefined {
    return this.list.find((item) => item.id === id)
  }

  /**
   * The agent performing the most lines.
   */
  get primary(): AgentItem | undefined {
    let result: AgentItem | undefined
    for (let i = 0, len = this.list.length; i < len; i++) {
      if (!result || this.list[i].count > result.count) {
        result = this.list[i]
      }
    }
    return result
  }
}
