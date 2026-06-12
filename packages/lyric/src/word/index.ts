import { Time } from '../time'
import { Extended } from '../extended'

export enum WordType {
  Normal = 'Normal',
  Space = 'Space',
}

export class WordNormalConfig {
  stress: boolean = false
}

export class WordNormal {
  readonly type = WordType.Normal

  time: Time = new Time()

  content: string = ''

  extended: Extended[] = []

  config: WordNormalConfig = new WordNormalConfig()
}

export class WordSpace {
  readonly type = WordType.Space

  count: number = 1
}

export type Word = WordNormal | WordSpace
