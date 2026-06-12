## @music-lyric-kit/plugin-transform-background

Background vocals plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-transform-background
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { Extract } from '@music-lyric-kit/plugin-transform-background'

const parser = new Parser.Client()
parser.plugin.add(new Extract())
```
