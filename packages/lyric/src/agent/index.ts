export class Agent {
  id: string = ''

  name: string = ''

  count: number = 0
}

export class LineAgentIndex {
  // index in global
  global: number = 0

  // index in block
  block: number = 0
}

export class LineAgent {
  id: string = ''

  index: LineAgentIndex = new LineAgentIndex()
}
