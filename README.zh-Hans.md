<p align="center">
  <img
    src="https://socialify.git.ci/music-lyric/music-lyric-kit-node/image?custom_description=Music+Lyric+Kit&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto"
  />
</p>

<p align="center">一个歌词工具库，支持歌词解析，生成，后处理</p>

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
  <a href="./README.md">English</a> | 简体中文 | <a href="./README.zh-Hant.md">繁體中文</a>
</p>

> [!WARNING]
>
> 本项目目前仍在开发中，部分接口尚未稳定。

## 特性

- **格式推断** — 支持通过输入内容自动推断格式
- **插件系统** — 内置多种插件，可以按需加载

## 安装

```shell
npm install music-lyric-kit
```

## 使用

### 解析歌词

```js
import { Parser, Plugins } from 'music-lyric-kit'

const parser = new Parser.Client()

// 格式插件
const lrc = new Plugins.Formats.Lrc.Parser()
const ttml = new Plugins.Formats.Ttml.AmllParser()

parser.plugin.add(lrc)
parser.plugin.add(ttml)

// 转换插件
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

// 推断格式
const format = parser.infer({ content: input })

if (format) {
  const result = parser.parse(format, { content: input })
  console.log(result)
}
```

### 生成歌词

```js
import { Generator, Plugins } from 'music-lyric-kit'

const generator = new Generator.Client()

// 格式插件
generator.plugin.add(new Plugins.Formats.Lrc.Generator())

const output = generator.generate(format, { content: result })
console.log(output)
```

## 包一览

### 主要

| 包名                                       | 说明     |
| ------------------------------------------ | -------- |
| [music-lyric-kit](./app)                   | 主入口   |
| [@music-lyric-kit/core](./packages/core)   | 插件系统 |
| [@music-lyric-kit/lyric](./packages/lyric) | 数据结构 |
| [@music-lyric-kit/utils](./packages/utils) | 工具库   |

### 格式插件

| 插件                                                         | 说明 |
| ------------------------------------------------------------ | ---- |
| [@music-lyric-kit/plugin-format-lrc](./plugins/format-lrc)   | LRC  |
| [@music-lyric-kit/plugin-format-ttml](./plugins/format-ttml) | TTML |

### 转换插件

| 插件                                                                           | 说明     |
| ------------------------------------------------------------------------------ | -------- |
| [@music-lyric-kit/plugin-transform-space](./plugins/transform-space)           | 规范空格 |
| [@music-lyric-kit/plugin-transform-pure](./plugins/transform-pure)             | 净化歌词 |
| [@music-lyric-kit/plugin-transform-interlude](./plugins/transform-interlude)   | 插入间奏 |
| [@music-lyric-kit/plugin-transform-background](./plugins/transform-background) | 背景人声 |
| [@music-lyric-kit/plugin-transform-agent](./plugins/transform-agent)           | 多人合唱 |
| [@music-lyric-kit/plugin-transform-stress](./plugins/transform-stress)         | 重音标记 |

## 贡献者

[![Contributors](https://contrib.rocks/image?repo=music-lyric/music-lyric-kit-node)](https://github.com/music-lyric/music-lyric-kit-node/graphs/contributors)

## 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2026 - now, Folltoshe
