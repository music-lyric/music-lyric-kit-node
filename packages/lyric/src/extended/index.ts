export enum ExtendedType {
  Unknown = 'Unknown',
  Translate = 'Translate',
  Roman = 'Roman',
}

export class Extended {
  type: ExtendedType = ExtendedType.Unknown

  content: string = ''
}
