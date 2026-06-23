import type { Init } from '@root/init'
import type { LanguageTag } from '@root/language'

import { Time } from '@root/time'

export class WordAnnotationContent {
  /**
   * Time range of the token.
   */
  time?: Time

  /**
   * Text content of the token.
   */
  content: string

  constructor(init: Init<WordAnnotationContent> = {}) {
    this.time = init.time
    this.content = init.content ?? ''
  }
}

export class WordAnnotationItem {
  /**
   * Time range of the item, independent from its words.
   */
  time?: Time

  /**
   * Tokens composing the item in order.
   */
  words: WordAnnotationContent[]

  /**
   * Language or transliteration scheme of this item.
   * Should be set when multiple languages coexist, since line-level aggregation groups items by it.
   */
  language?: LanguageTag

  constructor(init: Init<WordAnnotationItem> = {}) {
    this.time = init.time
    this.words = init.words ?? []
    this.language = init.language
  }

  /**
   * Flat text joined from every word.
   *
   * Live: recomputed on each access.
   */
  get content(): string {
    let result = ''
    for (let i = 0, len = this.words.length; i < len; i++) {
      result += this.words[i].content
    }
    return result
  }
}

export class WordUnknownAnnotation extends WordAnnotationItem {
  /**
   * Original annotation type name.
   */
  key: string

  constructor(init: Init<WordUnknownAnnotation> = {}) {
    super(init)
    this.key = init.key ?? ''
  }
}

export class WordAnnotation {
  /**
   * Ruby annotation such as furigana.
   */
  ruby?: WordAnnotationItem

  /**
   * Romanized transliterations.
   */
  romans?: WordAnnotationItem[]

  /**
   * Unknown annotations keyed by their original type name.
   */
  unknowns?: WordUnknownAnnotation[]

  constructor(init: Init<WordAnnotation> = {}) {
    this.ruby = init.ruby
    this.romans = init.romans
    this.unknowns = init.unknowns
  }
}
