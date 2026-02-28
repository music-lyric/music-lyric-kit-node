import type { Options, OptionsRequired } from './options'
import type { GeneratorParams } from './plugin/context'

import { ConfigManager } from '@music-lyric-kit/utils'
import { DEFAULT_OPTIONS } from './options'

import { PluginLoader } from '@root/plugin'
import { GeneratorPlugin, GeneratorStage } from './plugin'
import { GeneratorContext } from './plugin/context'

export class Generator {
  readonly options: ConfigManager<OptionsRequired, Options> = new ConfigManager(DEFAULT_OPTIONS)

  readonly plugin: PluginLoader<GeneratorPlugin> = new PluginLoader()

  constructor(options: Options = {}) {
    this.options.update(options)
  }

  generate(format: string, params: GeneratorParams) {
    const handlers = this.plugin.filterByStage(GeneratorStage.Generate)
    const current = handlers.find((item) => item.format === format)

    if (!current) {
      throw new Error('format not found')
    }

    if (typeof current !== 'object') {
      throw new Error('bad format plugin')
    }

    const context = new GeneratorContext(params)

    const plugins: GeneratorPlugin[] = []

    // before
    plugins.push(...this.plugin.filterByStage(GeneratorStage.Before, true))
    // parser
    plugins.push(current)
    // transform
    plugins.push(...this.plugin.filterByStage(GeneratorStage.Transform, true))
    // after all
    plugins.push(...this.plugin.filterByStage(GeneratorStage.After, true))

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
    }

    return context.result
  }
}

export type { GeneratorParams, GeneratorContext }

export { GeneratorStage, GeneratorPlugin }
