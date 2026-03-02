const path = require('path');
const dotenv = require('dotenv');
const { InstagramCollector } = require('../dist/index.cjs');

dotenv.config();

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseUsernames(value) {
  return String(value || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function main() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY is required');

  const usernamesOrIds = parseUsernames(process.env.TEST_USERNAMES || process.env.INSTAGRAM_USERNAME);
  if (!usernamesOrIds.length) {
    throw new Error('TEST_USERNAMES (comma separated) or INSTAGRAM_USERNAME is required');
  }

  const cacheDir = process.env.TEST_CACHE_DIR || path.join(process.cwd(), '.cache', 'instagram-collector-test');
  const cacheTtlMs = Number(process.env.TEST_CACHE_TTL_MS || 10 * 60 * 1000);
  const numPosts = Number(process.env.TEST_NUM_POSTS || 3);
  const forceRefresh = parseBoolean(process.env.TEST_FORCE_REFRESH, false);

  const collector = new InstagramCollector({
    apiKey,
    usernamesOrIds,
    cache: {
      enabled: true,
      dir: cacheDir,
      ttlMs: cacheTtlMs,
      forceRefresh,
    },
  });

  console.log('Running test download with cache...');
  console.log({ usernamesOrIds, cacheDir, cacheTtlMs, numPosts, forceRefresh });

  const userInfo = await collector.collectUserInfo({ usernamesOrIds, useCache: true });
  const userPosts = await collector.collectUserPosts({ usernamesOrIds, numPosts, useCache: true });

  console.log(`Downloaded user info: ${userInfo.length}`);
  console.log(`Downloaded user posts groups: ${userPosts.length}`);
  console.log('Done. Data stored in FileCache directory:', cacheDir);
}

main().catch((err) => {
  console.error('test-cache-download failed:', err.message);
  process.exit(1);
});
