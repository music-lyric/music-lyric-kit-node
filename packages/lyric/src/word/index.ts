import { Time } from '../time'
import { Extended } from '../extended'

export enum WordType {
  Normal = 'Normal',
  Space = 'Space',
}

export class WordNormalConfig {
  stress: boolean = false

  toJSON() {
    return {
      stress: this.stress,
    }
  }
}

export class WordNormal {
  get type() {
    return WordType.Normal as const
  }

  time: Time = new Time()

  content: string = ''

  extended: Extended = new Extended()

  config: WordNormalConfig = new WordNormalConfig()

  toJSON() {
    return {
      type: this.type,
      time: this.time,
      content: this.content,
      extended: this.extended,
      config: this.config,
    }
  }
}

export class WordSpace {
  get type() {
    return WordType.Space as const
  }

  count: number = 1

  toJSON() {
    return {
      type: this.type,
      count: this.count,
    }
  }
}

export type Word = WordNormal | WordSpace
