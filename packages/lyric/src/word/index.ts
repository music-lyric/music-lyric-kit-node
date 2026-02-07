import { Time } from '../time'
import { Extended } from '../extended'

export enum WordType {
  Normal = 'Normal',
  Space = 'Space',
}

export class WordNormal {
  get type() {
    return WordType.Normal as const
  }

  time: Time = new Time()

  extended: Extended = new Extended()

  content: string = ''

  toJSON() {
    return {
      type: this.type,
      time: this.time,
      content: this.content,
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
