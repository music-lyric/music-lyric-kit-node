import { PLUGIN_DEFS } from '@root/core/plugins'

import { reactive, watch } from 'vue'

const STORAGE_KEY = 'lyric_parser_plugins'

export interface PluginState {
  enabled: boolean
  values: Record<string, any>
}

export type PluginStates = Record<string, PluginState>

const buildDefaults = (): PluginStates => {
  const states: PluginStates = {}
  for (const def of PLUGIN_DEFS) {
    const values: Record<string, any> = {}
    for (const field of def.fields) {
      values[field.key] = Array.isArray(field.default) ? [...field.default] : field.default
    }
    states[def.key] = { enabled: def.defaultEnabled, values }
  }
  return states
}

const load = (): PluginStates => {
  const states = buildDefaults()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return states
    }
    const saved = JSON.parse(raw) as PluginStates
    for (const def of PLUGIN_DEFS) {
      const item = saved[def.key]
      if (!item) {
        continue
      }
      if (typeof item.enabled === 'boolean') {
        states[def.key].enabled = item.enabled
      }
      if (item.values) {
        for (const field of def.fields) {
          if (field.key in item.values) {
            states[def.key].values[field.key] = item.values[field.key]
          }
        }
      }
    }
  } catch {
    // ignore malformed storage and fall back to defaults
  }
  return states
}

let store: PluginStates | null = null

export const usePluginConfig = () => {
  if (!store) {
    store = reactive(load())
    watch(
      store,
      () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
      },
      { deep: true },
    )
  }

  const reset = () => {
    Object.assign(store!, buildDefaults())
  }

  const toggle = (key: string, enabled: boolean) => {
    const item = store![key]
    if (item) {
      item.enabled = enabled
    }
  }

  return {
    states: store,
    defs: PLUGIN_DEFS,
    reset,
    toggle,
  }
}
