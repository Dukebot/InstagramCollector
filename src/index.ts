import InstagramScraperAPI from './instagram-scraper-api';
import InstagramCollector from './instagram-collector';
import * as utils from './utils';
import * as entities from './entities';

/**
 * Public package exports.
 *
 * - `InstagramScraperAPI`: low-level API wrapper.
 * - `InstagramCollector`: high-level batch collector with optional file cache.
 * - `utils`: utility helpers.
 * - `entities`: normalized domain entities.
 */
export {
  InstagramScraperAPI,
  InstagramCollector,
  utils,
  entities,
};
