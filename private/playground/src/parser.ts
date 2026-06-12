import { Parser, Format, Transform } from 'music-lyric-kit'

export const createClient = () => {
  const client = new Parser()

  client.plugin.add(new Format.Lrc.Parser())
  client.plugin.add(new Format.Ttml.AmllParser())
  client.plugin.add(new Transform.Interlude.Insert())
  client.plugin.add(new Transform.Background.Extract())
  client.plugin.add(new Transform.Background.Clean())
  client.plugin.add(new Transform.Agent.Extract())
  client.plugin.add(new Transform.Pure.Clean())
  client.plugin.add(new Transform.Pure.ExtractCreator())
  client.plugin.add(new Transform.Space.Insert())
  client.plugin.add(new Transform.Stress.Mark())

  return client
}
