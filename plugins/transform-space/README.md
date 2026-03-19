## @music-lyric-kit/plugin-transform-space

Space normalization plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-transform-space
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { InsertPlugin } from '@music-lyric-kit/plugin-transform-space'

const parser = new Parser.Client()
parser.plugin.add(new InsertPlugin())
```
