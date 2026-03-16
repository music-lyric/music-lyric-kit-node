import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line } from '@music-lyric-kit/lyric'
import type { SpaceConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'
import { insertSpaceToLine } from './core'

export class InsertPlugin extends ParserPlugin {
  override config = new ConfigManager<SpaceConfig, DeepPartial<SpaceConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-INSERT-SPACE'
  }

  override get name() {
    return 'TRANSFORM-INSERT-SPACE'
  }

  override get stage() {
    return ParserStage.Transform
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    const newLines: Line[] = []

    for (const line of lines) {
      if (line.type == LineType.Normal) {
        const result = insertSpaceToLine(line.content, this.config.current.types)
        line.content = result
      }
      newLines.push(line)
    }

    ctx.result.lines = newLines
  }
}

export { INSERT_TEXT_SPACE_TYPES } from './constants'
export type { InsertTextSpaceTypes } from './constants'

export type { SpaceConfig }
