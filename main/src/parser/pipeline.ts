import type { ParserParams } from '@music-lyric-kit/core'

import { Info } from '@music-lyric-kit/lyric'
import { ParserContext, ParserPlugin } from '@music-lyric-kit/core'

import { Formats, Transforms } from '@root/plugin'

export interface ParserPipelineInput {
  format?: string
  content: any
  musicInfo?: ParserParams['musicInfo']
}

export interface ParserPipelineResult {
  format: string
  result: Info
}

const BuiltInFormats = [new Formats.Lrc.Parser(), new Formats.Ttml.AmllParser()]

const BuiltInPlugins = {
  agent: {
    extract: new Transforms.Agent.ExtractPlugin(),
  },
  background: {
    extract: new Transforms.Background.ExtractPlugin(),
    clean: new Transforms.Background.CleanPlugin(),
  },
  pure: {
    extract: new Transforms.Pure.ExtractCreatorPlugin(),
    clean: new Transforms.Pure.CleanPlugin(),
  },
  space: {
    insert: new Transforms.Space.InsertPlugin(),
  },
  interlude: {
    insert: new Transforms.Interlude.InsertPlugin(),
  },
  stress: {
    mark: new Transforms.Stress.MarkPlugin(),
  },
}

export class ParserPipeline {
  private context: ParserContext
  private format: string
  private input: ParserPipelineInput
  private done: boolean

  constructor(input: ParserPipelineInput) {
    this.done = false
    this.input = input
    this.format = this.input.format || ''

    const init = new Info()
    this.context = new ParserContext({ content: this.input.content, musicInfo: this.input.musicInfo }, init)
  }

  private handleApplyConfig(plugin: ParserPlugin, options?: any) {
    if (!plugin.config) {
      return
    }

    // reset config first
    plugin.config.reset()

    if (options) {
      plugin.config.update(options)
    }
  }

  private handleExecPlugin(plugin: ParserPlugin) {
    this.done = false

    try {
      const result = plugin.check(this.context)
      if (!result) {
        return
      }
    } catch (e: any) {
      console.warn(`plugin check failed id=${plugin.id} err=${e?.message}`)
      return
    }

    try {
      plugin.exec(this.context)
    } catch (e: any) {
      console.warn(`plugin call failed id=${plugin.id} err=${e?.message}`)
    }
  }

  infer(): this {
    if (this.format) {
      return this
    }
    for (const plugin of BuiltInFormats) {
      try {
        const result = plugin.check(this.context)
        if (result) {
          this.format = plugin.format
        }
        break
      } catch {
        continue
      }
    }
    return this
  }

  parse(): this {
    if (!this.format) {
      throw new Error('no format detected. call .infer() before .parse()')
    }

    const parser = BuiltInFormats.find((item) => item.format === this.format)
    if (!parser) {
      throw new Error(`parser plugin not found: "${this.format}"`)
    }

    this.done = false

    try {
      parser.exec(this.context)
    } catch (e: any) {
      console.warn(`plugin call failed id=${parser.id} err=${e?.message}`)
    }

    return this
  }

  backgroundExtract(options?: Transforms.Background.ExtractConfig): this {
    this.handleApplyConfig(BuiltInPlugins.background.extract, options)
    this.handleExecPlugin(BuiltInPlugins.background.extract)
    return this
  }

  backgroundClean(): this {
    this.handleExecPlugin(BuiltInPlugins.background.clean)
    return this
  }

  agentExtract(options?: Transforms.Agent.ExtractConfig): this {
    this.handleApplyConfig(BuiltInPlugins.agent.extract, options)
    this.handleExecPlugin(BuiltInPlugins.agent.extract)
    return this
  }

  pureExtract(options?: Transforms.Pure.ExtractCreatorConfig): this {
    this.handleApplyConfig(BuiltInPlugins.pure.extract, options)
    this.handleExecPlugin(BuiltInPlugins.pure.extract)
    return this
  }

  pureClean(options?: Transforms.Pure.CleanConfig): this {
    this.handleApplyConfig(BuiltInPlugins.pure.clean, options)
    this.handleExecPlugin(BuiltInPlugins.pure.clean)
    return this
  }

  interludeInsert(options?: Transforms.Interlude.InsertConfig): this {
    this.handleApplyConfig(BuiltInPlugins.interlude.insert, options)
    this.handleExecPlugin(BuiltInPlugins.interlude.insert)
    return this
  }

  spaceInsert(options?: Transforms.Space.SpaceConfig): this {
    this.handleApplyConfig(BuiltInPlugins.space.insert, options)
    this.handleExecPlugin(BuiltInPlugins.space.insert)
    return this
  }

  stressMark(options?: Transforms.Stress.MarkConfig): this {
    this.handleApplyConfig(BuiltInPlugins.stress.mark, options)
    this.handleExecPlugin(BuiltInPlugins.stress.mark)
    return this
  }

  final(): ParserPipelineResult {
    if (!this.done) {
      this.context.cleanWord()
      this.context.calcAgentIndex()
      this.context.syncLineTimeWithWord()
      this.context.sort()
      this.context.syncLineTimeWithBackground()
      this.done = true
    }

    return {
      format: this.format,
      result: this.context.result,
    }
  }
}

export const createParserPipeline = (input: ParserPipelineInput) => {
  return new ParserPipeline(input)
}
