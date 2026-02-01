import type { Info, Extended, Time } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin as _BasePlugin } from '../plugin'

export interface Params {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export interface Context extends BaseContext {
  // input
  params: Params

  // runtime data
  runtime: {
    extendeds: [Time, Extended][]
  }

  // result lyric info
  result: Info | null
}

export enum PluginStage {
  BeforeExec = 'BeforeExec',
  Parser = 'Parser',
  Transform = 'Transform',
  Align = 'Align',
  AfterExec = 'AfterExec',
}

export interface BasePlugin extends _BasePlugin<Context> {
  stage: PluginStage
}

export interface BeforeExecPlugin extends BasePlugin {
  stage: PluginStage.BeforeExec
}

export interface ParserPlugin extends BasePlugin {
  stage: PluginStage.Parser

  format: string

  config: {
    needAlign?: boolean
  }

  check: (ctx: Context) => boolean
}

export interface TransformPlugin extends BasePlugin {
  stage: PluginStage.Transform
}

export interface AlignPlugin extends BasePlugin {
  stage: PluginStage.Align
}

export interface AfterExecPlugin extends BasePlugin {
  stage: PluginStage.AfterExec
}

export class PluginLoader {
  private current: BasePlugin[] = []

  add(plugin: BasePlugin) {
    this.current.push(plugin)
  }

  delete(plugin: BasePlugin) {
    const index = this.current.findIndex((it) => it === plugin)
    if (index >= 0) {
      this.current.splice(index, 1)
    }
  }

  clear() {
    this.current = []
  }

  filterByStage(stage: PluginStage, sort: boolean = false) {
    const target = this.current.filter((item) => item.stage === stage)
    if (sort) {
      return target.sort((a, b) => (Number(a) || 100) - (Number(b) || 100))
    }
    return target
  }
}
