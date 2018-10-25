import * as axios from "axios";
import { createCompareFunction } from "../helpers/create-compare-function";

export interface Credentials {
  apikey: string;
  username: string;
  userkey: string;
}

export interface SeriesMeta {
  id: string;
  seriesName: string;
  overview: string;
}

export interface EpisodeMeta {
  absoluteNumber: number;
  airedEpisodeNumber: number;
  airedSeason: number;
  episodeName: string;
}

export class TheTvDbMetadataProvider {
  private authToken: string = "";
  private apiBaseUrl = "https://api.thetvdb.com/";

  constructor(private credentials: Credentials) {}

  public async loadSeriesMetadata(seriesSlugName: string) {
    this.authToken = await this.getAuthToken();
    const seriesMeta = await this.getSeriesMeta(seriesSlugName);
    console.log(seriesMeta.seriesName);
    console.log(seriesMeta.overview);
    const episodeMeta = await this.getAllEpisodesMeta(seriesMeta.id);
    const episodesWithNumbers = episodeMeta.filter(e => !!e.absoluteNumber);
    episodesWithNumbers.sort(
      createCompareFunction([{ sortBy: x => x.absoluteNumber }])
    );
    return episodesWithNumbers;
  }

  private async getAuthToken() {
    const response = await axios.default.post(
      this.apiBaseUrl + "login",
      this.credentials
    );
    const token: string = response.data.token;
    if (!token) {
      throw new Error("Can't get the auth token");
    }
    return token;
  }

  private async getSeriesMeta(seriesSlugName: string) {
    const response = await axios.default.get(
      this.apiBaseUrl + "search/series",
      {
        headers: { Authorization: "Bearer " + this.authToken },
        params: { slug: seriesSlugName }
      }
    );
    if (response.data.data.length != 1) {
      throw new Error("Fail to load series data");
    }
    const rawData = response.data.data[0];
    const seriesMeta: SeriesMeta = {
      id: rawData.id,
      overview: rawData.overview,
      seriesName: rawData.seriesName
    };
    return seriesMeta;
  }

  private async getEpisodesMetaByPage(seriesId: string, page: number = 1) {
    const response = await axios.default.get(
      this.apiBaseUrl + `series/${seriesId}/episodes`,
      {
        headers: { Authorization: "Bearer " + this.authToken },
        params: { page }
      }
    );
    if (!response.data.data) {
      throw new Error("Fail to load episodes data");
    }
    const episodeMetaArray: EpisodeMeta[] = [];
    for (const rawEpisodeData of response.data.data) {
      const episodeMeta: EpisodeMeta = {
        absoluteNumber: rawEpisodeData.absoluteNumber,
        airedEpisodeNumber: rawEpisodeData.airedEpisodeNumber,
        airedSeason: rawEpisodeData.airedSeason,
        episodeName: rawEpisodeData.episodeName
      };
      episodeMetaArray.push(episodeMeta);
    }
    return {
      episodes: episodeMetaArray,
      last: response.data.links.last as number
    };
  }

  private async getAllEpisodesMeta(seriesId: string) {
    const allEpisodes: EpisodeMeta[] = [];
    const firstPageData = await this.getEpisodesMetaByPage(seriesId, 1);
    allEpisodes.push(...firstPageData.episodes);

    if (firstPageData.last > 1) {
      const promises = [];
      for (let pageIndex = 2; pageIndex < firstPageData.last; ++pageIndex) {
        promises.push(this.getEpisodesMetaByPage(seriesId, pageIndex));
      }
      const allPages = await Promise.all(promises);
      for (const pageData of allPages) {
        allEpisodes.push(...pageData.episodes);
      }
    }

    return allEpisodes;
  }
}
