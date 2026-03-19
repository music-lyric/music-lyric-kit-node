import { Parser, Plugins } from 'music-lyric-kit'

type Format = 'lrc' | 'ttml'

const DEFAULT_LRC_ORIGINAL = `
[ti: title]
[ar: singer]
[al: album]
[length: 11:45]
[00:00.114]This is Original
`

const DEFAULT_LRC_SYLLABLE = `
[ti: title]
[ar: singer]
[al: album]
[length: 11:45]
[00:00.114]<0,114>This <114,514>is <514,999>Syllable
`

const DEFAULT_LRC_TRANSLATE = `
[00:00.114]This is Translate
`

const DEFAULT_LRC_ROMAN = `
[00:00.114]This is Roman
`

const DEFAULT_TTML = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml" xmlns:amll="http://www.example.com/ns/amll">
  <body>
    <div>
      <p begin="00:00.000" end="00:05.000">This is lyric line</p>
    </div>
  </body>
</tt>
`

const STORAGE_KEYS = {
  FORMAT: 'lyric_parser_format',
  ORIGINAL: 'lyric_parser_original',
  SYLLABLE: 'lyric_parser_syllable',
  TRANSLATE: 'lyric_parser_translate',
  ROMAN: 'lyric_parser_roman',
  TTML: 'lyric_parser_ttml',
  SONG_NAME: 'lyric_parser_song_name',
  SINGERS: 'lyric_parser_singers',
}

const main = () => {
  const parser = new Parser()

  const lrc = new Plugins.Lrc.Parser()
  parser.plugin.add(lrc)

  const ttml = new Plugins.Ttml.AmllParser()
  parser.plugin.add(ttml)

  const interlude = new Plugins.Interlude.Plugin()
  parser.plugin.add(interlude)

  const agent = new Plugins.Agent.ExtractAgentPlugin()
  parser.plugin.add(agent)

  const clean = new Plugins.Pure.CleanPlugin()
  parser.plugin.add(clean)

  const extract = new Plugins.Pure.ExtractCreatorPlugin()
  parser.plugin.add(extract)

  const space = new Plugins.Space.InsertPlugin()
  parser.plugin.add(space)

  const inputSongName = document.getElementById('input-song-name') as HTMLInputElement
  const inputSingers = document.getElementById('input-singers') as HTMLInputElement
  const btnParse = document.getElementById('btn-parse') as HTMLButtonElement
  const outputResult = document.getElementById('output-result') as HTMLPreElement

  const gridLrc = document.getElementById('input-grid-lrc') as HTMLDivElement
  const gridTtml = document.getElementById('input-grid-ttml') as HTMLDivElement
  const formatBtns = document.querySelectorAll<HTMLButtonElement>('.format-btn')

  // LRC
  const inputOriginal = document.getElementById('input-original') as HTMLTextAreaElement
  const inputSyllable = document.getElementById('input-syllable') as HTMLTextAreaElement
  const inputTranslate = document.getElementById('input-translate') as HTMLTextAreaElement
  const inputRoman = document.getElementById('input-roman') as HTMLTextAreaElement

  // TTML
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
      outputResult.textContent = 'Could not infer lyric format from "Original Lyrics".'
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
    outputResult.textContent = 'Parsing...'

    try {
      const result = currentFormat === 'lrc' ? parseLrc() : parseTtml()

      if (result) {
        const content = JSON.stringify(result, null, 2)
        console.log(`Parser result: `, JSON.parse(content))
        outputResult.textContent = content
      } else {
        console.log('Parser result is null')
        outputResult.textContent = 'Parser returned null result.'
      }
    } catch (error: any) {
      console.error(error)
      outputResult.textContent = `Error during parsing:\n${error.message || error}`
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
