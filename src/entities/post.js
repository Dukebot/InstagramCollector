const Location = require("./location")

class Post {
  constructor({
    pk = null,
    id = null,
    fbId = null,
    mediaId = null,
    code = null,
    title = null,
    text = null,
    externalUrl = null,
    takenAt = null,
    date = null,
    time = null,
    location = null,
    socialNetwork = "Instagram",
    user = {},
    // accountUsername = null,
    // accountId = null,
    likeCount = null,
    commentCount = null,
    images = [],
    videos = [],
  }) {
    this.pk = pk
    this.id = id
    this.fbId = fbId
    this.mediaId = mediaId
    this.code = code
    this.user = user.id ? { id: user.id, username: user.username } : null,
    this.title = title
    this.text = text
    this.externalUrl = externalUrl
    this.takenAt = takenAt
    this.date = date
    this.time = time
    this.location = location ? new Location(location) : null
    this.socialNetwork = socialNetwork
    // this.accountUsername = accountUsername
    // this.accountId = accountId
    this.likeCount = likeCount
    this.commentCount = commentCount
    this.images = images
    this.videos = videos
  }
}

module.exports = Post
