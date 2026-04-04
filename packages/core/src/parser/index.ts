import type { DeepPartial } from '@music-lyric-kit/utils'
import type { ParserOptions } from './options'
import type { ParserParams, ParserResult } from './context'

import { DEFAULT_OPTIONS } from './options'

import { Info } from '@music-lyric-kit/lyric'
import { ConfigManager } from '@music-lyric-kit/utils'
import { BasePlugin, PluginLoader, PluginStage } from '@root/plugin'
import { ParserContext } from './context'

export abstract class ParserPlugin extends BasePlugin<ParserContext> {}

export class Parser {
  readonly options: ConfigManager<ParserOptions, DeepPartial<ParserOptions>> = new ConfigManager(DEFAULT_OPTIONS)

  readonly plugin: PluginLoader<ParserPlugin> = new PluginLoader()

  constructor(options: ParserOptions = {}) {
    this.options.update(options)
  }

  infer(params: ParserParams) {
    const init = new Info()
    const context = new ParserContext(params, init)

    const plugins = this.plugin.filterByStage(PluginStage.Process) as ParserPlugin[]

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

  parse(format: string, params: ParserParams): ParserResult {
    const processors = this.plugin.filterByStage(PluginStage.Process)
    const current = processors.find((item) => item.format === format)

    if (!current) {
      throw new Error('format not found')
    }

    if (typeof current !== 'object') {
      throw new Error('bad format plugin')
    }

    const init = new Info()
    const context = new ParserContext(params, init)

    const plugins: ParserPlugin[] = []

    // before
    plugins.push(...this.plugin.filterByStage(PluginStage.Pre, true))
    // process
    plugins.push(current)
    // transform
    plugins.push(...this.plugin.filterByStage(PluginStage.Transform, true))
    // after all
    plugins.push(...this.plugin.filterByStage(PluginStage.Post, true))

    while (plugins.length > 0) {
      const plugin = plugins.shift()

      if (!plugin) {
        continue
      }

      try {
        const result = plugin.check.call(plugin, context)
        if (!result) {
          continue
        }
      } catch {}

      try {
        plugin.exec.call(plugin, context)
      } catch (e) {
        break
      }
    }

    context.handleCleanWords()
    context.handleCalcAgentIndex()
    context.handleSyncLineTime()
    context.handleSort()

    return context.result
  }
}

export { ParserContext }

export type { ParserParams, ParserResult, ParserOptions }
