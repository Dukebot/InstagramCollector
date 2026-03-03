import InstagramScraperAPI2Service from './instagram_scraper_api2';

/**
 * Low-level scraper API facade.
 *
 * Wraps the underlying RapidAPI service implementation and exposes
 * normalized methods used by higher-level collectors.
 */
export default class InstagramScraperAPI {
  private service: InstagramScraperAPI2Service;

  /**
   * Creates an instance using `process.env.API_KEY`.
   */
  static fromEnv(): InstagramScraperAPI {
    return new InstagramScraperAPI({
      apiKey: process.env.API_KEY,
    });
  }

  constructor({ apiKey }: { apiKey?: string }) {
    this.service = new InstagramScraperAPI2Service({ apiKey });
  }

  /**
   * Fetches normalized profile information for a username/id.
   */
  async getUserInfo(usernameOrId: string): Promise<unknown> {
    return this.service.getUserInfo(usernameOrId);
  }

  /**
   * Fetches normalized posts for a username/id.
   */
  async getUserPosts(usernameOrId: string, numPosts?: number): Promise<unknown> {
    return this.service.getUserPosts(usernameOrId, numPosts);
  }
}
