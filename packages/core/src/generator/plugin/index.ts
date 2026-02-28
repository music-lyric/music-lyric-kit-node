import { BasePlugin } from '@root/plugin'

import type { GeneratorContext } from './context'

export enum GeneratorStage {
  Before,
  Generate,
  Transform,
  After,
}

export abstract class GeneratorPlugin extends BasePlugin<GeneratorContext> {
  abstract get stage(): GeneratorStage
}

export type * from './context'
