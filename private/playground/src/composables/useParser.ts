import type { Lyric } from 'music-lyric-kit'
import type { Format, Engine } from '@root/core/constants'

import { ref, computed } from 'vue'
import { createParserPipeline } from 'music-lyric-kit'

import { createClient } from '@root/core/parser'
import {
  STORAGE_KEYS,
  DEFAULT_LRC_ORIGINAL,
  DEFAULT_LRC_TRANSLATE,
  DEFAULT_LRC_ROMAN,
  DEFAULT_TTML,
} from '@root/core/constants'

type MusicInfo = { name: string; singer: string[] } | undefined

const read = (key: string, fallback = '') => localStorage.getItem(key) ?? fallback
const write = (key: string, value: string) => localStorage.setItem(key, value)

const client = createClient()

export const useParser = () => {
  const format = ref<Format>((read(STORAGE_KEYS.FORMAT) as Format) || 'lrc')
  const engine = ref<Engine>((read(STORAGE_KEYS.ENGINE) as Engine) || 'pipeline')

  const songName = ref(read(STORAGE_KEYS.SONG_NAME))
  const singers = ref(read(STORAGE_KEYS.SINGERS))

  const original = ref(read(STORAGE_KEYS.ORIGINAL, DEFAULT_LRC_ORIGINAL))
  const translate = ref(read(STORAGE_KEYS.TRANSLATE, DEFAULT_LRC_TRANSLATE))
  const roman = ref(read(STORAGE_KEYS.ROMAN, DEFAULT_LRC_ROMAN))
  const ttml = ref(read(STORAGE_KEYS.TTML, DEFAULT_TTML))

  const result = ref<Lyric.Info | null>(null)
  const resultType = ref('')
  const resultVersion = ref<string | number>('')
  const inferredFormat = ref('')
  const elapsed = ref(0)
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

    pipeline.infer()
    pipeline.parse()
    pipeline.pureClean()
    pipeline.pureExtract()
    pipeline.agentExtract()
    pipeline.backgroundExtract()
    pipeline.backgroundClean()
    pipeline.interludeInsert()
    pipeline.spaceInsert()
    pipeline.stressMark()

    const final = pipeline.final()
    return { format: final.format, info: final.result }
  }

  const parseWithClient = (input: any, info: MusicInfo) => {
    const detected = client.infer({ content: input })
    if (!detected) return { format: '', info: null }
    return { format: detected, info: client.parse(detected, { content: input, musicInfo: info }) }
  }

  const parse = () => {
    persist()

    parsing.value = true
    error.value = ''
    result.value = null

    try {
      const input = content()
      const start = performance.now()
      const parsed = engine.value === 'client' ? parseWithClient(input, musicInfo.value) : parseWithPipeline(input, musicInfo.value)
      elapsed.value = performance.now() - start

      if (!parsed.format || !parsed.info) {
        error.value = 'result.inferFailed'
        return
      }

      inferredFormat.value = parsed.format
      result.value = parsed.info
      resultType.value = String(parsed.info.type)
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
    error,
    parsing,
    parse,
  }
}
