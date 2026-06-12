import type { Meta } from '../meta'
import type { Line } from '../line'
import type { Agent } from '../agent'

const Version = '0.5.1' as const

enum Type {
  // parse lyric failed
  Incorrect = 'Incorrect',
  // normal lyric (line by line)
  Normal = 'Normal',
  // syllable lyric
  Syllable = 'Syllable',
  // pure music
  Pure = 'Pure',
  // empty lyric (no lyric line)
  Empty = 'Empty',
  // no time flag, but has lyric line
  NoTime = 'NoTime',
}

class Info {
  get version() {
    return Version
  }

  type: Type = Type.Incorrect

  metas: Meta[] = []

  lines: Line[] = []

  agents: Agent[] = []

  toJSON() {
    return {
      version: this.version,
      type: this.type,
      metas: this.metas,
      lines: this.lines,
      agents: this.agents,
    }
  }
}

export { Version, Type, Info }
