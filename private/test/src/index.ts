import { createParser } from './parser'
import { renderResult } from './render'
import { esc } from './utils'
import { STORAGE_KEYS, DEFAULT_LRC_ORIGINAL, DEFAULT_LRC_SYLLABLE, DEFAULT_LRC_TRANSLATE, DEFAULT_LRC_ROMAN, DEFAULT_TTML } from './constants'

import type { Format } from './constants'

const main = () => {
  const parser = createParser()

  const inputSongName = document.getElementById('input-song-name') as HTMLInputElement
  const inputSingers = document.getElementById('input-singers') as HTMLInputElement
  const btnParse = document.getElementById('btn-parse') as HTMLButtonElement
  const outputResult = document.getElementById('output-result') as HTMLDivElement

  const gridLrc = document.getElementById('input-grid-lrc') as HTMLDivElement
  const gridTtml = document.getElementById('input-grid-ttml') as HTMLDivElement
  const formatBtns = document.querySelectorAll<HTMLButtonElement>('.format-btn')

  const inputOriginal = document.getElementById('input-original') as HTMLTextAreaElement
  const inputSyllable = document.getElementById('input-syllable') as HTMLTextAreaElement
  const inputTranslate = document.getElementById('input-translate') as HTMLTextAreaElement
  const inputRoman = document.getElementById('input-roman') as HTMLTextAreaElement
  const inputTtml = document.getElementById('input-ttml') as HTMLTextAreaElement

  let currentFormat: Format = (localStorage.getItem(STORAGE_KEYS.FORMAT) as Format) || 'lrc'

  const switchFormat = (format: Format) => {
    currentFormat = format
    localStorage.setItem(STORAGE_KEYS.FORMAT, format)

    formatBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.format === format)
    })

    gridLrc.style.display = format === 'lrc' ? '' : 'none'
    gridTtml.style.display = format === 'ttml' ? '' : 'none'
  }

  formatBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchFormat(btn.dataset.format as Format)
    })
  })

  const parseMusicInfo = () => {
    const songName = inputSongName.value.trim()
    const singersText = inputSingers.value.trim()
    const singers = singersText
      ? singersText
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s)
      : []

    localStorage.setItem(STORAGE_KEYS.SONG_NAME, songName)
    localStorage.setItem(STORAGE_KEYS.SINGERS, singersText)

    return songName || singers.length > 0 ? { name: songName, singer: singers } : undefined
  }

  const parse = (content: any) => {
    const format = parser.infer({ content })
    if (!format) {
      outputResult.innerHTML = '<div class="result-empty">Could not infer lyric format.</div>'
      return
    }

    console.log(`Inferred format: ${format}`)

    const start = performance.now()
    const result = parser.parse(format, {
      content,
      musicInfo: parseMusicInfo(),
    })
    const end = performance.now()

    console.log(`Parser use time: ${end - start}ms`)
    return result
  }

  const parseLrc = () => {
    const original = inputOriginal.value
    const syllable = inputSyllable.value
    const translate = inputTranslate.value
    const roman = inputRoman.value

    localStorage.setItem(STORAGE_KEYS.ORIGINAL, original)
    localStorage.setItem(STORAGE_KEYS.SYLLABLE, syllable)
    localStorage.setItem(STORAGE_KEYS.TRANSLATE, translate)
    localStorage.setItem(STORAGE_KEYS.ROMAN, roman)

    return parse({ original, syllable, translate, roman })
  }

  const parseTtml = () => {
    const content = inputTtml.value

    localStorage.setItem(STORAGE_KEYS.TTML, content)

    return parse(content)
  }

  const handleParse = () => {
    const badge = document.getElementById('result-type-badge')!
    badge.style.display = 'none'
    outputResult.innerHTML = '<div class="result-empty">Parsing...</div>'

    try {
      const result = currentFormat === 'lrc' ? parseLrc() : parseTtml()

      if (result) {
        console.log(`Parser result: `, result.toJSON())
        outputResult.innerHTML = renderResult(result)
      } else {
        console.log('Parser result is null')
        outputResult.innerHTML = '<div class="result-empty">Parser returned null result.</div>'
      }
    } catch (error: any) {
      console.error(error)
      outputResult.innerHTML = `<div class="result-empty" style="color:#ff3b30">Error: ${esc(error.message || String(error))}</div>`
    }
  }

  // restore
  inputSongName.value = localStorage.getItem(STORAGE_KEYS.SONG_NAME) ?? ''
  inputSingers.value = localStorage.getItem(STORAGE_KEYS.SINGERS) ?? ''
  inputOriginal.value = localStorage.getItem(STORAGE_KEYS.ORIGINAL) ?? DEFAULT_LRC_ORIGINAL
  inputSyllable.value = localStorage.getItem(STORAGE_KEYS.SYLLABLE) ?? DEFAULT_LRC_SYLLABLE
  inputTranslate.value = localStorage.getItem(STORAGE_KEYS.TRANSLATE) ?? DEFAULT_LRC_TRANSLATE
  inputRoman.value = localStorage.getItem(STORAGE_KEYS.ROMAN) ?? DEFAULT_LRC_ROMAN
  inputTtml.value = localStorage.getItem(STORAGE_KEYS.TTML) ?? DEFAULT_TTML

  switchFormat(currentFormat)

  btnParse.addEventListener('click', handleParse)
  handleParse()
}

document.addEventListener('DOMContentLoaded', main)
