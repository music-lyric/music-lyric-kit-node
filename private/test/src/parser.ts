import { Parser, Plugins } from 'music-lyric-kit'

export const createParser = () => {
  const parser = new Parser()

  parser.plugin.add(new Plugins.Formats.Lrc.Parser())
  parser.plugin.add(new Plugins.Formats.Ttml.AmllParser())
  parser.plugin.add(new Plugins.Transforms.Interlude.InsertPlugin())
  parser.plugin.add(new Plugins.Transforms.Background.ExtractPlugin())
  parser.plugin.add(new Plugins.Transforms.Agent.ExtractPlugin())
  parser.plugin.add(new Plugins.Transforms.Pure.CleanPlugin())
  parser.plugin.add(new Plugins.Transforms.Pure.ExtractCreatorPlugin())
  parser.plugin.add(new Plugins.Transforms.Space.InsertPlugin())
  parser.plugin.add(new Plugins.Transforms.Stress.MarkPlugin())

  return parser
}
