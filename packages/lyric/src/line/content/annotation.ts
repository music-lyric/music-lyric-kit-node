import type { Init } from '@root/init'
import type { LanguageTag } from '@root/language'
import type { Word, WordNormal, WordAnnotationItem } from '../word'

import { WordType } from '../word'

export class LineAnnotationItem {
  /**
   * Language or transliteration scheme of this item.
   * Should be set when multiple languages coexist, since aggregation from words groups by it.
   */
  language?: LanguageTag

  /**
   * Original text.
   */
  content: string

  constructor(init: Init<LineAnnotationItem> = {}) {
    this.language = init.language
    this.content = init.content ?? ''
  }
}

export class LineUnknownAnnotation extends LineAnnotationItem {
  /**
   * Original annotation type name.
   */
  key: string

  constructor(init: Init<LineUnknownAnnotation> = {}) {
    super(init)
    this.key = init.key ?? ''
  }
}

export class LineAnnotation {
  #host: { words: Word[] }

  constructor(host: { words: Word[] }) {
    this.#host = host
  }

  /**
   * Aggregate one per-word item into a single line item, padding spaces to follow word spacing.
   */
  #aggregateSingle(pick: (word: WordNormal) => WordAnnotationItem | undefined): LineAnnotationItem | undefined {
    let content = ''
    let pending = 0
    let language: LanguageTag | undefined
    let has = false
    for (let i = 0, len = this.#host.words.length; i < len; i++) {
      const word = this.#host.words[i]
      if (word.type === WordType.Space) {
        pending += word.count
        continue
      }
      const item = pick(word)
      if (item) {
        if (has) {
          content += ' '.repeat(pending)
        }
        content += item.content
        language ??= item.language
        pending = 0
        has = true
      }
    }
    if (!has) {
      return undefined
    }
    return new LineAnnotationItem({ content, language })
  }

  /**
   * Aggregate multi-value per-word items into line items, one per language.
   */
  #aggregateGrouped(pick: (word: WordNormal) => WordAnnotationItem[] | undefined): LineAnnotationItem[] | undefined {
    const languages: LanguageTag[] = []
    for (let i = 0, len = this.#host.words.length; i < len; i++) {
      const word = this.#host.words[i]
      if (word.type === WordType.Space) {
        continue
      }
      const items = pick(word)
      if (!items) {
        continue
      }
      for (const item of items) {
        const language = item.language ?? ''
        if (!languages.includes(language)) {
          languages.push(language)
        }
      }
    }
    if (!languages.length) {
      return undefined
    }
    const result: LineAnnotationItem[] = []
    for (const language of languages) {
      let content = ''
      let pending = 0
      let has = false
      for (let i = 0, len = this.#host.words.length; i < len; i++) {
        const word = this.#host.words[i]
        if (word.type === WordType.Space) {
          pending += word.count
          continue
        }
        const item = pick(word)?.find((entry) => (entry.language ?? '') === language)
        if (item) {
          if (has) {
            content += ' '.repeat(pending)
          }
          content += item.content
          pending = 0
          has = true
        }
      }
      const lineItem = new LineAnnotationItem({ content, language: language || undefined })
      result.push(lineItem)
    }
    return result
  }

  /**
   * Aggregate unknown per-word items into line items, one per key.
   */
  #aggregateUnknowns(): LineUnknownAnnotation[] | undefined {
    const keys: string[] = []
    for (let i = 0, len = this.#host.words.length; i < len; i++) {
      const word = this.#host.words[i]
      if (word.type === WordType.Space) {
        continue
      }
      const items = word.annotation?.unknowns
      if (!items) {
        continue
      }
      for (const item of items) {
        if (!keys.includes(item.key)) {
          keys.push(item.key)
        }
      }
    }
    if (!keys.length) {
      return undefined
    }
    const result: LineUnknownAnnotation[] = []
    for (const key of keys) {
      let content = ''
      let pending = 0
      let language: LanguageTag | undefined
      let has = false
      for (let i = 0, len = this.#host.words.length; i < len; i++) {
        const word = this.#host.words[i]
        if (word.type === WordType.Space) {
          pending += word.count
          continue
        }
        const item = word.annotation?.unknowns?.find((entry) => entry.key === key)
        if (item) {
          if (has) {
            content += ' '.repeat(pending)
          }
          content += item.content
          language ??= item.language
          pending = 0
          has = true
        }
      }
      const lineItem = new LineUnknownAnnotation({ key, content, language })
      result.push(lineItem)
    }
    return result
  }

  #ruby?: LineAnnotationItem
  /**
   * Ruby annotation: the explicit value, otherwise aggregated from words.
   */
  get ruby(): LineAnnotationItem | undefined {
    return this.#ruby ?? this.#aggregateSingle((word) => word.annotation?.ruby)
  }
  /**
   * Override the words-derived ruby with an explicit value.
   */
  set ruby(value: LineAnnotationItem | undefined) {
    this.#ruby = value
  }

  #romans?: LineAnnotationItem[]
  /**
   * Romanized transliterations: the explicit value, otherwise aggregated from words grouped by language.
   */
  get romans(): LineAnnotationItem[] | undefined {
    return this.#romans ?? this.#aggregateGrouped((word) => word.annotation?.romans)
  }
  /**
   * Override the words-derived romans with explicit values.
   */
  set romans(value: LineAnnotationItem[] | undefined) {
    this.#romans = value
  }

  #translates?: LineAnnotationItem[]
  /**
   * Translations, explicit only since words carry no line-level translation.
   */
  get translates(): LineAnnotationItem[] | undefined {
    return this.#translates
  }
  /**
   * Set the explicit translations.
   */
  set translates(value: LineAnnotationItem[] | undefined) {
    this.#translates = value
  }

  #unknowns?: LineUnknownAnnotation[]
  /**
   * Unknown annotations: the explicit value, otherwise aggregated from words grouped by key.
   */
  get unknowns(): LineUnknownAnnotation[] | undefined {
    return this.#unknowns ?? this.#aggregateUnknowns()
  }
  /**
   * Override the words-derived unknowns with explicit values.
   */
  set unknowns(value: LineUnknownAnnotation[] | undefined) {
    this.#unknowns = value
  }
}
