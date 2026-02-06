import { Info } from '@music-lyric-kit/lyric'

import * as Plugin from './plugin'

import type { Context, Params } from './interface'

export class Client {
  readonly plugin: Plugin.Loader = new Plugin.Loader()

  infer(params: Params) {
    const ctx: Context = {
      params,
      runtime: {
        extendeds: [],
      },
      result: new Info(),
    }

    const plugins = this.plugin.filterByStage(Plugin.Stage.Parser) as Plugin.FormatParser[]

    for (const plugin of plugins) {
      if (typeof plugin !== 'object') {
        continue
      }
      try {
        const result = plugin.check.call(plugin, ctx)
        if (result === true) {
          return plugin.format
        }
      } catch {
        continue
      }
    }

    return null
  }

  parse(format: string, params: Params) {
    const parsers = this.plugin.filterByStage(Plugin.Stage.Parser) as Plugin.FormatParser[]
    const current = parsers.find((item) => item.format === format)

    if (!current) {
      throw new Error('format not found')
    }

    const ctx: Context = {
      params,
      runtime: {
        extendeds: [],
      },
      result: new Info(),
    }

    const plugins: Plugin.Base[] = []

    plugins.push(...this.plugin.filterByStage(Plugin.Stage.BeforeExec, true))
    plugins.push(current)
    plugins.push(...this.plugin.filterByStage(Plugin.Stage.Transform, true))
    if (current?.config?.needAlign === true) {
      plugins.push(...this.plugin.filterByStage(Plugin.Stage.Align, true))
    }
    plugins.push(...this.plugin.filterByStage(Plugin.Stage.AfterExec, true))

    for (const plugin of plugins) {
      try {
        plugin.exec.call(plugin, ctx)
      } catch {
        break
      }
    }

    return ctx.result
  }
}

export type { Context, Params }

export { Plugin }
