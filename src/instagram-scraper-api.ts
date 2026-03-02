import InstagramScraperAPI2Service from './instagram_scraper_api2';

type LogInfoFn = (message: string, data?: unknown) => void;

export default class InstagramScraperAPI {
  private service: InstagramScraperAPI2Service;
  private logInfoFn?: LogInfoFn;

  static fromEnv(): InstagramScraperAPI {
    return new InstagramScraperAPI({
      apiKey: process.env.API_KEY,
    });
  }

  constructor({ apiKey, logInfoFn }: { apiKey?: string; logInfoFn?: LogInfoFn }) {
    if (logInfoFn && typeof logInfoFn !== 'function') {
      throw new Error('logInfoFn must be a function');
    }
    this.service = new InstagramScraperAPI2Service({ apiKey });
    this.logInfoFn = logInfoFn;
  }

  logInfo(message: string, data?: unknown): void {
    if (this.logInfoFn) {
      this.logInfoFn(message, data);
    } else {
      console.log('InstagramScraperAPIService', message, data);
    }
  }

  async getUserInfo(usernameOrId: string): Promise<unknown> {
    this.logInfo('getUserInfo', { usernameOrId });
    return this.service.getUserInfo(usernameOrId);
  }

  async getUserPosts(usernameOrId: string, numPosts?: number): Promise<unknown> {
    this.logInfo('getUserPosts', { usernameOrId, numPosts });
    return this.service.getUserPosts(usernameOrId, numPosts);
  }
}
