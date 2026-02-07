import * as Plugin from './plugin'

import { Context, Params } from './context'

import { handleAlignExtended } from './utils'

export class Client {
  readonly plugin: Plugin.Loader = new Plugin.Loader()

  infer(params: Params) {
    const context = new Context(params)

    const plugins = this.plugin.filterByStage(Plugin.Stage.Parser) as Plugin.FormatParser[]

    for (const plugin of plugins) {
      if (typeof plugin !== 'object') {
        continue
      }
      try {
        const result = plugin.check.call(plugin, context)
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

    if (typeof current !== 'object') {
      throw new Error('bad format plugin')
    }

    const context = new Context(params)

    const plugins: Plugin.Base[] = []

    // before parse
    plugins.push(...this.plugin.filterByStage(Plugin.Stage.BeforeExec, true))
    // current format parser
    plugins.push(current)
    // transform
    plugins.push(...this.plugin.filterByStage(Plugin.Stage.Transform, true))
    // align
    if (current.config?.needAlignExtended) {
      plugins.push({
        stage: Plugin.Stage.Transform,
        exec(ctx) {
          const lines = ctx.result?.lines || []
          const extendeds = ctx.runtime?.extendeds || []
          if (!Array.isArray(lines) || !Array.isArray(extendeds)) {
            return
          }
          if (!lines.length || !extendeds.length) {
            return
          }
          const result = handleAlignExtended(lines, extendeds)
          if (!result.length) {
            return
          }
          ctx.result.lines = result
        },
      })
    }
    // after all step
    plugins.push(...this.plugin.filterByStage(Plugin.Stage.AfterExec, true))

    for (const plugin of plugins) {
      try {
        plugin.exec.call(plugin, context)
      } catch {
        break
      }
    }

    context.sort()

    return context.result
  }
}

export type { Context, Params }

export { Plugin }
