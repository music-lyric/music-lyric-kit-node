import { Time } from '../time'
import { Extended } from '../extended'
import { WordNormal, WordSpace, WordType } from '../word'

export enum LineType {
  Normal = 'Normal',
  Interlude = 'Interlude',
}

export class LineContent {
  words: (WordNormal | WordSpace)[] = []

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

export class Line {
  id: string = ''

  type: LineType = LineType.Normal

  time: Time = new Time()

  content: LineContent = new LineContent()

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      time: this.time,
      content: this.content,
    }
  }
}
