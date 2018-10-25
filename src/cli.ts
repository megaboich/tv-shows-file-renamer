import * as path from "path";
import * as commander from "commander";
import * as chalk from "chalk";
import { getAllFilesFlat } from "./helpers/get-all-files-flat";
import { TheTvDbMetadataProvider } from "./episodes/thetvdb-metadata-provider";
import { EpisodesProcessor } from "./episodes/episodes-processor";
import { moveFile } from "./helpers/move-file";

async function main() {
  console.log("TV shows file renamer 0.3");
  const cwd = process.cwd();
  console.log("Current directory: ", cwd);

  const cmdParams = commander
    .version("0.1.0")
    .option("-s, --slug [value]", "Series slug")
    .option("-d, --dry", "Dry run")
    .parse(process.argv);

  const dryRun = !!cmdParams.dry;
  if (dryRun) {
    console.log("Dry run dude!");
  }

  const slug: string = cmdParams.slug;
  if (!slug) {
    throw new Error("--slug is required");
  }

  const tvDbLoader = new TheTvDbMetadataProvider({
    apikey: "MW5TK02DUDMSH9A4",
    username: "mega.boichetq",
    userkey: "UA27FF66EENM8BSR"
  });
  const meta = await tvDbLoader.loadSeriesMetadata(slug);

  const allFiles = getAllFilesFlat(cwd);
  const episodes = EpisodesProcessor.getEpisodes(allFiles, meta);

  for (const episode of episodes) {
    if (episode.meta && episode.targetRelativeFilenames) {
      console.log(
        chalk.default.yellow(`${episode.episodeAbsoluteNumber}`) +
          ` | Season ${episode.meta.airedSeason} | Episode ${
            episode.meta.airedEpisodeNumber
          } | ${episode.normalizedName}`
      );
      console.log(chalk.default.green(episode.meta.episodeName));
      console.log("->");
      for (let fi = 0; fi < episode.originalFilenames.length; ++fi) {
        const sourceFn = episode.originalFilenames[fi];
        const sourceRelativeFn = sourceFn.replace(cwd, "");
        const targetRelativeFn = episode.targetRelativeFilenames[fi];
        console.log(`${sourceRelativeFn}  -->  ${targetRelativeFn}`);

        if (!dryRun) {
          moveFile(sourceFn, path.join(cwd, targetRelativeFn));
        }
      }
      console.log("---------");
    }
  }

  console.log("all done");
}

main();