import type { DeepPartial } from '@music-lyric-kit/utils'
import type { SpaceConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'
import { insertSpaceToExtended, insertSpaceToLine } from './core'

export class Insert extends ParserPlugin {
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

    const handleLine = (line: Lyric.LineNormal | Lyric.LineNormalBackground) => {
      if (enableOriginal) {
        line.content = insertSpaceToLine(line.content, this.config.current.types)
      }
      if (enableExtended) {
        line.content = insertSpaceToExtended(line.content, this.config.current.types)
      }
    }

    for (const line of lines) {
      if (line.type !== Lyric.LineType.Normal) {
        continue
      }
      handleLine(line)
      for (const background of line.background || []) {
        handleLine(background)
      }
    }

    ctx.result.lines = lines
  }
}

export { INSERT_TEXT_SPACE_TYPES } from './constants'
export type { InsertTextSpaceTypes } from './constants'

export type { SpaceConfig }
