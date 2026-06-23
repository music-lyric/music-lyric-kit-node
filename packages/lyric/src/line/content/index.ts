import type { Init } from '@root/init'
import type { LanguageTag } from '@root/language'
import type { Word } from '../word'

import { Time } from '@root/time'
import { LineAgent } from '@root/agent'
import { WordType } from '../word'
import { LineAnnotation } from './annotation'

export enum LineType {
  /**
   * Normal lyric line carrying content.
   */
  Normal = 'Normal',
  /**
   * Interlude gap between lyric lines.
   */
  Interlude = 'Interlude',
}

class LineBase {
  /**
   * Time range of the line.
   */
  time: Time

  constructor(init: Init<LineBase> = {}) {
    this.time = init.time ?? new Time()
  }
}

export class LineNormalBase extends LineBase {
  /**
   * Discriminant marking this as a normal line.
   */
  readonly type = LineType.Normal

  /**
   * Performing agent of this line.
   */
  agent?: LineAgent

  /**
   * Words composing the line in order.
   */
  words: Word[]

  /**
   * Annotations applied to the whole line, derived from words unless set explicitly.
   */
  annotation: LineAnnotation

  constructor(init: Init<LineNormalBase> = {}) {
    super(init)
    this.agent = init.agent
    this.words = init.words ?? []
    this.annotation = init.annotation ?? new LineAnnotation()
    if (init.languages) {
      this.languages = init.languages
    }
  }

  /**
   * Plain text of the line joined from every word.
   */
  get original(): string {
    let result = ''
    for (let i = 0, len = this.words.length; i < len; i++) {
      const word = this.words[i]
      result += word.type === WordType.Normal ? word.content : ' '.repeat(word.count)
    }
    return result
  }

  #languages?: LanguageTag[]
  /**
   * Language tags of this line: the value set explicitly, otherwise collected from words.
   */
  get languages(): LanguageTag[] {
    if (this.#languages?.length) {
      return this.#languages
    }
    const result = new Set<LanguageTag>()
    for (let i = 0, len = this.words.length; i < len; i++) {
      const word = this.words[i]
      if (word.type === WordType.Normal && word.language) {
        result.add(word.language)
      }
    }
    return [...result]
  }
  /**
   * Override the words-derived languages with explicit tags.
   */
  set languages(value: LanguageTag[]) {
    this.#languages = value
  }
}

export class LineNormal extends LineNormalBase {
  /**
   * Background lines attached to this line.
   */
  background?: LineNormalBase[]

  constructor(init: Init<LineNormal> = {}) {
    super(init)
    this.background = init.background
  }
}

export class LineInterlude extends LineBase {
  /**
   * Discriminant marking this as an interlude line.
   */
  readonly type = LineType.Interlude
}

export type Line = LineInterlude | LineNormal

export * from './annotation'
