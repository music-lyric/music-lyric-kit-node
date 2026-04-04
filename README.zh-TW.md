<p align="center">
  <img
    src="https://socialify.git.ci/music-lyric/music-lyric-kit-node/image?custom_description=Music+Lyric+Kit&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto"
  />
</p>

<p align="center">一個歌詞工具庫，支援解析、生成與後處理</p>

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
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a> | 繁體中文
</p>

> [!WARNING]
>
> 本專案目前仍在開發中，部分介面（API）尚未穩定。

## 特性

- **格式推斷** — 支援透過輸入內容自動推斷格式
- **外掛系統** — 內建多種外掛，可按需載入
- **Pipeline** — 鏈式呼叫 API，完全控制處理順序

## 安裝

```shell
npm install music-lyric-kit
```

## 使用方式

### Pipeline

Pipeline 提供鏈式呼叫介面，讓你完全控制歌詞的處理順序。

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

每個轉換方法都接受可選的 options 參數來自訂行為，不傳則使用外掛預設配置。

```js
const { result } = createParserPipeline(input)
  .infer()
  .parse()
  .interludeInsert({ checkTime: { first: 3000, normal: 8000 } })
  .spaceInsert({ original: true, extended: false })
  .final()
```

### Plugin

如需更細粒度的控制，可以直接使用 `Parser` 類別搭配外掛。

```js
import { Parser, Plugins } from 'music-lyric-kit'

const parser = new Parser()

// 格式外掛
parser.plugin.add(new Plugins.Formats.Lrc.Parser())
parser.plugin.add(new Plugins.Formats.Ttml.AmllParser())

// 轉換外掛
parser.plugin.add(new Plugins.Transforms.Space.InsertPlugin())
parser.plugin.add(new Plugins.Transforms.Stress.MarkPlugin())

const input = {
  original: '[00:01.114]Hello world',
}

// 推斷格式
const format = parser.infer({ content: input })

if (format) {
  const result = parser.parse(format, { content: input })
  console.log(result)
}
```

### 產生歌詞

```js
import { Generator, Plugins } from 'music-lyric-kit'

const generator = new Generator()

generator.plugin.add(new Plugins.Formats.Lrc.Generator())

const output = generator.generate('lrc', { content: result })
console.log(output)
```

## 套件一覽

### 主要套件

| 套件名稱                                   | 說明     |
| ------------------------------------------ | -------- |
| [music-lyric-kit](./packages/main)         | 主入口   |
| [@music-lyric-kit/core](./packages/core)   | 外掛系統 |
| [@music-lyric-kit/lyric](./packages/lyric) | 資料結構 |
| [@music-lyric-kit/utils](./packages/utils) | 工具庫   |

### 格式外掛

| 外掛                                                         | 說明 |
| ------------------------------------------------------------ | ---- |
| [@music-lyric-kit/plugin-format-lrc](./plugins/format-lrc)   | LRC  |
| [@music-lyric-kit/plugin-format-ttml](./plugins/format-ttml) | TTML |

### 轉換外掛

| 外掛                                                                           | 說明     |
| ------------------------------------------------------------------------------ | -------- |
| [@music-lyric-kit/plugin-transform-space](./plugins/transform-space)           | 規範空格 |
| [@music-lyric-kit/plugin-transform-pure](./plugins/transform-pure)             | 淨化歌詞 |
| [@music-lyric-kit/plugin-transform-interlude](./plugins/transform-interlude)   | 插入間奏 |
| [@music-lyric-kit/plugin-transform-background](./plugins/transform-background) | 背景人聲 |
| [@music-lyric-kit/plugin-transform-agent](./plugins/transform-agent)           | 多人合唱 |
| [@music-lyric-kit/plugin-transform-stress](./plugins/transform-stress)         | 重音標記 |

## 貢獻者

[![Contributors](https://contrib.rocks/image?repo=music-lyric/music-lyric-kit-node)](https://github.com/music-lyric/music-lyric-kit-node/graphs/contributors)

## 授權條款

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2026 - now, Folltoshe
