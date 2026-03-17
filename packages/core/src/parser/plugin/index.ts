import { BasePlugin } from '@root/plugin'

import type { ParserContext } from './context'

export enum ParserStage {
  Before,
  Parse,
  Transform,
  After,
}

export abstract class ParserPlugin extends BasePlugin<ParserContext> {
  abstract get stage(): ParserStage
}

export type * from './context'
