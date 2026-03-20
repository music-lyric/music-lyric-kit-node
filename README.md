<p align="center">
  <img
    src="https://socialify.git.ci/music-lyric/music-lyric-kit-node/image?custom_description=Music+Lyric+Kit&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto"
  />
</p>

<p align="center">Lyric toolkit for parsing, generating and processing</p>

<p align="center">
  <a href="https://www.npmjs.com/package/music-lyric-kit">
    <img src="https://img.shields.io/npm/v/music-lyric-kit?color=a1b858&label=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/music-lyric-kit">
    <img src="https://img.shields.io/npm/dm/music-lyric-kit?color=50a36f&label=downloads" alt="npm downloads" />
  </a>
  <a href="https://github.com/music-lyric/music-lyric-kit-node/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/music-lyric/music-lyric-kit-node" alt="license" />
  </a>
</p>

<p align="center">
  English | <a href="./README.zh-CN.md">简体中文</a>
</p>

> [!WARNING]
>
> This project is currently under development, and some interfaces are not yet stable.

## Features

- **Format inference** — Auto-detect lyric format from input content
- **Plugin system** — Built-in plugins, load on demand

## Install

```shell
npm install music-lyric-kit
```

## Usage

### Parse

```js
import { Parser, Plugins } from 'music-lyric-kit'

const parser = new Parser.Client()

// Format plugin
const lrc = new Plugins.Formats.Lrc.Parser()
const ttml = new Plugins.Formats.Ttml.AmllParser()

parser.plugin.add(lrc)
parser.plugin.add(ttml)

// Transform plugins
const space = new Plugins.Transforms.Space.InsertPlugin()
const stress = new Plugins.Transforms.Stress.MarkPlugin()

parser.plugin.add(space)
parser.plugin.add(stress)

const input = {
  original: '[00:01.114]Hello world',
  syllable: '',
  translate: '',
  roman: '',
}

// Infer format
const format = parser.infer({ content: input })

if (format) {
  const result = parser.parse(format, { content: input })
  console.log(result)
}
```

### Generate

```js
import { Generator, Plugins } from 'music-lyric-kit'

const generator = new Generator.Client()

// Format plugin
generator.plugin.add(new Plugins.Formats.Lrc.Generator())

const output = generator.generate(format, { content: result })
console.log(output)
```

## Packages

### Core

| Package                                    | Description     |
| ------------------------------------------ | --------------- |
| [music-lyric-kit](./app)                   | Main entry      |
| [@music-lyric-kit/core](./packages/core)   | Plugin system   |
| [@music-lyric-kit/lyric](./packages/lyric) | Data structures |
| [@music-lyric-kit/utils](./packages/utils) | Utilities       |

### Format Plugins

| Plugin                                                       | Description |
| ------------------------------------------------------------ | ----------- |
| [@music-lyric-kit/plugin-format-lrc](./plugins/format-lrc)   | LRC         |
| [@music-lyric-kit/plugin-format-ttml](./plugins/format-ttml) | TTML        |

### Transform Plugins

| Plugin                                                                         | Description          |
| ------------------------------------------------------------------------------ | -------------------- |
| [@music-lyric-kit/plugin-transform-space](./plugins/transform-space)           | Space normalization  |
| [@music-lyric-kit/plugin-transform-pure](./plugins/transform-pure)             | Pure lyric detection |
| [@music-lyric-kit/plugin-transform-interlude](./plugins/transform-interlude)   | Interlude handling   |
| [@music-lyric-kit/plugin-transform-background](./plugins/transform-background) | Background vocals    |
| [@music-lyric-kit/plugin-transform-agent](./plugins/transform-agent)           | Multi-voice support  |
| [@music-lyric-kit/plugin-transform-stress](./plugins/transform-stress)         | Stress marks         |

## Contributors

[![Contributors](https://contrib.rocks/image?repo=music-lyric/music-lyric-kit-node)](https://github.com/music-lyric/music-lyric-kit-node/graphs/contributors)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2026 - now, Folltoshe
