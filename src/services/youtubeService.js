import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/api';

class YouTubeService {
  constructor() {
    this.apiKey = API_KEYS.YOUTUBE;
    this.baseUrl = API_ENDPOINTS.YOUTUBE;
  }

  // Rechercher des vidéos
  async searchVideos(query, maxResults = 20, category = 'music') {
    try {
      const searchQuery = `${query} kpop ${category}`;
      
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          key: this.apiKey,
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults,
          order: 'relevance',
          videoCategoryId: '10' // Music category
        }
      });

      const videos = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));

      return { success: true, data: videos };
    } catch (error) {
      console.error('YouTube API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtenir les détails d'une vidéo
  async getVideoDetails(videoId) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          key: this.apiKey,
          part: 'snippet,statistics,contentDetails',
          id: videoId
        }
      });

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          success: true,
          data: {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high.url,
            channelTitle: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt,
            viewCount: video.statistics.viewCount,
            likeCount: video.statistics.likeCount,
            duration: video.contentDetails.duration
          }
        };
      }

      return { success: false, error: 'Video not found' };
    } catch (error) {
      console.error('YouTube API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Rechercher des Music Videos
  async searchMusicVideos(artist, maxResults = 20) {
    return this.searchVideos(`${artist} official mv`, maxResults, 'music video');
  }

  // Rechercher des performances live
  async searchLivePerformances(artist, maxResults = 20) {
    return this.searchVideos(`${artist} live performance`, maxResults, 'live');
  }

  // Rechercher des émissions
  async searchTVShows(artist, maxResults = 20) {
    return this.searchVideos(`${artist} show`, maxResults, 'variety');
  }

  // Obtenir les vidéos populaires K-pop
  async getTrendingKpop(maxResults = 20) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          key: this.apiKey,
          part: 'snippet,statistics',
          chart: 'mostPopular',
          regionCode: 'KR',
          videoCategoryId: '10',
          maxResults
        }
      });

      const videos = response.data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        viewCount: item.statistics.viewCount
      }));

      return { success: true, data: videos };
    } catch (error) {
      console.error('YouTube API Error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new YouTubeService();
