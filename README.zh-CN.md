<p align="center">
  <img
    src="https://socialify.git.ci/music-lyric/music-lyric-kit-node/image?custom_description=Music+Lyric+Kit&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto"
  />
</p>

<p align="center">一个歌词工具库，支持解析、生成与后处理</p>

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
  <a href="./README.md">English</a> | 简体中文 | <a href="./README.zh-TW.md">繁體中文</a>
</p>

> [!WARNING]
>
> 本项目目前仍在开发中，部分接口尚未稳定。

## 特性

- **格式推断** — 支持通过输入内容自动推断格式
- **插件系统** — 内置多种插件，可按需加载
- **链式调用** — 链式调用，完全控制处理顺序

## 安装

```shell
npm install music-lyric-kit
```

## 使用

### Pipeline

Pipeline 提供链式调用接口，让你完全控制歌词的处理顺序。

```js
import { createParserPipeline } from 'music-lyric-kit'

const input = {
  content: '[00:01.114]Hello world',
}

const { format, result } = createParserPipeline(input)
  .infer()
  .parse()
  .backgroundExtract()
  .agentExtract()
  .pureExtract()
  .pureClean()
  .backgroundClean()
  .interludeInsert()
  .spaceInsert()
  .stressMark()
  .final()

console.log(format, result)
```

每个转换方法都接受可选的 options 参数来自定义行为，不传则使用插件默认配置。

```js
const { result } = createParserPipeline(input)
  .infer()
  .parse()
  .interludeInsert({ checkTime: { first: 3000, normal: 8000 } })
  .spaceInsert({ original: true, extended: false })
  .final()
```

### Plugin

如需更细粒度的控制，可以直接使用 `Parser` 类搭配插件。

```js
import { Parser, Format, Transform } from 'music-lyric-kit'

const parser = new Parser()

// 格式插件
parser.plugin.add(new Format.Lrc.Parser())
parser.plugin.add(new Format.Ttml.AmllParser())

// 转换插件
parser.plugin.add(new Transform.Space.Insert())
parser.plugin.add(new Transform.Stress.Mark())

const input = {
  original: '[00:01.114]Hello world',
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
import { Generator, Format } from 'music-lyric-kit'

const generator = new Generator()

generator.plugin.add(new Format.Lrc.Generator())

const output = generator.generate('lrc', { content: result })
console.log(output)
```

## 包一览

### 主要

| 包名                                       | 说明     |
| ------------------------------------------ | -------- |
| [music-lyric-kit](./packages/main)         | 主入口   |
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
