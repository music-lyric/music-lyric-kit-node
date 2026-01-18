export enum ExtendedType {
  UnKnown = 'UnKnown',
  Translate = 'Translate',
  Roman = 'Roman',
}

export class Extended {
  type: ExtendedType = ExtendedType.UnKnown

  content: string = ''

  toJSON() {
    return {
      type: this.type,
      content: this.content,
    }
  }
}
