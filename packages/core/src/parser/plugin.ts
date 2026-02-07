import type { BasePlugin } from '../plugin'

import type { Context } from './context'

export enum Stage {
  BeforeExec = 'BeforeExec',
  Parser = 'Parser',
  Transform = 'Transform',
  Align = 'Align',
  AfterExec = 'AfterExec',
}

export interface Base extends BasePlugin<Context> {
  stage: Stage
}

export interface BeforeExec extends Base {
  stage: Stage.BeforeExec
}

export interface FormatParser extends Base {
  stage: Stage.Parser

  format: string

  config: {
    needAlign?: boolean
  }

  check: (ctx: Context) => boolean
}

export interface Transform extends Base {
  stage: Stage.Transform
}

export interface Align extends Base {
  stage: Stage.Align
}

export interface AfterExec extends Base {
  stage: Stage.AfterExec
}

export class Loader {
  private current: Base[] = []

  add(plugin: Base) {
    this.current.push(plugin)
  }

  delete(plugin: Base) {
    const index = this.current.findIndex((it) => it === plugin)
    if (index >= 0) {
      this.current.splice(index, 1)
    }
  }

  clear() {
    this.current = []
  }

  filterByStage(stage: Stage, sort: boolean = false) {
    const target = this.current.filter((item) => item.stage === stage)
    if (sort) {
      return target.sort((a, b) => (Number(a) || 100) - (Number(b) || 100))
    }
    return target
  }
}
