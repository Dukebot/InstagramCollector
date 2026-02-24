const axios = require('axios');

/**
 * Cliente para interacturar con "Instagram Scraper API 2" de Rapid API
 * https://rapidapi.com/social-api1-instagram/api/instagram-scraper-api2/playground/apiendpoint_59cb4f4c-55c0-41b5-807d-e39967e66c1d
 */
class InstagramScraperAPI2Client {
  constructor({ apiKey }) {
    if (!apiKey) throw Error('apiKey is required');

    this.baseURL = 'https://instagram-scraper-api2.p.rapidapi.com/';
    this.apiHost = 'social-api4.p.rapidapi.com';
    this.apiKey = apiKey;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'x-rapidapi-host': this.apiHost,
        'x-rapidapi-key': this.apiKey,
      },
    });
  }

  async get(url, options) {
    try {
      const response = await this.client.get(url, options).then((res) => res.data);
      if (response.status === 'error') {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('InstagramScraperAPIClient get ERROR: error.response.data', error.response.data);
      }
      throw Error(error.message);
    }
  }

  // USER INFO

  async getUserInfo(username_or_id_or_url) {
    if (!username_or_id_or_url) throw Error('username_or_id_or_url is required');
    return this.get('/v1/info', {
      params: { username_or_id_or_url },
    });
  }

  // USER POSTS

  async getUserPosts(username_or_id_or_url) {
    if (!username_or_id_or_url) throw Error('username_or_id_or_url is required');
    return this.get('/v1.2/posts', {
      params: { username_or_id_or_url },
    });
  }
}

module.exports = InstagramScraperAPI2Client;
