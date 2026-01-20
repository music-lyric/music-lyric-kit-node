import { Context, Plugin } from './interface'

export class PluginLoader {
  private data: Plugin[] = []

  add(plugin: Plugin) {
    this.data.push(plugin)
  }

  unshift(plugin: Plugin) {
    this.data.unshift(plugin)
  }

  delete(plugin: Plugin) {
    const index = this.data.findIndex((it) => it === plugin)
    if (index >= 0) {
      this.data.splice(index, 1)
    }
  }

  clear() {
    this.data = []
  }

  get current() {
    return this.data
  }
}

export interface Format {
  check: (ctx: Context) => boolean
  plugin: PluginLoader
}

export class FormatLoader {
  private current: Map<string, Format> = new Map()

  add(format: string, content: Format, overwrite: boolean = false) {
    const has = this.current.has(format)
    if (has && !overwrite) {
      return
    }
    this.current.set(format, content)
  }

  get(format: string) {
    return this.current.get(format)
  }

  delete(format: string) {
    return this.current.delete(format)
  }

  clear() {
    return this.current.clear()
  }

  keys() {
    return this.current.keys()
  }
}
