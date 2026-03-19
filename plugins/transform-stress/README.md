## @music-lyric-kit/plugin-transform-stress

Stress marks plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-transform-stress
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { MarkPlugin } from '@music-lyric-kit/plugin-transform-stress'

const parser = new Parser.Client()
parser.plugin.add(new MarkPlugin())
```
