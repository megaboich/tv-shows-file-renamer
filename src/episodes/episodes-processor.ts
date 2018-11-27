import * as path from "path";
import * as sanitize from "sanitize-filename";
import { normalizeFileName } from "../helpers/normalize-file-name";
import { createCompareFunction } from "../helpers/create-compare-function";
import { ensure } from "../helpers/ensure";
import { EpisodeMeta } from "./thetvdb-metadata-provider";

export interface Episode {
  originalFilenames: string[];
  normalizedName: string;
  dirName: string;
  episodeAbsoluteNumber: number;
  meta?: EpisodeMeta;
  targetRelativeFilenames?: string[];
}

export class EpisodesProcessor {
  public static getEpisodes(
    flatFilenames: string[],
    meta: EpisodeMeta[],
    subextensions: string
  ): Episode[] {
    type EpisodesDic = { [name: string]: Episode | undefined };
    const episodesDic: EpisodesDic = {};
    for (const fn of flatFilenames) {
      const normalizedName = normalizeFileName(fn);
      const episode = episodesDic[normalizedName];
      if (episode) {
        episode.originalFilenames.push(fn);
      } else {
        const dirName = path.basename(path.dirname(fn));
        const absoluteNumber = EpisodesProcessor.extractAbsoluteNumber(
          normalizedName
        );
        const newEpisode: Episode = {
          originalFilenames: [fn],
          dirName: dirName,
          normalizedName: normalizedName,
          episodeAbsoluteNumber: absoluteNumber
        };
        episodesDic[normalizedName] = newEpisode;
      }
    }

    const episodes: Episode[] = Object.values(episodesDic).map(e => ensure(e));
    episodes.sort(
      createCompareFunction([
        { sortBy: e => e.dirName },
        { sortBy: e => e.normalizedName }
      ])
    );

    let currentMaxEpisodeInSeason = 10;
    for (const episodeMeta of meta) {
      if (episodeMeta.airedEpisodeNumber > currentMaxEpisodeInSeason) {
        currentMaxEpisodeInSeason = episodeMeta.airedEpisodeNumber;
      }
    }
    let maxEpisodeNumberLength = currentMaxEpisodeInSeason.toString().length;

    for (const episode of episodes) {
      episode.meta = meta.find(
        m => m.absoluteNumber === episode.episodeAbsoluteNumber
      );
      if (episode.meta) {
        episode.targetRelativeFilenames = episode.originalFilenames.map(fn =>
          EpisodesProcessor.buildTargetFileName(
            fn,
            episode,
            subextensions,
            maxEpisodeNumberLength
          )
        );
      }
    }

    return episodes;
  }

  public static extractAbsoluteNumber(name: string): number {
    const matches = name.match(/(\d+)/);
    if (matches) {
      return parseInt(matches[0], 10);
    }
    return -1;
  }

  public static buildTargetFileName(
    originalFileName: string,
    episode: Episode,
    subextensions: string,
    maxEpisodeNumberLength = 2
  ): string {
    const meta = ensure(episode.meta);
    const seasonFormatted = meta.airedSeason.toString().padStart(2, "0");
    const episodeIndexFormatted = meta.airedEpisodeNumber
      .toString()
      .padStart(maxEpisodeNumberLength, "0");
    const absoluteNumberFormatted = meta.absoluteNumber
      .toString()
      .padStart(maxEpisodeNumberLength, "0");
    let targetFileName = `S${seasonFormatted}E${episodeIndexFormatted} - ${absoluteNumberFormatted} - ${
      meta.episodeName
    }`;
    targetFileName = sanitize(targetFileName);

    let name = path.basename(originalFileName);
    let dotIndex = name.indexOf(".");
    const ext = dotIndex >= 0 ? name.substring(dotIndex + 1) : "";
    let extArray = ext.split(".");
    const allowedSubExtensions = subextensions.split(",");
    console.log("extArray: ", extArray.join("|"));
    if (extArray.length > 1 && allowedSubExtensions.length > 0) {
      console.log("allowedSubExtensions: ", allowedSubExtensions.join("|"));
      let currentSubExtensions = extArray.slice(0, extArray.length - 1);
      console.log("currentSubExtensions: ", currentSubExtensions.join("|"));
      currentSubExtensions = currentSubExtensions.filter(ext =>
        allowedSubExtensions.includes(ext)
      );
      console.log("currentSubExtensions: ", currentSubExtensions.join("|"));
      extArray = [...currentSubExtensions, extArray[extArray.length - 1]];
      console.log("extArray: ", extArray.join("|"));
    }

    const targetFolder = `Season ${seasonFormatted}`;
    return path.join(targetFolder, targetFileName + "." + extArray.join("."));
  }
}
