import axios, { type AxiosInstance } from 'axios';

/**
 * HTTP client for the `instagram-scraper-api2` RapidAPI endpoints.
 */
export default class InstagramScraperAPI2Client {
  private client: AxiosInstance;

  constructor({ apiKey }: { apiKey?: string }) {
    if (!apiKey) throw new Error('apiKey is required');

    const baseURL = 'https://instagram-scraper-api2.p.rapidapi.com/';
    const apiHost = 'social-api4.p.rapidapi.com';

    this.client = axios.create({
      baseURL,
      headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey,
      },
    });
  }

  /**
   * Performs a GET request and normalizes scraper-level API errors.
   */
  async get(url: string, options?: Record<string, unknown>): Promise<any> {
    try {
      const response = await this.client.get(url, options).then((res) => res.data);
      if (response.status === 'error') {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error('InstagramScraperAPIClient get ERROR: error.response.data', error.response.data);
      }
      throw new Error(error.message);
    }
  }

  /**
   * Fetches raw profile data by username, id, or profile URL.
   */
  async getUserInfo(usernameOrIdOrUrl: string): Promise<any> {
    if (!usernameOrIdOrUrl) throw new Error('username_or_id_or_url is required');
    return this.get('/v1/info', {
      params: { username_or_id_or_url: usernameOrIdOrUrl },
    });
  }

  /**
   * Fetches raw post feed data by username, id, or profile URL.
   */
  async getUserPosts(usernameOrIdOrUrl: string): Promise<any> {
    if (!usernameOrIdOrUrl) throw new Error('username_or_id_or_url is required');
    return this.get('/v1.2/posts', {
      params: { username_or_id_or_url: usernameOrIdOrUrl },
    });
  }
}
