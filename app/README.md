# music-lyric-kit

## Install

```shell
npm install music-lyric-kit
```

## Usage

```js
import { Parser, Lrc } from 'music-lyric-kit'

const parser = new Parser.Client()

const lrc = Lrc.Parser.Plugin()

// add plugin
client.plugin.add(lrc)

const input = {
  original: '[00:01.114]TEST',
  syllable: '',
  translate: '',
  roman: '',
}
// or
const input = '[00:01.114]TEST'

const format = client.infer({
  content: input,
})

if (format) {
  const result = client.parse(format, {
    content: input,
  })
  console.log(result)
}
```
