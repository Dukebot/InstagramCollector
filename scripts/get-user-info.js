const { InstagramScraperAPI, utils } = require('../src/index');

utils.loadDotenv();

// params
const USERNAME = process.env.INSTAGRAM_USERNAME;
const OUTPUT_PATH = (process.env.OUTPUT_PATH ?? 'output') + '/';
const RAW_RESPONSE = false;

const scraper = InstagramScraperAPI.fromEnv();

async function getUserInfo() {
  if (!RAW_RESPONSE) {
    const userInfo = await scraper.getUserInfo(USERNAME);
    console.log('userInfo', userInfo);
    utils.saveDataAsJson(OUTPUT_PATH + 'userInfo.json', userInfo);
  } else {
    const userInfoRaw = await scraper.service.getRawUserInfo(USERNAME);
    console.log('userInfoRaw', userInfoRaw);
    utils.saveDataAsJson(OUTPUT_PATH + 'userInfoRaw.json', userInfoRaw);
  }
}

getUserInfo();
