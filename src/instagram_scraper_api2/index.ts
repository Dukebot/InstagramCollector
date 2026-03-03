import InstagramScraperAPI2Client from './client';
import InstagramScraperAPI2ResponseProcessor from './response_processor';

/**
 * Service layer for `instagram-scraper-api2`.
 *
 * This class combines the raw HTTP client with response normalization.
 */
export default class InstagramScraperAPI2Service {
  private client: InstagramScraperAPI2Client;
  private responseProcessor: typeof InstagramScraperAPI2ResponseProcessor;

  constructor({ apiKey }: { apiKey?: string }) {
    this.client = new InstagramScraperAPI2Client({ apiKey });
    this.responseProcessor = InstagramScraperAPI2ResponseProcessor;
  }

  /**
   * Fetches and normalizes profile information.
   */
  async getUserInfo(usernameOrIdOrUrl: string): Promise<unknown> {
    const response = await this.getRawUserInfo(usernameOrIdOrUrl);
    return this.responseProcessor.processUserInfoResponse(response);
  }

  /**
   * Fetches raw profile response from the provider.
   */
  async getRawUserInfo(usernameOrIdOrUrl: string): Promise<unknown> {
    return this.client.getUserInfo(usernameOrIdOrUrl);
  }

  /**
   * Fetches and normalizes posts, optionally limiting the result size.
   */
  async getUserPosts(usernameOrIdOrUrl: string, numPosts?: number): Promise<unknown> {
    const response = await this.getRawUserPosts(usernameOrIdOrUrl);
    const posts = this.responseProcessor.processUserPostsResponse(response);

    if (typeof numPosts === 'number' && numPosts >= 0) {
      return posts.slice(0, numPosts);
    }

    return posts;
  }

  /**
   * Fetches raw posts response from the provider.
   */
  async getRawUserPosts(usernameOrIdOrUrl: string): Promise<unknown> {
    return this.client.getUserPosts(usernameOrIdOrUrl);
  }
}
