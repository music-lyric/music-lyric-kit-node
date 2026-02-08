<div align="center">
  <img src="https://socialify.git.ci/music-lyric/music-lyric-kit-node/image?custom_description=Music+Lyric+Kits&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto" />
</div>

> [!WARNING]
>
> This project is currently under development, and some interfaces are not yet stable. Please use them with caution!

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
parser.plugin.add(lrc)

const input = {
  original: '[00:01.114]TEST',
  syllable: '',
  translate: '',
  roman: '',
}
// or
const input = '[00:01.114]TEST'

const format = parser.infer({
  content: input,
})

if (format) {
  const result = parser.parse(format, {
    content: input,
  })
  console.log(result)
}
```

## Contributor

[![Contributor](https://contrib.rocks/image?repo=music-lyric/music-lyric-kit-node)](https://github.com/music-lyric/music-lyric-kit-node/graphs/contributors)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2026 - now, Folltoshe
