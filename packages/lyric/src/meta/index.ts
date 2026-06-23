import type { Init } from '@root/init'
import type { MetaItem } from './content'

import { MetaType } from './content'

export class Meta {
  /**
   * All meta entries in order.
   */
  list: MetaItem[]

  constructor(init: Init<Meta> = {}) {
    this.list = init.list ?? []
  }

  /**
   * Whether any entry of a meta type exists.
   */
  has(type: MetaType): boolean {
    return this.list.some((meta) => meta.type === type)
  }

  /**
   * All entries of a meta type.
   */
  all<T extends MetaType>(type: T): Extract<MetaItem, { type: T }>[] {
    return this.list.filter((meta) => meta.type === type) as Extract<MetaItem, { type: T }>[]
  }

  /**
   * The first entry of a meta type.
   */
  first<T extends MetaType>(type: T): Extract<MetaItem, { type: T }> | undefined {
    return this.list.find((meta) => meta.type === type) as Extract<MetaItem, { type: T }> | undefined
  }

  /**
   * All entries with the given original key.
   */
  byKey(key: string): MetaItem[] {
    return this.list.filter((meta) => meta.key === key)
  }
}

export * from './content'
