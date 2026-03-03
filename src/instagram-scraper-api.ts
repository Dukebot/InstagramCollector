import InstagramScraperAPI2Service from './instagram_scraper_api2';

export default class InstagramScraperAPI {
  private service: InstagramScraperAPI2Service;

  static fromEnv(): InstagramScraperAPI {
    return new InstagramScraperAPI({
      apiKey: process.env.API_KEY,
    });
  }

  constructor({ apiKey }: { apiKey?: string }) {
    this.service = new InstagramScraperAPI2Service({ apiKey });
  }

  async getUserInfo(usernameOrId: string): Promise<unknown> {
    return this.service.getUserInfo(usernameOrId);
  }

  async getUserPosts(usernameOrId: string, numPosts?: number): Promise<unknown> {
    return this.service.getUserPosts(usernameOrId, numPosts);
  }
}
