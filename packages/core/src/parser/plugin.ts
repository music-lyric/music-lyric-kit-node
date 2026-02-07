import type { BasePlugin } from '../plugin'

import type { Context } from './context'

export enum Stage {
  BeforeExec = 'BeforeExec',
  FormatParser = 'FormatParser',
  Transform = 'Transform',
  AfterExec = 'AfterExec',
}

export namespace Plugin {
  type Base = BasePlugin<Context>

  export type BeforeExec = Base & {
    meta: {
      stage: Stage.BeforeExec
    }
  }

  export type FormatParser = Base & {
    meta: {
      stage: Stage.FormatParser

      format: string

      config: {
        needAlignExtended?: boolean
      }
    }

    check: (ctx: Context) => boolean
  }

  export type Transform = Base & {
    meta: {
      stage: Stage.Transform
    }
  }

  export type AfterExec = Base & {
    meta: {
      stage: Stage.AfterExec
    }
  }

  export type All = BeforeExec | FormatParser | Transform | AfterExec
}

export class PluginLoader {
  private current: Plugin.All[] = []

  add(plugin: Plugin.All) {
    this.current.push(plugin)
  }

  delete(plugin: Plugin.All) {
    const index = this.current.findIndex((it) => it === plugin)
    if (index >= 0) {
      this.current.splice(index, 1)
    }
  }

  clear() {
    this.current = []
  }

  filterByStage(stage: Stage, sort: boolean = false): Plugin.All[] {
    const target = this.current.filter((item) => item.meta.stage === stage)

    if (sort) {
      return target.sort((a, b) => (Number(a.meta.priority) || 100) - (Number(b.meta.priority) || 100))
    }

    return target
  }
}
