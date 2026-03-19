import type { Options, OptionsRequired } from './options'
import type { ParserParams, ParserRuntime } from './plugin/context'

import { ConfigManager } from '@music-lyric-kit/utils'
import { DEFAULT_OPTIONS } from './options'

import { PluginLoader } from '@root/plugin'
import { ParserPlugin, ParserStage } from './plugin'
import { ParserContext } from './plugin/context'

import { AlignPlugin } from './built'

export class Parser {
  private readonly alignPlugin = new AlignPlugin()

  readonly options: ConfigManager<OptionsRequired, Options> = new ConfigManager(DEFAULT_OPTIONS)

  readonly plugin: PluginLoader<ParserPlugin> = new PluginLoader()

  constructor(options: Options = {}) {
    this.options.update(options)
  }

  infer(params: ParserParams) {
    const context = new ParserContext(params)

    const plugins = this.plugin.filterByStage(ParserStage.Parse) as ParserPlugin[]

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

  parse(format: string, params: ParserParams) {
    const parsers = this.plugin.filterByStage(ParserStage.Parse)
    const current = parsers.find((item) => item.format === format)

    if (!current) {
      throw new Error('format not found')
    }

    if (typeof current !== 'object') {
      throw new Error('bad format plugin')
    }

    const context = new ParserContext(params)

    const plugins: ParserPlugin[] = []

    // before
    plugins.push(...this.plugin.filterByStage(ParserStage.Before, true))
    // parser
    plugins.push(current)
    // transform
    plugins.push(...this.plugin.filterByStage(ParserStage.Transform, true))
    // after all
    plugins.push(...this.plugin.filterByStage(ParserStage.After, true))

    while (plugins.length > 0) {
      const plugin = plugins.shift()

      if (!plugin) {
        continue
      }

      try {
        plugin.exec.call(plugin, context)
      } catch (e) {
        break
      }

      if (plugin.id === current.id && context.needAlignExtended) {
        this.alignPlugin.config.update(this.options.current.align)
        plugins.unshift(this.alignPlugin)
      }
    }

    context.handleSort()
    context.handleCalcAgentIndex()

    return context.result
  }
}

export type { ParserParams, ParserContext, ParserRuntime }

export { ParserStage, ParserPlugin }
