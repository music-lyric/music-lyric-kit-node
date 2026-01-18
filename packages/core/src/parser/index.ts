import { Context, Params, Plugin } from './interface'
import { CommonLoader, FormatLoader } from './loader'

export type { Context, Params, Plugin }

export class Parser {
  formats: FormatLoader = new FormatLoader()

  plugins: CommonLoader = new CommonLoader()

  infer(params: Params) {
    const ctx: Context = {
      params,
      result: null,
    }

    const all = this.formats.keys()

    for (const key of all) {
      const value = this.formats.get(key)
      if (!value) {
        continue
      }
      try {
        const result = value.check.call(value, ctx)
        if (result === true) {
          return key
        }
      } catch {
        continue
      }
    }

    return null
  }

  parse(format: string, params: Params) {
    const formatValue = this.formats.get(format)
    if (!formatValue) {
      throw new Error('format not found')
    }

    const ctx: Context = {
      params,
      result: null,
    }

    const plugins = [
      ...(Array.isArray(this.plugins.before) ? this.plugins.before : []),
      ...formatValue.plugins,
      ...(Array.isArray(this.plugins.after) ? this.plugins.after : []),
    ]

    for (const plugin of plugins) {
      try {
        plugin.exec.call(plugin, ctx)
      } catch {
        break
      }
    }

    return ctx.result
  }
}
