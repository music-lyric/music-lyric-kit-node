import type { Init } from '@root/init'
import type { LanguageItem, LanguageTag } from './content'

export class Language {
  /**
   * All languages with their shares.
   */
  list: LanguageItem[]

  constructor(init: Init<Language> = {}) {
    this.list = init.list ?? []
  }

  /**
   * Whether a language of the given tag is present.
   */
  has(type: LanguageTag): boolean {
    return this.list.some((item) => item.tag === type)
  }

  /**
   * The language entry of the given tag.
   */
  byType(type: LanguageTag): LanguageItem | undefined {
    return this.list.find((item) => item.tag === type)
  }

  /**
   * The language with the highest share.
   */
  get primary(): LanguageItem | undefined {
    let result: LanguageItem | undefined
    for (let i = 0, len = this.list.length; i < len; i++) {
      if (!result || this.list[i].percent > result.percent) {
        result = this.list[i]
      }
    }
    return result
  }
}

export * from './content'
