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
