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
  English | <a href="./README.zh-CN.md">简体中文</a> | <a href="./README.zh-TW.md">繁體中文</a>
</p>

> [!WARNING]
>
> This project is currently under development, and some interfaces are not yet stable.

## Features

- **Format inference** — Auto-detect lyric format from input content
- **Plugin system** — Built-in plugins, load on demand
- **Pipeline API** — Fluent chainable API for full control over processing order

## Install

```shell
npm install music-lyric-kit
```

## Usage

### Pipeline

The pipeline provides a fluent, chainable interface that gives you full control over the processing order.

```js
import { createParserPipeline } from 'music-lyric-kit'

const input = {
  content: '[00:01.114]Hello world',
}

const { format, result } = createParserPipeline(input)
  .infer()
  .parse()
  .background.extract()
  .agent.extract()
  .pure.extractCreator()
  .pure.clean()
  .background.clean()
  .interlude.insert()
  .space.insert()
  .stress.mark()
  .final()

console.log(format, result)
```

Each transform method accepts an optional options parameter to customize behavior. If omitted, plugin defaults are used.

```js
const { result } = createParserPipeline(input)
  .infer()
  .parse()
  .interlude.insert({ checkTime: { first: 3000, normal: 8000 } })
  .space.insert({ original: true, extended: false })
  .final()
```

### Plugin

For more granular control, you can use the `Parser` class with plugins directly.

```js
import { Parser, Format, Transform } from 'music-lyric-kit'

const parser = new Parser()

// Format plugins
parser.plugin.add(new Format.Lrc.Parser())
parser.plugin.add(new Format.Ttml.AmllParser())

// Transform plugins
parser.plugin.add(new Transform.Space.Insert())
parser.plugin.add(new Transform.Stress.Mark())

const input = {
  original: '[00:01.114]Hello world',
}

// Infer format
const format = parser.infer({ content: input })

if (format) {
  const result = parser.parse(format, { content: input })
  console.log(result)
}
```

### Generator

```js
import { Generator, Format } from 'music-lyric-kit'

const generator = new Generator()

generator.plugin.add(new Format.Lrc.Generator())

const output = generator.generate('lrc', { content: result })
console.log(output)
```

## Packages

### Core

| Package                                    | Description     |
| ------------------------------------------ | --------------- |
| [music-lyric-kit](./packages/main)         | Main entry      |
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
