export enum MetaType {
  /**
   * Lyric time offset in milliseconds.
   */
  Offset = 'Offset',
  /**
   * Song duration.
   */
  Duration = 'Duration',
  /**
   * Song title.
   */
  Title = 'Title',
  /**
   * Song singer.
   */
  Singer = 'Singer',
  /**
   * Song album.
   */
  Album = 'Album',
  /**
   * Song creator such as lyricist or composer.
   */
  Creator = 'Creator',
  /**
   * Lyric author or transcriber.
   */
  Author = 'Author',
  /**
   * International Standard Recording Code.
   */
  Isrc = 'Isrc',
  /**
   * Unknown meta kind preserved by its original key.
   */
  Unknown = 'Unknown',
}

export interface MetaValueMap {
  /**
   * Offset in milliseconds.
   */
  [MetaType.Offset]: number
  /**
   * Duration in milliseconds.
   */
  [MetaType.Duration]: number
  /**
   * Title text.
   */
  [MetaType.Title]: string
  /**
   * Singer name.
   */
  [MetaType.Singer]: string
  /**
   * Album name.
   */
  [MetaType.Album]: string
  /**
   * Creator role and names.
   */
  [MetaType.Creator]: {
    /**
     * Role of the creator, such as lyricist or composer.
     */
    role: string
    /**
     * Names of the creators for this role.
     */
    name: string[]
  }
  /**
   * Author name.
   */
  [MetaType.Author]: string
  /**
   * ISRC code.
   */
  [MetaType.Isrc]: string
  /**
   * Raw value of an unknown meta.
   */
  [MetaType.Unknown]: unknown
}

export type MetaValue<T extends MetaType> = MetaValueMap[T]

export type MetaItem = {
  [K in MetaType]: {
    /**
     * Semantic kind of the meta entry.
     */
    type: K
    /**
     * Original data key kept for round-trip fidelity and source tracing.
     */
    key: string
    /**
     * Parsed value typed by the meta kind.
     */
    value: MetaValueMap[K]
  }
}[MetaType]

/**
 * Create a meta entry.
 */
export const createMetaItem = <T extends MetaType>(type: T, key: string, value: MetaValueMap[T]): Extract<MetaItem, { type: T }> => {
  return {
    type,
    key,
    value,
  } as Extract<MetaItem, { type: T }>
}
