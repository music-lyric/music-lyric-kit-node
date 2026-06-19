import type { PluginStates } from '@root/composables/usePluginConfig'

import { Parser, Format } from 'music-lyric-kit'
import { PLUGIN_DEFS } from '@root/core/plugins'

/**
 * Build a client parser with only the enabled plugins, each configured from the panel state.
 * Plugins run by stage and priority, so registration order only breaks ties.
 */
export const buildClient = (states: PluginStates) => {
  const client = new Parser()

  client.plugin.add(new Format.Lrc.Parser())
  client.plugin.add(new Format.Ttml.AmllParser())
  client.plugin.add(new Format.Ttml.AmParser())

  for (const def of PLUGIN_DEFS) {
    const state = states[def.key]
    if (!state?.enabled) {
      continue
    }
    client.plugin.add(def.createPlugin(def.buildConfig(state.values)))
  }

  return client
}
