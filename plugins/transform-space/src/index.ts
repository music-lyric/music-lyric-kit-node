import type { DeepPartial } from '@music-lyric-kit/utils'
import type { SpaceConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'
import { insertSpaceToExtended, insertSpaceToLine } from './core'

export class InsertPlugin extends ParserPlugin {
  override config = new ConfigManager<SpaceConfig, DeepPartial<SpaceConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-SPACE-INSERT'
  }

  override get stage() {
    return PluginStage.Transform
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    const enableOriginal = this.config.current.original
    const enableExtended = this.config.current.extended
    if (!enableOriginal && !enableExtended) {
      return
    }

    for (const line of lines) {
      if (line.type !== LineType.Normal) {
        continue
      }
      if (enableOriginal) {
        const result = insertSpaceToLine(line.content, this.config.current.types)
        line.content = result
      }
      if (enableExtended) {
        const result = insertSpaceToExtended(line.content, this.config.current.types)
        line.content = result
      }
    }

    ctx.result.lines = lines
  }
}

export { INSERT_TEXT_SPACE_TYPES } from './constants'
export type { InsertTextSpaceTypes } from './constants'

export type { SpaceConfig }
