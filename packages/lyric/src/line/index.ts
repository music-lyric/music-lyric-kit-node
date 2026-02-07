import { Time } from '../time'
import { Extended } from '../extended'
import { WordType } from '../word'

import type { Word } from '../word'

export enum LineType {
  Normal = 'Normal',
  Interlude = 'Interlude',
}

export class InterludeLine {
  get type() {
    return LineType.Interlude as const
  }

  id: string = ''

  time: Time = new Time()

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      time: this.time,
    }
  }
}

export class NormalLineContent {
  words: Word[] = []

  extended: Extended[] = []

  get original(): string {
    return this.words
      .map((word) => {
        return word.type === WordType.Normal ? word.content : new Array(word.count).fill(' ').join('')
      })
      .join('')
  }

  toJSON() {
    return {
      words: this.words,
      extended: this.extended,
      original: this.original,
    }
  }
}

export class NormalLine {
  get type() {
    return LineType.Normal as const
  }

  id: string = ''

  time: Time = new Time()

  content: NormalLineContent = new NormalLineContent()

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      time: this.time,
      content: this.content,
    }
  }
}

export type Line = InterludeLine | NormalLine
