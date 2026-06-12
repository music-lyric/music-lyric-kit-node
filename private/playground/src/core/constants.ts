export type Format = 'lrc' | 'ttml'

export type Engine = 'pipeline' | 'client'

export const AGENT_COLORS = ['#dc6464', '#e09f3e', '#5b8c5a', '#4f86c6', '#9b6bcc', '#3fb6ad']

export const DEFAULT_LRC_ORIGINAL = `
[ti: title]
[ar: singer]
[al: album]
[length: 11:45]
[00:00.114]This is Original
`

export const DEFAULT_LRC_TRANSLATE = `
[00:00.114]This is Translate
`

export const DEFAULT_LRC_ROMAN = `
[00:00.114]This is Roman
`

export const DEFAULT_TTML = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml" xmlns:amll="http://www.example.com/ns/amll">
  <body>
    <div>
      <p begin="00:00.000" end="00:05.000">This is lyric line</p>
    </div>
  </body>
</tt>
`

export const STORAGE_KEYS = {
  FORMAT: 'lyric_parser_format',
  ENGINE: 'lyric_parser_engine',
  ORIGINAL: 'lyric_parser_original',
  TRANSLATE: 'lyric_parser_translate',
  ROMAN: 'lyric_parser_roman',
  TTML: 'lyric_parser_ttml',
  SONG_NAME: 'lyric_parser_song_name',
  SINGERS: 'lyric_parser_singers',
} as const
