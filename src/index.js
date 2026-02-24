const InstagramScraperAPI2Service = require("./instagram_scraper_api2")

/**
 * Servicio para extraer datos de Instagram.
 */
class InstagramScraperAPI {
  constructor({ apiHost, apiKey, logInfoFn }) {
    if (logInfoFn && typeof logInfoFn !== "function") {
      throw Error("logInfoFn must be a function")
    }
    this.service = new InstagramScraperAPI2Service({ apiHost, apiKey })
    this.logInfoFn = logInfoFn
  }

  logInfo(message, data) {
    if (this.logInfoFn) {
      this.logInfoFn(message, data)
    } else {
      console.log("InstagramScraperAPIService", message, data)
    }
  }

  async getUserInfo(usernameOrId) {
    this.logInfo("getUserInfo", { usernameOrId })
    return this.service.getUserInfo(usernameOrId)
  }

  async getUserPosts(usernameOrId, numPosts) {
    this.logInfo("getUserPosts", { usernameOrId, numPosts })
    return this.service.getUserPosts(usernameOrId, numPosts)
  }
}

module.exports = InstagramScraperAPI
