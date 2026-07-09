import type { Format, Engine } from '@root/core/constants'

import { Lyric } from 'music-lyric-kit'
import { PLUGIN_DEFS } from '@root/core/plugins'
import { STORAGE_KEYS, DEFAULT_LRC_ORIGINAL, DEFAULT_LRC_TRANSLATE, DEFAULT_LRC_ROMAN, DEFAULT_TTML } from '@root/core/constants'

import { ref, shallowRef, computed, Ref } from 'vue'
import { createParserPipeline } from 'music-lyric-kit'
import { buildClient } from '@root/core/parser'
import { usePluginConfig } from '@root/composables/usePluginConfig'

type MusicInfo = { name: string; singer: string[] } | undefined

type Content = string | { original: string; translate: string; roman: string }

const read = (key: string, fallback = '') => localStorage.getItem(key) ?? fallback
const write = (key: string, value: string) => localStorage.setItem(key, value)

/**
 * Measure the UTF-8 byte size of the raw parser input.
 */
const measureInput = (input: Content): number => {
  const encoder = new TextEncoder()
  if (typeof input === 'string') return encoder.encode(input).length
  return encoder.encode(input.original).length + encoder.encode(input.translate).length + encoder.encode(input.roman).length
}

export interface ParseResult {
  format: Ref<Format, Format>
  engine: Ref<Engine, Engine>
  songName: Ref<string, string>
  singers: Ref<string, string>
  original: Ref<string, string>
  translate: Ref<string, string>
  roman: Ref<string, string>
  ttml: Ref<string, string>
  result: Ref<Lyric.Runtime.Proto.Info | null, Lyric.Runtime.Proto.Info | null>
  resultType: Ref<string, string>
  resultVersion: Ref<string, string>
  inferredFormat: Ref<string, string>
  elapsed: Ref<number, number>
  inputSize: Ref<number, number>
  bufferSize: Ref<number, number>
  error: Ref<string, string>
  parsing: Ref<boolean, boolean>
  parse: () => void
}

export const useParser = (): ParseResult => {
  const { states: pluginStates } = usePluginConfig()

  const format = ref<Format>((read(STORAGE_KEYS.FORMAT) as Format) || 'lrc')
  const engine = ref<Engine>((read(STORAGE_KEYS.ENGINE) as Engine) || 'pipeline')

  const songName = ref(read(STORAGE_KEYS.SONG_NAME))
  const singers = ref(read(STORAGE_KEYS.SINGERS))

  const original = ref(read(STORAGE_KEYS.ORIGINAL, DEFAULT_LRC_ORIGINAL))
  const translate = ref(read(STORAGE_KEYS.TRANSLATE, DEFAULT_LRC_TRANSLATE))
  const roman = ref(read(STORAGE_KEYS.ROMAN, DEFAULT_LRC_ROMAN))
  const ttml = ref(read(STORAGE_KEYS.TTML, DEFAULT_TTML))

  const result = shallowRef<Lyric.Runtime.Proto.Info | null>(null)
  const resultType = ref('')
  const resultVersion = ref<string>('')
  const inferredFormat = ref('')
  const elapsed = ref(0)
  const inputSize = ref(0)
  const bufferSize = ref(0)
  const error = ref('')
  const parsing = ref(false)

  const musicInfo = computed<MusicInfo>(() => {
    const name = songName.value.trim()
    const singer = singers.value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    return name || singer.length ? { name, singer } : undefined
  })

  const persist = () => {
    write(STORAGE_KEYS.FORMAT, format.value)
    write(STORAGE_KEYS.ENGINE, engine.value)
    write(STORAGE_KEYS.SONG_NAME, songName.value)
    write(STORAGE_KEYS.SINGERS, singers.value)
    write(STORAGE_KEYS.ORIGINAL, original.value)
    write(STORAGE_KEYS.TRANSLATE, translate.value)
    write(STORAGE_KEYS.ROMAN, roman.value)
    write(STORAGE_KEYS.TTML, ttml.value)
  }

  const content = () => {
    if (format.value === 'lrc') {
      return { original: original.value, translate: translate.value, roman: roman.value }
    }
    return ttml.value
  }

  const parseWithPipeline = (input: any, info: MusicInfo) => {
    const pipeline = createParserPipeline({ content: input, musicInfo: info })

    pipeline.infer().parse()

    for (const def of PLUGIN_DEFS) {
      const state = pluginStates[def.key]
      if (!state?.enabled) {
        continue
      }
      def.runPipeline(pipeline, def.buildConfig(state.values))
    }

    const final = pipeline.final()
    return { format: final.format, info: final.result }
  }

  const parseWithClient = (input: any, info: MusicInfo) => {
    const client = buildClient(pluginStates)
    const detected = client.infer({ content: input })
    if (!detected) return { format: '', info: null }
    return { format: detected, info: client.parse(detected, { content: input, musicInfo: info }) }
  }

  const parse = () => {
    persist()

    parsing.value = true
    error.value = ''
    result.value = null
    inputSize.value = 0
    bufferSize.value = 0

    try {
      const input = content()
      inputSize.value = measureInput(input)

      const start = performance.now()
      const parsed = engine.value === 'client' ? parseWithClient(input, musicInfo.value) : parseWithPipeline(input, musicInfo.value)

      elapsed.value = performance.now() - start
      console.log('parse done. ', parsed.format, parsed.info)

      if (!parsed.format || !parsed.info) {
        error.value = 'result.inferFailed'
        return
      }

      const buffer = Lyric.Runtime.encodeInfo(parsed.info)
      bufferSize.value = buffer.length
      console.log('parse buffer length: ', buffer.length)
      console.log('parse buffer body: ', buffer)
      console.log('parse buffer hex: ', buffer.toHex())

      inferredFormat.value = parsed.format
      result.value = parsed.info
      resultType.value = Lyric.Runtime.Proto.InfoType[parsed.info.type] ?? String(parsed.info.type)
      resultVersion.value = parsed.info.version
    } catch (e: any) {
      error.value = e?.message || String(e)
    } finally {
      parsing.value = false
    }
  }

  return {
    format,
    engine,
    songName,
    singers,
    original,
    translate,
    roman,
    ttml,
    result,
    resultType,
    resultVersion,
    inferredFormat,
    elapsed,
    inputSize,
    bufferSize,
    error,
    parsing,
    parse,
  }
}
