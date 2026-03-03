# @dukebot/instagram-collector

SDK to collect Instagram data (profile and posts) using an external scraper, with a high-level abstraction layer (`InstagramCollector`) and file-based cache support to reduce API calls.

## Installation

```bash
npm install @dukebot/instagram-collector
```

## Exports

- `InstagramScraperAPI`: low-level scraper client (profile/posts).
- `InstagramCollector`: high-level orchestration layer for batch collection (arrays of usernames/ids), callbacks, and cache.
- `utils`: helpers (`loadDotenv`, `saveDataAsJson`).
- `entities`: `User`, `Post`, `Location`.

---

## Quick Start

### ESM

```ts
import { InstagramCollector } from '@dukebot/instagram-collector';

const collector = new InstagramCollector({
  apiKey: process.env.API_KEY,
  usernamesOrIds: ['instagram'],
  cache: {
    enabled: true,
    dir: '.cache/instagram-collector',
    ttlMs: 10 * 60 * 1000,
    forceRefresh: false,
  },
});

const info = await collector.collectUserInfo({ useCache: true });
const posts = await collector.collectUserPosts({ numPosts: 3, useCache: true });
```

### CommonJS

```js
const { InstagramCollector } = require('@dukebot/instagram-collector');

const collector = new InstagramCollector({
  apiKey: process.env.API_KEY,
  usernamesOrIds: ['instagram'],
});

collector.collectUserInfo({ useCache: true }).then(console.log);
```

---

## Main API (`InstagramCollector`)

### Constructor

```ts
new InstagramCollector({
  apiKey,
  usernamesOrIds?,
  onUserInfo?,
  onUserPosts?,
  cache?: {
    enabled?: boolean,
    dir?: string,
    ttlMs?: number,
    forceRefresh?: boolean,
  }
})
```

### `collectUserInfo(options?)`

- Collects user info for an array of usernames/ids.
- Supports per-item callback (`onUserInfo`).
- Supports cache keys (`instagram:user-info:<usernameOrId>`).

### `collectUserPosts(options?)`

- Collects user posts.
- Supports limiting number of posts (`numPosts`).
- Supports per-item callback (`onUserPosts`).
- Supports cache keys (`instagram:user-posts:<usernameOrId>:numPosts:<N>`).

---

## Environment Variables (example)

In `.env`:

```env
API_KEY=your_rapid_api_key
INSTAGRAM_USERNAME=instagram

TEST_USERNAMES=instagram,nasa
TEST_NUM_POSTS=3
TEST_CACHE_DIR=.cache/instagram-collector-test
TEST_CACHE_TTL_MS=600000
TEST_FORCE_REFRESH=false
```

---

## Cache Test Script

Included in the repo:

```bash
npm run test:cache
```

This command:
1. Builds the package (`npm run build`)
2. Loads `.env`
3. Downloads user info and posts for configured accounts
4. Stores results in file-based cache

---

## Build & Publish

```bash
npm run typecheck
npm run build
npm pack --dry-run
```

Publish:

```bash
npm publish --access public
```

> The package is configured for dual output **ESM + CJS** and TypeScript declarations (`dist/index.mjs`, `dist/index.cjs`, `dist/index.d.ts`).