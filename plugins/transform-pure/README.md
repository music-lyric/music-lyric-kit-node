## @music-lyric-kit/plugin-transform-pure

Pure lyric detection plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-transform-pure
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { Clean, ExtractCreator } from '@music-lyric-kit/plugin-transform-pure'

const parser = new Parser.Client()
parser.plugin.add(new Clean())
parser.plugin.add(new ExtractCreator())
```
