class InstagramUser {
  constructor({
    id = null,
    fullName = null,
    username = null,
    biography = null,
    externalUrl = null,
  }) {
    this.id = id
    this.fullName = fullName
    this.username = username
    this.biography = biography
    this.externalUrl = externalUrl
  }
}

module.exports = InstagramUser