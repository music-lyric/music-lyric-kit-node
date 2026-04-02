## v0.10.0 (2026-04-02)

### Feature

- `test`
  - add preview ([213c701](https://github.com/music-lyric/music-lyric-kit-node/commit/213c701))

### Bug Fix

- `plugin-format-lrc`
  - multiple extended line ​​will be overwrite ([fc0c998](https://github.com/music-lyric/music-lyric-kit-node/commit/fc0c998))

### Code Refactor

- remove unuse code ([29755db](https://github.com/music-lyric/music-lyric-kit-node/commit/29755db))
- `plugin-format-lrc`
  - optimize export type ([c2617b0](https://github.com/music-lyric/music-lyric-kit-node/commit/c2617b0))
  - merge syllable param into original param ([81866ca](https://github.com/music-lyric/music-lyric-kit-node/commit/81866ca))

## v0.9.0 (2026-03-28)

### Document

- add zh-hant language for readme ([1086895](https://github.com/music-lyric/music-lyric-kit-node/commit/1086895))

### Feature

- update plugin id ([94d7ec8](https://github.com/music-lyric/music-lyric-kit-node/commit/94d7ec8))
- `plugin-format-lrc`
  - align extended lines ([f2f89b8](https://github.com/music-lyric/music-lyric-kit-node/commit/f2f89b8))
- `plugin-transform-background`
  - support extract background content from extended in extract ([c514584](https://github.com/music-lyric/music-lyric-kit-node/commit/c514584))
  - support remove background line brackets in extract ([8a9aca0](https://github.com/music-lyric/music-lyric-kit-node/commit/8a9aca0))
  - support cross-line background extract ([42a131b](https://github.com/music-lyric/music-lyric-kit-node/commit/42a131b))
- `plugin-transform-pure`
  - update default extract creator rules ([fa61790](https://github.com/music-lyric/music-lyric-kit-node/commit/fa61790))

### Bug Fix

- `plugin-format-ttml`
  - parse syllable word time ([9d034c2](https://github.com/music-lyric/music-lyric-kit-node/commit/9d034c2))
- `plugin-transform-background`
  - skip extract for unclosed brackets ([d3a0bc9](https://github.com/music-lyric/music-lyric-kit-node/commit/d3a0bc9))

### Code Refactor

- `core`
  - remove built in align plugin ([f8296a7](https://github.com/music-lyric/music-lyric-kit-node/commit/f8296a7))
- `plugin-transform-agent`
  - optimize extract agents ([c484146](https://github.com/music-lyric/music-lyric-kit-node/commit/c484146))
- `plugin-transform-pure`
  - optimize music info match in clean ([5db1646](https://github.com/music-lyric/music-lyric-kit-node/commit/5db1646))
  - optimize discard creator lines ([54f77e8](https://github.com/music-lyric/music-lyric-kit-node/commit/54f77e8))

## v0.8.0 (2026-03-20)

### Document

- update use example ([305bce3](https://github.com/music-lyric/music-lyric-kit-node/commit/305bce3))

### Feature

- `core`
  - support sync line time with line words ([9a5fa6d](https://github.com/music-lyric/music-lyric-kit-node/commit/9a5fa6d))
- `plugin-transform-agent`
  - sync line time at the end ([d8a6ffb](https://github.com/music-lyric/music-lyric-kit-node/commit/d8a6ffb))
  - support remove agent name in extract ([aab451e](https://github.com/music-lyric/music-lyric-kit-node/commit/aab451e))
- `plugin-transform-pure`
  - update default extract creator rules ([b0bb8c4](https://github.com/music-lyric/music-lyric-kit-node/commit/b0bb8c4))
  - use lowercase rules for match ([ae617a4](https://github.com/music-lyric/music-lyric-kit-node/commit/ae617a4))

## v0.7.1 (2026-03-20)

### Bug Fix

- `plugin-transform-agent`
  - bad version ([1fcae9c](https://github.com/music-lyric/music-lyric-kit-node/commit/1fcae9c))

## v0.7.0 (2026-03-19)

### Document

- update description ([9bf6ea9](https://github.com/music-lyric/music-lyric-kit-node/commit/9bf6ea9))
- update readme ([908d90a](https://github.com/music-lyric/music-lyric-kit-node/commit/908d90a))

### Feature

- `core`
  - parser support clean redundant space ([1784f78](https://github.com/music-lyric/music-lyric-kit-node/commit/1784f78))
  - support pre check before exec plugin ([7b9ca93](https://github.com/music-lyric/music-lyric-kit-node/commit/7b9ca93))
  - support calc line agent index in context ([05699e9](https://github.com/music-lyric/music-lyric-kit-node/commit/05699e9))
- `lyric`
  - add word config ([452b4a3](https://github.com/music-lyric/music-lyric-kit-node/commit/452b4a3))
  - add background line ([70e0315](https://github.com/music-lyric/music-lyric-kit-node/commit/70e0315))
- `plugin-format-ttml`
  - support parse background line in amll format ([86040e3](https://github.com/music-lyric/music-lyric-kit-node/commit/86040e3))
  - add amll format parser plugin ([c818869](https://github.com/music-lyric/music-lyric-kit-node/commit/c818869))
- `plugin-transform-background`
  - add extract plugin ([dd249da](https://github.com/music-lyric/music-lyric-kit-node/commit/dd249da))
- `plugin-transform-stress`
  - add mark plugin ([cfe6174](https://github.com/music-lyric/music-lyric-kit-node/commit/cfe6174))
- `utils`
  - add xml util tools ([600025c](https://github.com/music-lyric/music-lyric-kit-node/commit/600025c))

### Bug Fix

- `lyric`
  - word extended content ([1764bd4](https://github.com/music-lyric/music-lyric-kit-node/commit/1764bd4))
- `plugin-transform-agent`
  - existing agents not being added to result ([b31b11f](https://github.com/music-lyric/music-lyric-kit-node/commit/b31b11f))

### Code Refactor

- `app`
  - export content name ([9160b2a](https://github.com/music-lyric/music-lyric-kit-node/commit/9160b2a))
- `plugin-transform-agent`
  - export content name ([b6713f3](https://github.com/music-lyric/music-lyric-kit-node/commit/b6713f3))
  - remove index calc ([bccefb3](https://github.com/music-lyric/music-lyric-kit-node/commit/bccefb3))
- `plugin-transform-interlude`
  - export content name ([749b42b](https://github.com/music-lyric/music-lyric-kit-node/commit/749b42b))

## v0.6.0 (2026-03-17)

### Feature

- `lyric`
  - add agent info ([8c6a18a](https://github.com/music-lyric/music-lyric-kit-node/commit/8c6a18a))
- `plugin-transform-agent`
  - add extract plugin ([41b7d09](https://github.com/music-lyric/music-lyric-kit-node/commit/41b7d09))
- `plugin-transform-interlude`
  - update priority ([a51c87d](https://github.com/music-lyric/music-lyric-kit-node/commit/a51c87d))
- `plugin-transform-pure`
  - update default extract creator rules ([6c7a594](https://github.com/music-lyric/music-lyric-kit-node/commit/6c7a594))
  - update priority ([93183f2](https://github.com/music-lyric/music-lyric-kit-node/commit/93183f2))
  - add music info support for first line clean ([6354bff](https://github.com/music-lyric/music-lyric-kit-node/commit/6354bff))
- `utils`
  - parse time support more formats ([ac2e2d9](https://github.com/music-lyric/music-lyric-kit-node/commit/ac2e2d9))

### Code Refactor

- `core`
  - optimize code ([fdb68ac](https://github.com/music-lyric/music-lyric-kit-node/commit/fdb68ac))

## v0.5.0 (2026-03-17)

### Feature

- `plugin-transform-interlude`
  - rename export content ([f40396c](https://github.com/music-lyric/music-lyric-kit-node/commit/f40396c))
- `plugin-transform-pure`
  - add extract plugin ([f53bc50](https://github.com/music-lyric/music-lyric-kit-node/commit/f53bc50))
  - add clean plugin ([a01c85c](https://github.com/music-lyric/music-lyric-kit-node/commit/a01c85c))
- `plugin-transform-space`
  - rename export content ([b4f5b75](https://github.com/music-lyric/music-lyric-kit-node/commit/b4f5b75))
  - add insert plugin ([47ad20d](https://github.com/music-lyric/music-lyric-kit-node/commit/47ad20d))
- `utils`
  - add event listener support to config manager ([2b0403d](https://github.com/music-lyric/music-lyric-kit-node/commit/2b0403d))

### Code Refactor

- `plugin-transform-space`
  - optimize code ([cacc43c](https://github.com/music-lyric/music-lyric-kit-node/commit/cacc43c))
- `utils`
  - remove unuse tools ([5a66a68](https://github.com/music-lyric/music-lyric-kit-node/commit/5a66a68))

## v0.4.0 (2026-03-01)

### Feature

- `app`
  - export generator ([8cec07d](https://github.com/music-lyric/music-lyric-kit-node/commit/8cec07d))
- `core`
  - add generator implement ([efd7ace](https://github.com/music-lyric/music-lyric-kit-node/commit/efd7ace))
- `plugin-format-lrc`
  - add generator ([29d5d7e](https://github.com/music-lyric/music-lyric-kit-node/commit/29d5d7e))

## v0.3.0 (2026-02-26)

### Feature

- `app`
  - add plugin ([9fc495e](https://github.com/music-lyric/music-lyric-kit-node/commit/9fc495e))
- `core`
  - switch to use common config manager ([343fa0d](https://github.com/music-lyric/music-lyric-kit-node/commit/343fa0d))
- `plugin-transform-interlude`
  - add plugin ([ff7c01a](https://github.com/music-lyric/music-lyric-kit-node/commit/ff7c01a))
- `test`
  - add plugin ([0a31c4f](https://github.com/music-lyric/music-lyric-kit-node/commit/0a31c4f))
- `utils`
  - add config manager ([71935dc](https://github.com/music-lyric/music-lyric-kit-node/commit/71935dc))

### Bug Fix

- `core`
  - type error ([e94d9d9](https://github.com/music-lyric/music-lyric-kit-node/commit/e94d9d9))

### Code Refactor

- plugin system ([630a1dd](https://github.com/music-lyric/music-lyric-kit-node/commit/630a1dd))

### Breaking Change

- plugin interface has been changed

## v0.2.0 (2026-02-26)

### Feature

- `lyric`
  - add meta info ([a9846f9](https://github.com/music-lyric/music-lyric-kit-node/commit/a9846f9))
- `plugin-format-lrc`
  - support parse meta ([8a7c906](https://github.com/music-lyric/music-lyric-kit-node/commit/8a7c906))
- `test`
  - add parse page ([d37fc1c](https://github.com/music-lyric/music-lyric-kit-node/commit/d37fc1c))

## v0.1.1 (2026-02-08)

### Document

- update use example ([0acd910](https://github.com/music-lyric/music-lyric-kit-node/commit/0acd910))
- update contributor info ([6e033b6](https://github.com/music-lyric/music-lyric-kit-node/commit/6e033b6))

### Feature

- `lyric`
  - change info version to getter ([457c38a](https://github.com/music-lyric/music-lyric-kit-node/commit/457c38a))

### Bug Fix

- `app`
  - export content ([59766f3](https://github.com/music-lyric/music-lyric-kit-node/commit/59766f3))

### Code Refactor

- `lyric`
  - remove default export ([4153b71](https://github.com/music-lyric/music-lyric-kit-node/commit/4153b71))

## v0.1.0 (2026-02-08)

### Document

- update license ([3472ba0](https://github.com/music-lyric/music-lyric-kit-node/commit/3472ba0))
- update readme ([58b2b31](https://github.com/music-lyric/music-lyric-kit-node/commit/58b2b31))

### Feature

- `app`
  - add export ([00cf2e8](https://github.com/music-lyric/music-lyric-kit-node/commit/00cf2e8))
- `core`
  - add plugin meta ([7be13b5](https://github.com/music-lyric/music-lyric-kit-node/commit/7be13b5))
  - change parser stage ([c64a8d6](https://github.com/music-lyric/music-lyric-kit-node/commit/c64a8d6))
  - support change options ([e9acacb](https://github.com/music-lyric/music-lyric-kit-node/commit/e9acacb))
  - change align tool to built in tool ([f42552a](https://github.com/music-lyric/music-lyric-kit-node/commit/f42552a))
  - change parser context to class ([fb9a287](https://github.com/music-lyric/music-lyric-kit-node/commit/fb9a287))
  - change default result type to not null in parser context ([5fa2d1a](https://github.com/music-lyric/music-lyric-kit-node/commit/5fa2d1a))
  - add parser implement ([673a733](https://github.com/music-lyric/music-lyric-kit-node/commit/673a733))
  - add base plugin interface ([2d50437](https://github.com/music-lyric/music-lyric-kit-node/commit/2d50437))
- `lyric`
  - auto generate id when create line ([ba8899f](https://github.com/music-lyric/music-lyric-kit-node/commit/ba8899f))
  - change export name for line content class ([dfe45fb](https://github.com/music-lyric/music-lyric-kit-node/commit/dfe45fb))
  - change word type to getter ([ccae411](https://github.com/music-lyric/music-lyric-kit-node/commit/ccae411))
  - add interlude line ([c55c2a8](https://github.com/music-lyric/music-lyric-kit-node/commit/c55c2a8))
  - add empty type in lyric type ([e5c14a8](https://github.com/music-lyric/music-lyric-kit-node/commit/e5c14a8))
  - export lyric type ([dc51545](https://github.com/music-lyric/music-lyric-kit-node/commit/dc51545))
  - add lyric type ([56bec21](https://github.com/music-lyric/music-lyric-kit-node/commit/56bec21))
  - add default export ([71f7d48](https://github.com/music-lyric/music-lyric-kit-node/commit/71f7d48))
  - export word type ([5b9a7a1](https://github.com/music-lyric/music-lyric-kit-node/commit/5b9a7a1))
  - add interface and constant ([f556ac4](https://github.com/music-lyric/music-lyric-kit-node/commit/f556ac4))
- `plugin-format-lrc`
  - add parser ([e7f77ee](https://github.com/music-lyric/music-lyric-kit-node/commit/e7f77ee))
- `utils`
  - add random hex string tool ([7777687](https://github.com/music-lyric/music-lyric-kit-node/commit/7777687))
  - number align tool support multiple targets ([bdd570c](https://github.com/music-lyric/music-lyric-kit-node/commit/bdd570c))
  - add number align tools ([817179a](https://github.com/music-lyric/music-lyric-kit-node/commit/817179a))
  - add tools ([beca636](https://github.com/music-lyric/music-lyric-kit-node/commit/beca636))

### Bug Fix

- dependencies resolve failed when build ([2a49d51](https://github.com/music-lyric/music-lyric-kit-node/commit/2a49d51))
- `lyric`
  - line type getter return error type ([ac3ed22](https://github.com/music-lyric/music-lyric-kit-node/commit/ac3ed22))
  - export type ([78f7672](https://github.com/music-lyric/music-lyric-kit-node/commit/78f7672))

### Code Refactor

- `core`
  - export content ([8e78f8d](https://github.com/music-lyric/music-lyric-kit-node/commit/8e78f8d))
  - parser plugin system ([243738f](https://github.com/music-lyric/music-lyric-kit-node/commit/243738f))
  - parser plugin loader ([586f980](https://github.com/music-lyric/music-lyric-kit-node/commit/586f980))
