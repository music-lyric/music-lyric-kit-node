import { ConfigManager } from '@music-lyric-kit/utils'

export enum PluginStage {
  Setup,
  Pre,
  Process,
  Transform,
  Post,
  Cleanup,
}

export abstract class BaseContext {
  abstract params: any

  abstract result: any
}

export abstract class BasePlugin<Context = BaseContext> {
  abstract get id(): string

  abstract get stage(): PluginStage

  get name(): string {
    return ''
  }

  get priority(): number {
    return 100
  }

  get format(): string {
    return ''
  }

  readonly config?: ConfigManager<any, any>

  abstract check(ctx: Context): boolean

  abstract exec(ctx: Context): void
}
