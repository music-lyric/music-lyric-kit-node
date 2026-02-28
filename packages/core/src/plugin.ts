import { ConfigManager } from '@music-lyric-kit/utils'

export abstract class BaseContext {
  abstract params: any

  abstract result: any
}

export abstract class BasePlugin<Context = BaseContext> {
  abstract get id(): string

  abstract get name(): string

  abstract get stage(): any

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

export class PluginLoader<T extends BasePlugin> {
  private current: Map<string, T> = new Map()

  get(id: string) {
    return this.current.get(id)
  }

  add(plugin: T, overwrite = false) {
    const id = plugin.id
    if (!id || typeof id !== 'string') {
      return
    }

    const exist = this.current.get(id)
    if (exist && !overwrite) {
      return
    }

    this.current.set(id, plugin)
  }

  delete(id: string): boolean
  delete(plugin: T): boolean
  delete(content: string | T) {
    const id = typeof content === 'string' ? content : content?.id
    if (!id || typeof id !== 'string') {
      return false
    }

    return this.current.delete(id)
  }

  clear() {
    return this.current.clear()
  }

  keys() {
    return [...this.current.keys()]
  }

  filterByStage<S>(stage: S, sort: boolean = false): T[] {
    const values = [...this.current.values()]
    const target = values.filter((item) => item.stage === stage)

    if (sort) {
      return target.sort((a, b) => (Number(a.priority) || 100) - (Number(b.priority) || 100))
    }

    return target
  }
}
