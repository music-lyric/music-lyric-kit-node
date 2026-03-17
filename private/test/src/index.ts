import { Parser, Plugins } from 'music-lyric-kit'

const DEFAULT_ORIGINAL = `
[ti: title]
[ar: singer]
[al: album]
[length: 11:45]
[00:00.114]This is Original
`

const DEFAULT_SYLLABLE = `
[ti: title]
[ar: singer]
[al: album]
[length: 11:45]
[00:00.114]<0,114>This <114,514>is <514,999>Syllable
`

const DEFAULT_TRANSLATE = `
[00:00.114]This is Translate
`

const DEFAULT_ROMAN = `
[00:00.114]This is Roman
`

const STORAGE_KEYS = {
  ORIGINAL: 'lyric_parser_original',
  SYLLABLE: 'lyric_parser_syllable',
  TRANSLATE: 'lyric_parser_translate',
  ROMAN: 'lyric_parser_roman',
  SONG_NAME: 'lyric_parser_song_name',
  SINGERS: 'lyric_parser_singers',
}

const main = () => {
  const parser = new Parser()

  const lrc = new Plugins.Lrc.Parser()
  parser.plugin.add(lrc)

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
  const inputOriginal = document.getElementById('input-original') as HTMLTextAreaElement
  const inputSyllable = document.getElementById('input-syllable') as HTMLTextAreaElement
  const inputTranslate = document.getElementById('input-translate') as HTMLTextAreaElement
  const inputRoman = document.getElementById('input-roman') as HTMLTextAreaElement
  const btnParse = document.getElementById('btn-parse') as HTMLButtonElement
  const outputResult = document.getElementById('output-result') as HTMLPreElement

  const handleParse = () => {
    const songName = inputSongName.value.trim()
    const singersText = inputSingers.value.trim()
    const singers = singersText
      ? singersText
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s)
      : []
    const original = inputOriginal.value
    const syllable = inputSyllable.value
    const translate = inputTranslate.value
    const roman = inputRoman.value

    localStorage.setItem(STORAGE_KEYS.SONG_NAME, songName)
    localStorage.setItem(STORAGE_KEYS.SINGERS, singersText)
    localStorage.setItem(STORAGE_KEYS.ORIGINAL, original)
    localStorage.setItem(STORAGE_KEYS.SYLLABLE, syllable)
    localStorage.setItem(STORAGE_KEYS.TRANSLATE, translate)
    localStorage.setItem(STORAGE_KEYS.ROMAN, roman)

    outputResult.textContent = 'Parsing...'

    try {
      const format = parser.infer({
        content: original,
      })

      if (format) {
        console.log(`Inferred format: ${format}`)
        console.log(`Song name: ${songName}`)
        console.log(`Singers: ${singers.join(', ')}`)

        const start = performance.now()
        const result = parser.parse(format, {
          content: {
            original,
            syllable,
            translate,
            roman,
          },
          musicInfo:
            songName || singers.length > 0
              ? {
                  name: songName,
                  singer: singers,
                }
              : void 0,
        })
        const end = performance.now()

        if (result) {
          const content = JSON.stringify(result, null, 2)
          console.log(`Parser result: `, JSON.parse(content))
          outputResult.textContent = content
        } else {
          console.log('Parser result is null')
          outputResult.textContent = 'Parser returned null result.'
        }

        console.log(`Parser use time: ${end - start}ms`)
      } else {
        outputResult.textContent = 'Could not infer lyric format from "Original Lyrics".'
      }
    } catch (error: any) {
      console.error(error)
      outputResult.textContent = `Error during parsing:\n${error.message || error}`
    }
  }

  inputSongName.value = localStorage.getItem(STORAGE_KEYS.SONG_NAME) ?? ''
  inputSingers.value = localStorage.getItem(STORAGE_KEYS.SINGERS) ?? ''
  inputOriginal.value = localStorage.getItem(STORAGE_KEYS.ORIGINAL) ?? DEFAULT_ORIGINAL
  inputSyllable.value = localStorage.getItem(STORAGE_KEYS.SYLLABLE) ?? DEFAULT_SYLLABLE
  inputTranslate.value = localStorage.getItem(STORAGE_KEYS.TRANSLATE) ?? DEFAULT_TRANSLATE
  inputRoman.value = localStorage.getItem(STORAGE_KEYS.ROMAN) ?? DEFAULT_ROMAN

  btnParse.addEventListener('click', handleParse)

  handleParse()
}

document.addEventListener('DOMContentLoaded', main)
