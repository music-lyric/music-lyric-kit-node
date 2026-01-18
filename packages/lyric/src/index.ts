import { Line } from './line'

export * from './time'
export * from './word'
export * from './line'
export * from './extended'

export const Version = '0.1.0' as const

export class Config {
  /** is instrumental music (may) */
  isInsturmental: boolean = false

  /** can syllable */
  isSyllable: boolean = false

  /** is support auto scroll lyric (no lyric time info) */
  canAutoScroll: boolean = false

  toJSON() {
    return {
      isInsturmental: this.isInsturmental,
      isSyllable: this.isSyllable,
      canAutoScroll: this.canAutoScroll,
    }
  }
}

export class Info {
  version = Version

  lines: Line[] = []

  config: Config = new Config()
}
