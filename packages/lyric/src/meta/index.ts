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

  abstract get type(): MetaType

  abstract content: any

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
    }
  }
}

export class MetaOffset extends MetaBase {
  override get type() {
    return MetaType.Offset as const
  }

  override content: number = 0
}

export class MetaDuration extends MetaBase {
  override get type() {
    return MetaType.Duration as const
  }

  override content: number = 0
}

export class MetaTitle extends MetaBase {
  override get type() {
    return MetaType.Title as const
  }

  override content: string = ''
}

export class MetaSinger extends MetaBase {
  override get type() {
    return MetaType.Singer as const
  }

  override content: string = ''
}

export class MetaAlbum extends MetaBase {
  override get type() {
    return MetaType.Album as const
  }

  override content: string = ''
}

interface MetaCreatorContent {
  role: string
  name: string[]
}
export class MetaCreator extends MetaBase {
  override get type() {
    return MetaType.Creator as const
  }

  override content: MetaCreatorContent = {
    role: '',
    name: [],
  }
}

export class MetaUnKnown extends MetaBase {
  override get type() {
    return MetaType.UnKnown as const
  }

  override content: any = ''
}

export type Meta = MetaOffset | MetaDuration | MetaTitle | MetaSinger | MetaAlbum | MetaCreator | MetaUnKnown
