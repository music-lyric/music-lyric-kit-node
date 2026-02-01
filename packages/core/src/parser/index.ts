import { Context, Params, BasePlugin, BeforeExecPlugin, ParserPlugin, TransformPlugin, AlignPlugin, AfterExecPlugin } from './plugin'
import { PluginStage, PluginLoader } from './plugin'

export type { Context, Params, BasePlugin, BeforeExecPlugin, ParserPlugin, TransformPlugin, AlignPlugin, AfterExecPlugin }
export { PluginStage, PluginLoader }

export class Parser {
  readonly plugin: PluginLoader = new PluginLoader()

  infer(params: Params) {
    const ctx: Context = {
      params,
      runtime: {
        extendeds: [],
      },
      result: null,
    }

    const plugins = this.plugin.filterByStage(PluginStage.Parser) as ParserPlugin[]

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
    const parsers = this.plugin.filterByStage(PluginStage.Parser) as ParserPlugin[]
    const current = parsers.find((item) => item.format === format)

    if (!current) {
      throw new Error('format not found')
    }

    const ctx: Context = {
      params,
      runtime: {
        extendeds: [],
      },
      result: null,
    }

    const plugins: BasePlugin[] = []

    plugins.push(...this.plugin.filterByStage(PluginStage.BeforeExec, true))
    plugins.push(current)
    plugins.push(...this.plugin.filterByStage(PluginStage.Transform, true))
    if (current?.config?.needAlign === true) {
      plugins.push(...this.plugin.filterByStage(PluginStage.Align, true))
    }
    plugins.push(...this.plugin.filterByStage(PluginStage.AfterExec, true))

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
