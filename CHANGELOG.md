## v0.18.0 (2026-07-19)

### Feature

- bump lyric model version ([94ed3f1](https://github.com/music-lyric/music-lyric-kit-node/commit/94ed3f1))

### Fix

- `plugin-format-ttml`
  - detect timing across lines ([f45485b](https://github.com/music-lyric/music-lyric-kit-node/commit/f45485b))
- `plugin-transform-background`
  - preserve word language ([4da6652](https://github.com/music-lyric/music-lyric-kit-node/commit/4da6652))
- `plugin-transform-pure`
  - improve exact matching ([dd442eb](https://github.com/music-lyric/music-lyric-kit-node/commit/dd442eb))
  - reset matcher rules when update ([a1a1e71](https://github.com/music-lyric/music-lyric-kit-node/commit/a1a1e71))

### Performance

- `plugin-format-lrc`
  - skip empty extended tracks ([53d00f4](https://github.com/music-lyric/music-lyric-kit-node/commit/53d00f4))

### Refactor

- optimize code ([5610b54](https://github.com/music-lyric/music-lyric-kit-node/commit/5610b54))
- normalize parser input ([3de4414](https://github.com/music-lyric/music-lyric-kit-node/commit/3de4414))
- `plugin-transform-pure`
  - split matcher modes ([40d6b19](https://github.com/music-lyric/music-lyric-kit-node/commit/40d6b19))

## v0.17.0 (2026-07-09)

### Feature

- bump lyric model version ([63a4990](https://github.com/music-lyric/music-lyric-kit-node/commit/63a4990))

## v0.16.0 (2026-07-06)

### Feature

- bump lyric model version ([a6757da](https://github.com/music-lyric/music-lyric-kit-node/commit/a6757da))
- `plugin-transform-pure`
  - update default extract creator rules ([815417d](https://github.com/music-lyric/music-lyric-kit-node/commit/815417d))

### Refactor

- `plugin-transform-pure`
  - update clean plugin default config ([c1e2ae8](https://github.com/music-lyric/music-lyric-kit-node/commit/c1e2ae8))

## v0.15.0 (2026-07-04)

### Feature

- display input and encoded sizes ([3c3f4fc](https://github.com/music-lyric/music-lyric-kit-node/commit/3c3f4fc))
- bump lyric model version ([9bd8cc6](https://github.com/music-lyric/music-lyric-kit-node/commit/9bd8cc6))
- `plugin-format-ttml`
  - match background annotations by key ([616486f](https://github.com/music-lyric/music-lyric-kit-node/commit/616486f))

### Fix

- render error in playground result ([9833c1f](https://github.com/music-lyric/music-lyric-kit-node/commit/9833c1f))

### Refactor

- `plugin-format-ttml`
  - simplify line parsing and annotations ([c351966](https://github.com/music-lyric/music-lyric-kit-node/commit/c351966))

## v0.14.1 (2026-06-25)

### Feature

- `plugin-transform-background`
  - assign bracketed annotations to existing backgrounds ([4ca2b47](https://github.com/music-lyric/music-lyric-kit-node/commit/4ca2b47))

### Fix

- `plugin-format-ttml`
  - isolate xml parser state per parse ([0ab229f](https://github.com/music-lyric/music-lyric-kit-node/commit/0ab229f))
  - split background annotations into background lines ([6d5f302](https://github.com/music-lyric/music-lyric-kit-node/commit/6d5f302))
- `utils`
  - replace arrays wholesale on deep merge ([b05719a](https://github.com/music-lyric/music-lyric-kit-node/commit/b05719a))

### Performance

- `plugin-transform-pure`
  - avoid per-line allocations in clean loop ([ab15d0e](https://github.com/music-lyric/music-lyric-kit-node/commit/ab15d0e))
- `utils`
  - reduce redundant work on config changes ([47c053d](https://github.com/music-lyric/music-lyric-kit-node/commit/47c053d))

## v0.14.0 (2026-06-23)

### Document

- `lyric`
  - mark derived values as live or snapshot ([81343f5](https://github.com/music-lyric/music-lyric-kit-node/commit/81343f5))

### Feature

- `lyric`
  - bump model version ([416bd1e](https://github.com/music-lyric/music-lyric-kit-node/commit/416bd1e))
  - add ruby phrase start flag ([d34f323](https://github.com/music-lyric/music-lyric-kit-node/commit/d34f323))
  - add language accessors ([ddcaf95](https://github.com/music-lyric/music-lyric-kit-node/commit/ddcaf95))
  - add options object constructors to model classes ([15f513f](https://github.com/music-lyric/music-lyric-kit-node/commit/15f513f))
- `ttml`
  - parse amll ruby phrase start ([d3f913c](https://github.com/music-lyric/music-lyric-kit-node/commit/d3f913c))

### Fix

- `plugin-format-lrc`
  - normalize punctuation on syllable word boundaries ([ec5aa4d](https://github.com/music-lyric/music-lyric-kit-node/commit/ec5aa4d))
- `plugin-transform-agent`
  - skip clock time in agent match ([1bde58d](https://github.com/music-lyric/music-lyric-kit-node/commit/1bde58d))
- `plugin-transform-space`
  - keep numeric separators tight ([3550de9](https://github.com/music-lyric/music-lyric-kit-node/commit/3550de9))
  - space chained operators and slashes ([5f9fdf9](https://github.com/music-lyric/music-lyric-kit-node/commit/5f9fdf9))

### Refactor

- `lyric`
  - simplify init type ([d739ec9](https://github.com/music-lyric/music-lyric-kit-node/commit/d739ec9))
  - remove unused ids ([593cd7f](https://github.com/music-lyric/music-lyric-kit-node/commit/593cd7f))
  - restructure agents ([5911cfe](https://github.com/music-lyric/music-lyric-kit-node/commit/5911cfe))
  - restructure line annotations ([2fa7248](https://github.com/music-lyric/music-lyric-kit-node/commit/2fa7248))
  - rework model constructors and meta accessors ([66de8f2](https://github.com/music-lyric/music-lyric-kit-node/commit/66de8f2))

## v0.13.0 (2026-06-22)

### Feature

- `lyric`
  - agent support multiple names ([a25fcd8](https://github.com/music-lyric/music-lyric-kit-node/commit/a25fcd8))
  - add agent type ([2fe921f](https://github.com/music-lyric/music-lyric-kit-node/commit/2fe921f))
- `main`
  - add new format parser ([261b4c4](https://github.com/music-lyric/music-lyric-kit-node/commit/261b4c4))
  - add language calculate options ([1251720](https://github.com/music-lyric/music-lyric-kit-node/commit/1251720))
  - add language plugin ([038f006](https://github.com/music-lyric/music-lyric-kit-node/commit/038f006))
- `plugin-format-ttml`
  - add amll ruby annotations parse ([aa9a516](https://github.com/music-lyric/music-lyric-kit-node/commit/aa9a516))
  - parse agent names ([ffc74c2](https://github.com/music-lyric/music-lyric-kit-node/commit/ffc74c2))
  - parse agent type ([c191adb](https://github.com/music-lyric/music-lyric-kit-node/commit/c191adb))
  - add roman parse for am format ([793848a](https://github.com/music-lyric/music-lyric-kit-node/commit/793848a))
  - add new meta support for amll parser ([af4d5cf](https://github.com/music-lyric/music-lyric-kit-node/commit/af4d5cf))
  - add am format ttml parser ([b55bf21](https://github.com/music-lyric/music-lyric-kit-node/commit/b55bf21))
- `plugin-transform-language`
  - add percent calculation plugin ([f8132a4](https://github.com/music-lyric/music-lyric-kit-node/commit/f8132a4))
  - add infer plugin ([2acd707](https://github.com/music-lyric/music-lyric-kit-node/commit/2acd707))
- `utils`
  - add create random string tool ([c75f27e](https://github.com/music-lyric/music-lyric-kit-node/commit/c75f27e))

### Fix

- `plugin-format-ttml`
  - apply am replacement translation as original words ([5eec81a](https://github.com/music-lyric/music-lyric-kit-node/commit/5eec81a))

### Refactor

- `lyric`
  - restructure data model ([4606027](https://github.com/music-lyric/music-lyric-kit-node/commit/4606027))
- `main`
  - update plugin name ([df84a73](https://github.com/music-lyric/music-lyric-kit-node/commit/df84a73))
- `plugin-format-ttml`
  - restructure parser ([7f197ed](https://github.com/music-lyric/music-lyric-kit-node/commit/7f197ed))
  - optimize code ([0d69c7f](https://github.com/music-lyric/music-lyric-kit-node/commit/0d69c7f))
- `plugin-transform-agent`
  - adapt agent names to array ([20b6491](https://github.com/music-lyric/music-lyric-kit-node/commit/20b6491))
- `plugin-transform-language`
  - restructure language detection and share weighting ([47bc329](https://github.com/music-lyric/music-lyric-kit-node/commit/47bc329))
- `utils`
  - return null when an invalid value is passed in while parsing xml ([1bab549](https://github.com/music-lyric/music-lyric-kit-node/commit/1bab549))

## v0.12.1 (2026-06-18)

### Document

- `readme`
  - update pipeline examples to per-plugin scope api ([4c4b46f](https://github.com/music-lyric/music-lyric-kit-node/commit/4c4b46f))

### Feature

- `plugin-transform-pure`
  - update default extract creator rules ([ffbfefb](https://github.com/music-lyric/music-lyric-kit-node/commit/ffbfefb))

### Fix

- `plugin-format-ttml`
  - keep zero timestamps when parsing line and word begin end ([c3f9f7e](https://github.com/music-lyric/music-lyric-kit-node/commit/c3f9f7e))
- `plugin-transform-background`
  - deep copy word time and extended when copying ([699e4b4](https://github.com/music-lyric/music-lyric-kit-node/commit/699e4b4))
  - append buffered content for unclosed bracket in extended extract ([d6393f3](https://github.com/music-lyric/music-lyric-kit-node/commit/d6393f3))
- `plugin-transform-space`
  - space consecutive hyphens correctly and stop spacing asterisk ([912e128](https://github.com/music-lyric/music-lyric-kit-node/commit/912e128))
  - align space stripping with the matcher space definition ([41c0eea](https://github.com/music-lyric/music-lyric-kit-node/commit/41c0eea))
  - preserve word config when rebuilding spaced words ([70aa504](https://github.com/music-lyric/music-lyric-kit-node/commit/70aa504))
  - apply space insertion to background lines ([b2ca2b1](https://github.com/music-lyric/music-lyric-kit-node/commit/b2ca2b1))

### Performance

- remove dead branches and redundant passes in lyric processing ([7b3c0dc](https://github.com/music-lyric/music-lyric-kit-node/commit/7b3c0dc))
- `lyric`
  - build line original without intermediate map array ([5513375](https://github.com/music-lyric/music-lyric-kit-node/commit/5513375))
- `plugin-format-ttml`
  - locate body and metadata once and drop redundant array builds ([35b05b9](https://github.com/music-lyric/music-lyric-kit-node/commit/35b05b9))
- `plugin-transform-background`
  - find boundary words without allocating filtered arrays ([e019ab2](https://github.com/music-lyric/music-lyric-kit-node/commit/e019ab2))
- `plugin-transform-space`
  - resolve enabled type set once per run instead of per line ([f73c980](https://github.com/music-lyric/music-lyric-kit-node/commit/f73c980))

### Refactor

- `main`
  - group transform methods into per-plugin scopes in pipeline ([f537483](https://github.com/music-lyric/music-lyric-kit-node/commit/f537483))

## v0.12.0 (2026-06-12)

### Document

- `utils`
  - note random hex length is byte count ([de63239](https://github.com/music-lyric/music-lyric-kit-node/commit/de63239))

### Fix

- `core`
  - sort process plugins by priority in infer ([22fbed3](https://github.com/music-lyric/music-lyric-kit-node/commit/22fbed3))
  - calc agent index after sorting lines for correct order ([db94b68](https://github.com/music-lyric/music-lyric-kit-node/commit/db94b68))
  - assign generator result to backing field to avoid setter recursion ([104667f](https://github.com/music-lyric/music-lyric-kit-node/commit/104667f))
- `plugin-format-lrc`
  - relax timestamp digit length validation to prevent match failures ([55a9fd4](https://github.com/music-lyric/music-lyric-kit-node/commit/55a9fd4))
- `utils`
  - align time validation ([362ef18](https://github.com/music-lyric/music-lyric-kit-node/commit/362ef18))

### Performance

- `core`
  - cache plugin stage grouping ([24f8e29](https://github.com/music-lyric/music-lyric-kit-node/commit/24f8e29))
- `lyric`
  - use string repeat for space words in original getter ([8779e0f](https://github.com/music-lyric/music-lyric-kit-node/commit/8779e0f))
- `utils`
  - rebuild pending with filter in align numbers ([9dafe1d](https://github.com/music-lyric/music-lyric-kit-node/commit/9dafe1d))

### Refactor

- rename exports ([20e1106](https://github.com/music-lyric/music-lyric-kit-node/commit/20e1106))
- `lyric`
  - add dedicated background line type to block nesting ([4071dc4](https://github.com/music-lyric/music-lyric-kit-node/commit/4071dc4))
  - rename data model values ([c6e5298](https://github.com/music-lyric/music-lyric-kit-node/commit/c6e5298))
  - rename data models for naming consistency ([855c4c1](https://github.com/music-lyric/music-lyric-kit-node/commit/855c4c1))
  - replace constant getters with readonly fields ([7203313](https://github.com/music-lyric/music-lyric-kit-node/commit/7203313))
  - export single lyric namespace and reorganize modules ([c4cc893](https://github.com/music-lyric/music-lyric-kit-node/commit/c4cc893))
- `utils`
  - config manager ([94af942](https://github.com/music-lyric/music-lyric-kit-node/commit/94af942))

## v0.11.2 (2026-05-03)

### Fix

- `plugin-format-ttml`
  - the end spaces not add to words ([60993cb](https://github.com/music-lyric/music-lyric-kit-node/commit/60993cb))

## v0.11.1 (2026-05-03)

### Fix

- `main`
  - unable to infer format in pipie line ([88c08ff](https://github.com/music-lyric/music-lyric-kit-node/commit/88c08ff))
- `plugin-format-ttml`
  - the spaces in the line were not parsed correctly ([e112edf](https://github.com/music-lyric/music-lyric-kit-node/commit/e112edf))

## v0.11.0 (2026-04-05)

### Document

- update readme ([f2603c8](https://github.com/music-lyric/music-lyric-kit-node/commit/f2603c8))

### Feature

- `core`
  - support use pipeline to parse lyric ([619d251](https://github.com/music-lyric/music-lyric-kit-node/commit/619d251))
  - print log when plugin throw error ([6a90880](https://github.com/music-lyric/music-lyric-kit-node/commit/6a90880))
  - support sync line end time with background line ([671b636](https://github.com/music-lyric/music-lyric-kit-node/commit/671b636))
  - support sort background line ([150931f](https://github.com/music-lyric/music-lyric-kit-node/commit/150931f))
- `plugin-transform-background`
  - add clean plugin ([52f72e6](https://github.com/music-lyric/music-lyric-kit-node/commit/52f72e6))
- `plugin-transform-pure`
  - update default extract creator rules ([b2b01eb](https://github.com/music-lyric/music-lyric-kit-node/commit/b2b01eb))
- `plugin-transform-space`
  - support processing extended line ([fa53f55](https://github.com/music-lyric/music-lyric-kit-node/commit/fa53f55))

### Fix

- dependencies workspace version ([1234336](https://github.com/music-lyric/music-lyric-kit-node/commit/1234336))
- `plugin-transform-agent`
  - incorrect util tool name ([93a2f55](https://github.com/music-lyric/music-lyric-kit-node/commit/93a2f55))
- `plugin-transform-background`
  - skip extract cross line when line has complete bracket ([2882c7e](https://github.com/music-lyric/music-lyric-kit-node/commit/2882c7e))

### Refactor

- plugin system ([4cb1a0e](https://github.com/music-lyric/music-lyric-kit-node/commit/4cb1a0e))
- `core`
  - optimize util tools performance ([4e62921](https://github.com/music-lyric/music-lyric-kit-node/commit/4e62921))
- `plugin-transform-background`
  - remove clean brackets ([adec870](https://github.com/music-lyric/music-lyric-kit-node/commit/adec870))
- `plugin-transform-pure`
  - optimize default creator match rule in extract ([7b6803a](https://github.com/music-lyric/music-lyric-kit-node/commit/7b6803a))

## v0.10.0 (2026-04-02)

### Feature

- `test`
  - add preview ([213c701](https://github.com/music-lyric/music-lyric-kit-node/commit/213c701))

### Fix

- `plugin-format-lrc`
  - multiple extended line ​​will be overwrite ([fc0c998](https://github.com/music-lyric/music-lyric-kit-node/commit/fc0c998))

### Refactor

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

### Fix

- `plugin-format-ttml`
  - parse syllable word time ([9d034c2](https://github.com/music-lyric/music-lyric-kit-node/commit/9d034c2))
- `plugin-transform-background`
  - skip extract for unclosed brackets ([d3a0bc9](https://github.com/music-lyric/music-lyric-kit-node/commit/d3a0bc9))

### Refactor

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

### Fix

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

### Fix

- `lyric`
  - word extended content ([1764bd4](https://github.com/music-lyric/music-lyric-kit-node/commit/1764bd4))
- `plugin-transform-agent`
  - existing agents not being added to result ([b31b11f](https://github.com/music-lyric/music-lyric-kit-node/commit/b31b11f))

### Refactor

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

### Refactor

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

### Refactor

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

### Fix

- `core`
  - type error ([e94d9d9](https://github.com/music-lyric/music-lyric-kit-node/commit/e94d9d9))

### Refactor

- plugin system ([630a1dd](https://github.com/music-lyric/music-lyric-kit-node/commit/630a1dd))

### Breaking

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

### Fix

- `app`
  - export content ([59766f3](https://github.com/music-lyric/music-lyric-kit-node/commit/59766f3))

### Refactor

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

### Fix

- dependencies resolve failed when build ([2a49d51](https://github.com/music-lyric/music-lyric-kit-node/commit/2a49d51))
- `lyric`
  - line type getter return error type ([ac3ed22](https://github.com/music-lyric/music-lyric-kit-node/commit/ac3ed22))
  - export type ([78f7672](https://github.com/music-lyric/music-lyric-kit-node/commit/78f7672))

### Refactor

- `core`
  - export content ([8e78f8d](https://github.com/music-lyric/music-lyric-kit-node/commit/8e78f8d))
  - parser plugin system ([243738f](https://github.com/music-lyric/music-lyric-kit-node/commit/243738f))
  - parser plugin loader ([586f980](https://github.com/music-lyric/music-lyric-kit-node/commit/586f980))
