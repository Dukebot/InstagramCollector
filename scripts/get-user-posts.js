const { InstagramScraperAPI, utils } = require('../src/index');

utils.loadDotenv();

// params
const USERNAME = process.env.INSTAGRAM_USERNAME;
const OUTPUT_PATH = (process.env.OUTPUT_PATH ?? 'output') + '/';
const RAW_RESPONSE = false;

const scraper = InstagramScraperAPI.fromEnv();

async function getUserInfo() {
  if (!RAW_RESPONSE) {
    const userPosts = await scraper.getUserPosts(USERNAME);
    console.log('userPosts', userPosts);
    utils.saveDataAsJson(OUTPUT_PATH + 'userPosts.json', userPosts);
  } else {
    const userPostsRaw = await scraper.service.getRawUserPosts(USERNAME);
    console.log('userPostsRaw', userPostsRaw);
    utils.saveDataAsJson(OUTPUT_PATH + 'userPostsRaw.json', userPostsRaw);
  }
}

getUserInfo();