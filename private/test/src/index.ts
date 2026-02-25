import { Parser, Lrc } from 'music-lyric-kit'

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
}

const main = () => {
  const parser = new Parser.Client()
  const lrc = Lrc.Parser.Plugin()
  parser.plugin.add(lrc)

  const inputOriginal = document.getElementById('input-original') as HTMLTextAreaElement
  const inputSyllable = document.getElementById('input-syllable') as HTMLTextAreaElement
  const inputTranslate = document.getElementById('input-translate') as HTMLTextAreaElement
  const inputRoman = document.getElementById('input-roman') as HTMLTextAreaElement
  const btnParse = document.getElementById('btn-parse') as HTMLButtonElement
  const outputResult = document.getElementById('output-result') as HTMLPreElement

  const handleParse = () => {
    const original = inputOriginal.value
    const syllable = inputSyllable.value
    const translate = inputTranslate.value
    const roman = inputRoman.value

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
        const start = performance.now()
        const result = parser.parse(format, {
          content: {
            original,
            syllable,
            translate,
            roman,
          },
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

  inputOriginal.value = localStorage.getItem(STORAGE_KEYS.ORIGINAL) ?? DEFAULT_ORIGINAL
  inputSyllable.value = localStorage.getItem(STORAGE_KEYS.SYLLABLE) ?? DEFAULT_SYLLABLE
  inputTranslate.value = localStorage.getItem(STORAGE_KEYS.TRANSLATE) ?? DEFAULT_TRANSLATE
  inputRoman.value = localStorage.getItem(STORAGE_KEYS.ROMAN) ?? DEFAULT_ROMAN

  btnParse.addEventListener('click', handleParse)

  handleParse()
}

document.addEventListener('DOMContentLoaded', main)
