import axios from "axios";

// YouTube APIからの検索結果の型定義
export type YoutubeApiResponse = {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeChannel[];
};

// YouTubeチャンネルの型定義
export type YoutubeChannel = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    channelId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
};

// YouTube動画の型定義
export type YoutubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: {
      url: string;
      width: number;
      height: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
    };
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
  channelTitle: string;
  liveBroadcastContent: string;
  publishedAt: string;
};

export default class YoutubeUtil {
  static async searchChannelByKeyword(
    keyword: string,
  ): Promise<YoutubeChannel> {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(keyword)}&key=${apiKey}`;
    const response = await axios.get(url);
    const items = response.data.items;
    return items;
  }

  static async getRandomVideoFromChannel(
    channelId: string,
    year?: number,
  ): Promise<YoutubeVideo> {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    const playlistUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const playlistResponse = await axios.get(playlistUrl);
    const playlistId =
      playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    let videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
    const videosResponse = await axios.get(videosUrl);
    let videoItems = videosResponse.data.items;

    if (year) {
      const startDate = `${year}-01-01T00:00:00Z`;
      const endDate = `${year}-12-31T23:59:59Z`;
      videosUrl += `&publishedAfter=${encodeURIComponent(startDate)}&publishedBefore=${encodeURIComponent(endDate)}`;
      const filteredVideosResponse = await axios.get(videosUrl);
      videoItems = filteredVideosResponse.data.items;
    }

    if (videoItems.length === 0) {
      throw new Error("No videos found for the specified year.");
    }

    const videoItem =
      videoItems[Math.floor(Math.random() * videoItems.length)].snippet;

    return {
      id: videoItem.resourceId.videoId,
      title: videoItem.title,
      description: videoItem.description,
      thumbnails: videoItem.thumbnails,
      channelTitle: videoItem.channelTitle,
      liveBroadcastContent: videoItem.liveBroadcastContent,
      publishedAt: videoItem.publishedAt,
    };
  }
}
