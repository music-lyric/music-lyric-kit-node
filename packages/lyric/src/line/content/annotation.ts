import type { Init } from '@root/init'
import type { LanguageTag } from '@root/language'
import type { Word, WordNormal, WordAnnotationItem } from '../word'

import { WordType } from '../word'

export enum LineAnnotationKind {
  /**
   * Ruby annotation such as furigana.
   */
  Ruby = 'Ruby',
  /**
   * Romanized transliteration.
   */
  Roman = 'Roman',
  /**
   * Translation into another language.
   */
  Translate = 'Translate',
  /**
   * Unknown annotation preserved by its original key.
   */
  Unknown = 'Unknown',
}

const DERIVED_KINDS = [LineAnnotationKind.Ruby, LineAnnotationKind.Roman, LineAnnotationKind.Unknown] as const

interface LineAnnotationExtra {
  [LineAnnotationKind.Ruby]: {}
  [LineAnnotationKind.Roman]: {}
  [LineAnnotationKind.Translate]: {}
  [LineAnnotationKind.Unknown]: {
    /**
     * Original annotation type name.
     */
    key: string
  }
}

export type LineAnnotationItem = {
  [K in LineAnnotationKind]: {
    /**
     * Semantic kind of the annotation.
     */
    kind: K
    /**
     * Language or transliteration scheme of this item.
     */
    language?: LanguageTag
    /**
     * Original text.
     */
    content: string
    /**
     * Whether this item was derived from word-level annotations rather than set explicitly.
     */
    derived: boolean
  } & LineAnnotationExtra[K]
}[LineAnnotationKind]

export type LineAnnotationItemInit<K extends LineAnnotationKind = LineAnnotationKind> = Omit<
  Extract<LineAnnotationItem, { kind: K }>,
  'kind' | 'derived'
> & {
  derived?: boolean
}

export class LineAnnotation {
  /**
   * All annotation items in order.
   *
   * Derived items are a snapshot from `deriveLineAnnotation`; re-run it after words change.
   */
  list: LineAnnotationItem[]

  constructor(init: Init<LineAnnotation> = {}) {
    this.list = init.list ?? []
  }

  /**
   * Whether any item of a kind exists.
   */
  has(kind: LineAnnotationKind): boolean {
    return this.list.some((item) => item.kind === kind)
  }

  /**
   * All items of a kind.
   */
  all<T extends LineAnnotationKind>(kind: T): Extract<LineAnnotationItem, { kind: T }>[] {
    return this.list.filter((item) => item.kind === kind) as Extract<LineAnnotationItem, { kind: T }>[]
  }

  /**
   * The first item of a kind, preferring a language match then falling back to the first.
   */
  first<T extends LineAnnotationKind>(kind: T, language?: LanguageTag): Extract<LineAnnotationItem, { kind: T }> | undefined {
    const items = this.all(kind)
    if (language !== undefined) {
      const matched = items.find((item) => item.language === language)
      if (matched) {
        return matched
      }
    }
    return items[0]
  }
}

/**
 * Create a line annotation item of a given kind.
 */
export const createLineAnnotationItem = <K extends LineAnnotationKind>(
  kind: K,
  init: LineAnnotationItemInit<K>,
): Extract<LineAnnotationItem, { kind: K }> => {
  return {
    derived: false,
    ...init,
    kind,
  } as Extract<LineAnnotationItem, { kind: K }>
}

/**
 * Aggregate per-word annotations into line items, one per distinct group.
 *
 * `collect` selects a word's annotation tokens, `groupOf` names each token's group, `make` builds the line item.
 *
 * Tokens are joined in word order with spaces padded to follow word spacing; groups keep first-seen order.
 */
const aggregateLineItems = <T extends WordAnnotationItem>(
  words: Word[],
  collect: (word: WordNormal) => T[] | undefined,
  groupOf: (item: T) => string,
  make: (group: string, content: string, language: LanguageTag | undefined) => LineAnnotationItem,
): LineAnnotationItem[] => {
  const groups: string[] = []
  for (let i = 0, len = words.length; i < len; i++) {
    const word = words[i]
    if (word.type === WordType.Space) {
      continue
    }
    const items = collect(word)
    if (!items) {
      continue
    }
    for (const item of items) {
      const group = groupOf(item)
      if (!groups.includes(group)) {
        groups.push(group)
      }
    }
  }

  const result: LineAnnotationItem[] = []
  for (const group of groups) {
    let content = ''
    let pending = 0
    let language: LanguageTag | undefined
    let has = false
    for (let i = 0, len = words.length; i < len; i++) {
      const word = words[i]
      if (word.type === WordType.Space) {
        pending += word.count
        continue
      }
      const item = collect(word)?.find((entry) => groupOf(entry) === group)
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
    if (has) {
      result.push(make(group, content, language))
    }
  }
  return result
}

/**
 * Derive line annotations from word-level annotations.
 *
 * Refreshes derived items while preserving explicit ones, so it is safe to call repeatedly.
 */
export const deriveLineAnnotation = (line: { words: Word[]; annotation: LineAnnotation }): void => {
  const { words, annotation } = line
  for (const kind of DERIVED_KINDS) {
    const hasExplicit = annotation.list.some((item) => item.kind === kind && !item.derived)
    annotation.list = annotation.list.filter((item) => !(item.kind === kind && item.derived))
    if (hasExplicit) {
      continue
    }
    let derived: LineAnnotationItem[]
    switch (kind) {
      case LineAnnotationKind.Ruby:
        derived = aggregateLineItems(
          words,
          (word) => {
            const ruby = word.annotation?.ruby
            return ruby ? [ruby] : undefined
          },
          () => '',
          (_group, content, language) => createLineAnnotationItem(LineAnnotationKind.Ruby, { content, language, derived: true }),
        )
        break
      case LineAnnotationKind.Roman:
        derived = aggregateLineItems(
          words,
          (word) => word.annotation?.romans,
          (item) => item.language ?? '',
          (group, content) => createLineAnnotationItem(LineAnnotationKind.Roman, { content, language: group || undefined, derived: true }),
        )
        break
      default:
        derived = aggregateLineItems(
          words,
          (word) => word.annotation?.unknowns,
          (item) => item.key,
          (group, content, language) => createLineAnnotationItem(LineAnnotationKind.Unknown, { content, language, key: group, derived: true }),
        )
    }
    annotation.list.push(...derived)
  }
}
