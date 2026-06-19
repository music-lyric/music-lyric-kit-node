import type { ParserPipeline } from 'music-lyric-kit'

import { Transform } from 'music-lyric-kit'

export type FieldType = 'boolean' | 'number' | 'string' | 'enum' | 'multienum'

export interface FieldOption {
  value: string
  labelKey: string
}

export interface PluginField {
  key: string
  type: FieldType
  default: boolean | number | string | string[]
  labelKey: string
  options?: FieldOption[]
  min?: number
  max?: number
  step?: number
}

export interface PluginDef {
  key: string
  labelKey: string
  defaultEnabled: boolean
  fields: PluginField[]
  buildConfig: (values: Record<string, any>) => any
  runPipeline: (pipeline: ParserPipeline, config: any) => void
  createPlugin: (config: any) => any
}

const MATCH_MODE_OPTIONS: FieldOption[] = [
  { value: 'fuzzy', labelKey: 'option.fuzzy' },
  { value: 'exact', labelKey: 'option.exact' },
]

const SPACE_TYPE_OPTIONS: FieldOption[] = Object.values(Transform.Space.INSERT_TEXT_SPACE_TYPES).map((value) => ({
  value,
  labelKey: `spaceType.${value}`,
}))

export const PLUGIN_DEFS: PluginDef[] = [
  {
    key: 'pureClean',
    labelKey: 'plugin.pureClean',
    defaultEnabled: true,
    fields: [
      { key: 'firstLineWithMusicInfo', type: 'boolean', default: true, labelKey: 'field.firstLineWithMusicInfo' },
      { key: 'mode', type: 'enum', default: 'fuzzy', labelKey: 'field.mode', options: MATCH_MODE_OPTIONS },
      { key: 'check', type: 'number', default: 50, labelKey: 'field.check', min: 0, max: 100, step: 1 },
      { key: 'useDefault', type: 'boolean', default: true, labelKey: 'field.useDefault' },
    ],
    buildConfig: (v) => ({
      mode: v.mode,
      fuzzy: {},
      exact: { check: Number(v.check) || 0 },
      rule: { useDefault: v.useDefault, custom: [] },
      firstLineWithMusicInfo: v.firstLineWithMusicInfo,
    }),
    runPipeline: (p, c) => p.pure.clean(c),
    createPlugin: (c) => {
      const plugin = new Transform.Pure.Clean()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'pureExtractCreator',
    labelKey: 'plugin.pureExtractCreator',
    defaultEnabled: true,
    fields: [
      { key: 'replace', type: 'boolean', default: true, labelKey: 'field.replace' },
      { key: 'split', type: 'string', default: '/', labelKey: 'field.split' },
      { key: 'mode', type: 'enum', default: 'exact', labelKey: 'field.mode', options: MATCH_MODE_OPTIONS },
      { key: 'check', type: 'number', default: 50, labelKey: 'field.check', min: 0, max: 100, step: 1 },
      { key: 'useDefault', type: 'boolean', default: true, labelKey: 'field.useDefault' },
    ],
    buildConfig: (v) => ({
      match: { mode: v.mode, fuzzy: {}, exact: { check: Number(v.check) || 0 }, rule: { useDefault: v.useDefault, custom: [] } },
      split: v.split,
      replace: v.replace,
    }),
    runPipeline: (p, c) => p.pure.extractCreator(c),
    createPlugin: (c) => {
      const plugin = new Transform.Pure.ExtractCreator()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'agentExtract',
    labelKey: 'plugin.agentExtract',
    defaultEnabled: true,
    fields: [
      { key: 'replace', type: 'boolean', default: true, labelKey: 'field.replace' },
      { key: 'split', type: 'string', default: '/', labelKey: 'field.split' },
    ],
    buildConfig: (v) => ({ split: v.split, replace: v.replace }),
    runPipeline: (p, c) => p.agent.extract(c),
    createPlugin: (c) => {
      const plugin = new Transform.Agent.Extract()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'backgroundExtract',
    labelKey: 'plugin.backgroundExtract',
    defaultEnabled: true,
    fields: [
      { key: 'fullLine', type: 'boolean', default: true, labelKey: 'field.fullLine' },
      { key: 'inLine', type: 'boolean', default: true, labelKey: 'field.inLine' },
      { key: 'crossLine', type: 'boolean', default: true, labelKey: 'field.crossLine' },
    ],
    buildConfig: (v) => ({ fullLine: v.fullLine, inLine: v.inLine, crossLine: v.crossLine }),
    runPipeline: (p, c) => p.background.extract(c),
    createPlugin: (c) => {
      const plugin = new Transform.Background.Extract()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'backgroundClean',
    labelKey: 'plugin.backgroundClean',
    defaultEnabled: true,
    fields: [],
    buildConfig: () => undefined,
    runPipeline: (p) => p.background.clean(),
    createPlugin: () => new Transform.Background.Clean(),
  },
  {
    key: 'interlude',
    labelKey: 'plugin.interlude',
    defaultEnabled: true,
    fields: [
      { key: 'first', type: 'number', default: 5000, labelKey: 'field.checkTimeFirst', min: 0, step: 100 },
      { key: 'normal', type: 'number', default: 10000, labelKey: 'field.checkTimeNormal', min: 0, step: 100 },
    ],
    buildConfig: (v) => ({ checkTime: { first: Number(v.first) || 0, normal: Number(v.normal) || 0 } }),
    runPipeline: (p, c) => p.interlude.insert(c),
    createPlugin: (c) => {
      const plugin = new Transform.Interlude.Insert()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'space',
    labelKey: 'plugin.space',
    defaultEnabled: true,
    fields: [
      { key: 'original', type: 'boolean', default: true, labelKey: 'field.spaceOriginal' },
      { key: 'extended', type: 'boolean', default: true, labelKey: 'field.spaceExtended' },
      { key: 'types', type: 'multienum', default: ['ALL'], labelKey: 'field.spaceTypes', options: SPACE_TYPE_OPTIONS },
    ],
    buildConfig: (v) => ({ original: v.original, extended: v.extended, types: [...v.types] }),
    runPipeline: (p, c) => p.space.insert(c),
    createPlugin: (c) => {
      const plugin = new Transform.Space.Insert()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'stress',
    labelKey: 'plugin.stress',
    defaultEnabled: true,
    fields: [{ key: 'checkTime', type: 'number', default: 3000, labelKey: 'field.checkTime', min: 0, step: 100 }],
    buildConfig: (v) => ({ checkTime: Number(v.checkTime) || 0 }),
    runPipeline: (p, c) => p.stress.mark(c),
    createPlugin: (c) => {
      const plugin = new Transform.Stress.Mark()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'languageInfer',
    labelKey: 'plugin.languageInfer',
    defaultEnabled: true,
    fields: [{ key: 'override', type: 'boolean', default: false, labelKey: 'field.override' }],
    buildConfig: (v) => ({ override: v.override }),
    runPipeline: (p, c) => p.language.infer(c),
    createPlugin: (c) => {
      const plugin = new Transform.Language.Infer()
      plugin.config.update(c)
      return plugin
    },
  },
  {
    key: 'languageCalc',
    labelKey: 'plugin.languageCalc',
    defaultEnabled: true,
    fields: [],
    buildConfig: () => undefined,
    runPipeline: (p) => p.language.calculatePercent(),
    createPlugin: () => new Transform.Language.CalculatePercent(),
  },
]
