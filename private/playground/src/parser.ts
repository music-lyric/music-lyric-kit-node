import { Parser, Plugins } from 'music-lyric-kit'

export const createClient = () => {
  const client = new Parser()

  client.plugin.add(new Plugins.Formats.Lrc.Parser())
  client.plugin.add(new Plugins.Formats.Ttml.AmllParser())
  client.plugin.add(new Plugins.Transforms.Interlude.InsertPlugin())
  client.plugin.add(new Plugins.Transforms.Background.ExtractPlugin())
  client.plugin.add(new Plugins.Transforms.Background.CleanPlugin())
  client.plugin.add(new Plugins.Transforms.Agent.ExtractPlugin())
  client.plugin.add(new Plugins.Transforms.Pure.CleanPlugin())
  client.plugin.add(new Plugins.Transforms.Pure.ExtractCreatorPlugin())
  client.plugin.add(new Plugins.Transforms.Space.InsertPlugin())
  client.plugin.add(new Plugins.Transforms.Stress.MarkPlugin())

  return client
}
