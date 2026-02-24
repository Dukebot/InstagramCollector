const InstagramScraperAPI2Client = require("./client")
const InstagramScraperAPI2ResponseProcessor = require("./response_processor")

/**
 * Servicio para interactuar con el scraper de Instagram de Rapid API.
 */
class InstagramScraperAPI2Service {
  constructor({ apiKey }) {
    /**
     * Cliente para instaractuar con Instagram a través de Rapid API.
     */
    this.client = new InstagramScraperAPI2Client({ apiKey })
    /**
     * Procesador de respuestas para formato unificado.
     */
    this.responseProcessor = InstagramScraperAPI2ResponseProcessor
  }

  // USER INFO

  async getUserInfo(usernameOrIdOrUrl) {
    const response = await this.getRawUserInfo(usernameOrIdOrUrl)
    return this.responseProcessor.processUserInfoResponse(response)
  }

  async getRawUserInfo(usernameOrIdOrUrl) {
    return this.client.getUserInfo(usernameOrIdOrUrl)
  }

  // USER POSTS

  async getUserPosts(usernameOrIdOrUrl) {
    const response = await this.getRawUserPosts(usernameOrIdOrUrl)
    return this.responseProcessor.processUserPostsResponse(response)
  }

  async getRawUserPosts(usernameOrIdOrUrl) {
      return this.client.getUserPosts(usernameOrIdOrUrl)
  }
}

module.exports = InstagramScraperAPI2Service
