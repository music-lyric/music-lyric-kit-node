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

  private listOf<T extends MetaType>(type: T): Extract<MetaItem, { type: T }>[] {
    return this.list.filter((meta) => meta.type === type) as Extract<MetaItem, { type: T }>[]
  }

  /**
   * All offset meta entries.
   */
  get offsets() {
    return this.listOf(MetaType.Offset)
  }

  /**
   * All duration meta entries.
   */
  get durations() {
    return this.listOf(MetaType.Duration)
  }

  /**
   * All title meta entries.
   */
  get titles() {
    return this.listOf(MetaType.Title)
  }

  /**
   * All singer meta entries.
   */
  get singers() {
    return this.listOf(MetaType.Singer)
  }

  /**
   * All album meta entries.
   */
  get albums() {
    return this.listOf(MetaType.Album)
  }

  /**
   * All creator meta entries.
   */
  get creators() {
    return this.listOf(MetaType.Creator)
  }

  /**
   * All author meta entries.
   */
  get authors() {
    return this.listOf(MetaType.Author)
  }

  /**
   * All isrc meta entries.
   */
  get isrcs() {
    return this.listOf(MetaType.Isrc)
  }

  /**
   * All unknown meta entries.
   */
  get unknowns() {
    return this.listOf(MetaType.Unknown)
  }
}

export * from './content'
