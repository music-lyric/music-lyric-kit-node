## @music-lyric-kit/plugin-transform-interlude

Interlude handling plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-transform-interlude
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { Insert } from '@music-lyric-kit/plugin-transform-interlude'

const parser = new Parser.Client()
parser.plugin.add(new Insert())
```
