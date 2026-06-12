## @music-lyric-kit/plugin-transform-agent

Multi-voice support plugin.

## Install

```shell
npm install @music-lyric-kit/plugin-transform-agent
```

## Usage

```js
import { Parser } from '@music-lyric-kit/core'
import { Extract } from '@music-lyric-kit/plugin-transform-agent'

const parser = new Parser.Client()
parser.plugin.add(new Extract())
```
