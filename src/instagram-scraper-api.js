const fs = require('fs')
const InstagramScraperAPI2Service = require("./instagram_scraper_api2")

/**
 * Servicio para extraer datos de Instagram.
 */
class InstagramScraperAPI {
  static fromEnv() {
    return new InstagramScraperAPI({
      apiKey: process.env.API_KEY
    })
  }

  constructor({ apiKey, logInfoFn }) {
    if (logInfoFn && typeof logInfoFn !== "function") {
      throw Error("logInfoFn must be a function")
    }
    this.service = new InstagramScraperAPI2Service({ apiKey })
    this.logInfoFn = logInfoFn
  }

  logInfo(message, data) {
    if (this.logInfoFn) {
      this.logInfoFn(message, data)
    } else {
      console.log("InstagramScraperAPIService", message, data)
    }
  }

  saveJson(path, data) {
    if (!path.endsWith('.json')) path += '.json'
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
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
