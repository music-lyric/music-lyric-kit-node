import { ConfigManager } from '@music-lyric-kit/utils'
import { BasePlugin } from '@root/plugin'

import type { ParserContext } from './context'

export enum ParserStage {
  Before,
  Parse,
  Transform,
  After,
}

export abstract class ParserPlugin extends BasePlugin<ParserContext> {
  abstract get stage(): ParserStage
}

export class PluginLoader {
  private current: Map<string, ParserPlugin> = new Map()

  get(id: string) {
    return this.current.get(id)
  }

  add(plugin: ParserPlugin, overwrite = false) {
    const id = plugin.id
    if (!id || typeof id !== 'string') {
      return
    }

    const exist = this.current.get(id)
    if (exist && !overwrite) {
      return
    }

    this.current.set(id, plugin)
  }

  delete(id: string): boolean
  delete(plugin: ParserPlugin): boolean
  delete(content: string | ParserPlugin) {
    const id = typeof content === 'string' ? content : content?.id
    if (!id || typeof id !== 'string') {
      return false
    }

    return this.current.delete(id)
  }

  clear() {
    return this.current.clear()
  }

  keys() {
    return [...this.current.keys()]
  }

  filterByStage(stage: ParserStage, sort: boolean = false): ParserPlugin[] {
    const values = [...this.current.values()]
    const target = values.filter((item) => item.stage === stage)

    if (sort) {
      return target.sort((a, b) => (Number(a.priority) || 100) - (Number(b.priority) || 100))
    }

    return target
  }
}

export type * from './context'
