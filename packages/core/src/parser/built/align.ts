import type { DeepPartial } from '@music-lyric-kit/utils'

import { Extended, LineNormal, LineType } from '@music-lyric-kit/lyric'
import { OptionsManager } from '@root/utils'
import { ParserPlugin, ParserStage, ParserContext } from '../plugin'

import { alignNumberArray } from '@music-lyric-kit/utils'

export interface AlignPluginConfig {
  fuzzyThreshold: number
}

const DEFAULT_CONFIG: AlignPluginConfig = {
  fuzzyThreshold: 0,
} as const

export class AlignPlugin extends ParserPlugin<AlignPluginConfig, DeepPartial<AlignPluginConfig>> {
  override config = new OptionsManager(DEFAULT_CONFIG)

  override get id() {
    return 'BUILT-IN-ALIGN'
  }

  override get name() {
    return 'ALIGN-PLUGIN'
  }

  override get stage() {
    return ParserStage.Transform
  }

  override check(ctx: ParserContext) {
    return ctx.needAlignExtended
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    const extendeds = ctx.runtime.extendeds

    if (!lines.length || !extendeds.length) {
      return
    }

    const baseMap = new Map<number, LineNormal>()

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line && line.type === LineType.Normal) {
        baseMap.set(line.time.start, line as LineNormal)
      }
    }

    if (baseMap.size === 0) {
      return
    }

    const extendedMap = new Map<number, Extended[]>()

    for (let i = 0; i < extendeds.length; i++) {
      const [time, extended] = extendeds[i]

      let list = extendedMap.get(time.start)
      if (!list) {
        list = []
        extendedMap.set(time.start, list)
      }

      list.push(extended)
    }

    const result = alignNumberArray([...baseMap.keys()], [...extendedMap.keys()], this.config.current.fuzzyThreshold)

    for (const item of result) {
      const line = baseMap.get(item.base)
      if (!line) {
        continue
      }

      const content = line.content
      if (!Array.isArray(content.extended)) {
        content.extended = []
      }

      for (const matched of item.targets) {
        const extendedList = extendedMap.get(matched.value)
        if (extendedList) {
          content.extended.push(...extendedList)
        }
      }
    }

    ctx.runtime.extendeds = []
  }
}
