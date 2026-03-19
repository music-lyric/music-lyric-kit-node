## @music-lyric-kit/plugin-format-ttml

TTML format plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-format-ttml
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { AmllParser } from '@music-lyric-kit/plugin-format-ttml'

const parser = new Parser.Client()
parser.plugin.add(new AmllParser())
```
