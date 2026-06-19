import type { LanguageTag } from '@root/language'

import { Time } from '@root/time'

import { createRandomString } from '@music-lyric-kit/utils'

export class WordAnnotationContent {
  /**
   * Unique identifier of the token.
   */
  readonly id: string = createRandomString(6).toUpperCase()

  /**
   * Time range of the token.
   */
  time?: Time

  /**
   * Text content of the token.
   */
  content: string = ''
}

export class WordAnnotationItem {
  /**
   * Unique identifier of the item.
   */
  readonly id: string = createRandomString(6).toUpperCase()

  /**
   * Time range of the item, independent from its words.
   */
  time?: Time

  /**
   * Tokens composing the item in order.
   */
  words: WordAnnotationContent[] = []

  /**
   * Language or transliteration scheme of this item.
   * Should be set when multiple languages coexist, since line-level aggregation groups items by it.
   */
  language?: LanguageTag

  /**
   * Flat text joined from every word.
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
  key: string = ''
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
}
