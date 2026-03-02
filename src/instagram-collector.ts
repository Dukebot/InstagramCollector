import path from 'path';
import InstagramScraperAPI from './instagram-scraper-api';
import FileCache from './utils/file-cache';

type UserInfoCallback = (userInfo: unknown) => Promise<void> | void;
type UserPostsCallback = (userPosts: unknown) => Promise<void> | void;

export default class InstagramCollector {
  private scraper: InstagramScraperAPI;
  private usernamesOrIds?: string[];
  private onUserInfo?: UserInfoCallback;
  private onUserPosts?: UserPostsCallback;
  private defaultForceRefresh: boolean;
  private cache: FileCache | null;
  private _cacheInitPromise: Promise<void> | null;

  constructor({
    apiKey,
    usernamesOrIds,
    onUserInfo,
    onUserPosts,
    cache,
  }: {
    apiKey?: string;
    usernamesOrIds?: string[];
    onUserInfo?: UserInfoCallback;
    onUserPosts?: UserPostsCallback;
    cache?: { enabled?: boolean; dir?: string; ttlMs?: number; forceRefresh?: boolean };
  }) {
    this.scraper = new InstagramScraperAPI({ apiKey });
    this.usernamesOrIds = usernamesOrIds;
    this.onUserInfo = onUserInfo;
    this.onUserPosts = onUserPosts;

    if (onUserInfo && typeof onUserInfo !== 'function') {
      throw new Error('onUserInfo must be a function');
    }

    if (onUserPosts && typeof onUserPosts !== 'function') {
      throw new Error('onUserPosts must be a function');
    }

    const cacheEnabled = Boolean(cache?.enabled);
    const cacheDir = cache?.dir || path.join(process.cwd(), '.cache', 'instagram-collector');
    const cacheTtlMs = typeof cache?.ttlMs === 'number' ? cache.ttlMs : 5 * 60 * 1000;

    this.defaultForceRefresh = Boolean(cache?.forceRefresh);

    this.cache = cacheEnabled ? new FileCache({ dir: cacheDir, defaultTtlMs: cacheTtlMs }) : null;
    this._cacheInitPromise = this.cache ? this.cache.init() : null;
  }

  private async _ensureCacheReady(): Promise<void> {
    if (this._cacheInitPromise) {
      await this._cacheInitPromise;
    }
  }

  async collectUserInfo({
    usernamesOrIds = this.usernamesOrIds,
    onUserInfo = this.onUserInfo,
    useCache = true,
    forceRefresh = this.defaultForceRefresh,
  }: {
    usernamesOrIds?: string[];
    onUserInfo?: UserInfoCallback;
    useCache?: boolean;
    forceRefresh?: boolean;
  } = {}): Promise<unknown[]> {
    if (!Array.isArray(usernamesOrIds)) {
      throw new Error('usernamesOrIds must be an array');
    }

    if (onUserInfo && typeof onUserInfo !== 'function') {
      throw new Error('onUserInfo must be a function');
    }

    const shouldUseCache = Boolean(this.cache && useCache);
    if (shouldUseCache) {
      await this._ensureCacheReady();
    }

    const responses: unknown[] = [];
    for (const usernameOrId of usernamesOrIds) {
      const cacheKey = `instagram:user-info:${usernameOrId}`;

      const response = shouldUseCache
        ? await this.cache!.wrap(cacheKey, () => this.scraper.getUserInfo(usernameOrId), {
            force: forceRefresh,
          })
        : await this.scraper.getUserInfo(usernameOrId);

      if (typeof onUserInfo === 'function') {
        await onUserInfo(response);
      }
      responses.push(response);
    }
    return responses;
  }

  async collectUserPosts({
    usernamesOrIds = this.usernamesOrIds,
    numPosts,
    onUserPosts = this.onUserPosts,
    useCache = true,
    forceRefresh = this.defaultForceRefresh,
  }: {
    usernamesOrIds?: string[];
    numPosts?: number;
    onUserPosts?: UserPostsCallback;
    useCache?: boolean;
    forceRefresh?: boolean;
  } = {}): Promise<unknown[]> {
    if (!Array.isArray(usernamesOrIds)) {
      throw new Error('usernamesOrIds must be an array');
    }

    if (onUserPosts && typeof onUserPosts !== 'function') {
      throw new Error('onUserPosts must be a function');
    }

    const shouldUseCache = Boolean(this.cache && useCache);
    if (shouldUseCache) {
      await this._ensureCacheReady();
    }

    const responses: unknown[] = [];
    for (const usernameOrId of usernamesOrIds) {
      const cacheKey = `instagram:user-posts:${usernameOrId}:numPosts:${numPosts ?? 'all'}`;

      const response = shouldUseCache
        ? await this.cache!.wrap(cacheKey, () => this.scraper.getUserPosts(usernameOrId, numPosts), {
            force: forceRefresh,
          })
        : await this.scraper.getUserPosts(usernameOrId, numPosts);

      if (typeof onUserPosts === 'function') {
        await onUserPosts(response);
      }
      responses.push(response);
    }
    return responses;
  }
}
