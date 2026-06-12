export class Agent {
  id: string = ''

  name: string = ''

  count: number = 0
}

export class AgentLineIndex {
  // index in global
  global: number = 0

  // index in block
  block: number = 0
}

export class AgentLine {
  id: string = ''

  index: AgentLineIndex = new AgentLineIndex()
}
