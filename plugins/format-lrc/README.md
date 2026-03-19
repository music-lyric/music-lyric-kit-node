## @music-lyric-kit/plugin-format-lrc

LRC format plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-format-lrc
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { Parser as LrcParser } from '@music-lyric-kit/plugin-format-lrc'

const parser = new Parser.Client()
parser.plugin.add(new LrcParser())
```

```js
import { Generator } from '@music-lyric-kit/core'
import { Generator as LrcGenerator } from '@music-lyric-kit/plugin-format-lrc'

const generator = new Generator.Client()
generator.plugin.add(new LrcGenerator())
```
