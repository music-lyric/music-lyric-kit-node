import { createRandomHex } from '@music-lyric-kit/utils'

export enum MetaType {
  // lyric offset
  Offset = 'Offset',
  // song duration
  Duration = 'Duration',
  // song title
  Title = 'Title',
  // song singer
  Singer = 'Singer',
  // song album
  Album = 'Album',
  // song creators
  Creator = 'Creator',
  // unknown
  UnKnown = 'UnKnown',
}

abstract class MetaBase {
  id: string = createRandomHex(4).toUpperCase()

  abstract readonly type: MetaType

  abstract content: any
}

export class MetaOffset extends MetaBase {
  override readonly type = MetaType.Offset

  override content: number = 0
}

export class MetaDuration extends MetaBase {
  override readonly type = MetaType.Duration

  override content: number = 0
}

export class MetaTitle extends MetaBase {
  override readonly type = MetaType.Title

  override content: string = ''
}

export class MetaSinger extends MetaBase {
  override readonly type = MetaType.Singer

  override content: string = ''
}

export class MetaAlbum extends MetaBase {
  override readonly type = MetaType.Album

  override content: string = ''
}

interface MetaCreatorContent {
  role: string
  name: string[]
}
export class MetaCreator extends MetaBase {
  override readonly type = MetaType.Creator

  override content: MetaCreatorContent = {
    role: '',
    name: [],
  }
}

export class MetaUnKnown extends MetaBase {
  override readonly type = MetaType.UnKnown

  override content: any = ''
}

export type Meta = MetaOffset | MetaDuration | MetaTitle | MetaSinger | MetaAlbum | MetaCreator | MetaUnKnown
