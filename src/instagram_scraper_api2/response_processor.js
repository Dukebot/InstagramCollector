const moment = require("moment")

// Estas entidades nos ayudan a unificar en un formato estándar los diferentes formatos de Instagram
const { User, Post } = require("../entities")

/**
 * Esta clase se encarga de procesar la respuesta de los posts extraidos con Instaloader.
 */
class InstagramScraperAPI2ResponseProcessor {
  static processUserInfoResponse(response) {
    return transformUser(response.data)
  }

  static processUserPostsResponse(response) {
    const posts = response.data.items.map(transformPost)
    return posts
  }
}

function transformUser(user) {
  return new User({
    otherId: user.id,
    name: user.full_name,
    username: user.username,
    biography: user.biography,
    externalUrl: user.external_url,
  })
}

function transformPost(post) {
  const getImageUrlFromImageVersions = () => post.image_versions.items[0].url
  const getVideoUrlFromVideoVersions = () => (post.video_versions ? post.video_versions[0].url : null)
  const urlToMediaObject = url => ({ url, caption: null })

  function transformLocation() {
    const location = post.location
    if (!location) {
      return null
    }
    return {
      pk: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    }
  }

  function getDate() {
    if (!post.taken_at) return null
    const dateTime = timestampToDateString(post.taken_at)
    const dateTimeParts = dateTime.split(" ")
    return dateTimeParts[0]
  }

  function getTime() {
    if (!post.taken_at) return null
    const dateTime = timestampToDateString(post.taken_at)
    const dateTimeParts = dateTime.split(" ")
    return dateTimeParts[1]
  }

  return new Post({
    pk: post.id,
    id: post.id,
    fbId: post.fbid,
    code: post.code,

    text: post.caption ? post.caption.text : null,

    takenAt: post.taken_at ? +post.taken_at : null,
    date: getDate(),
    time: getTime(),

    location: transformLocation(),

    accountUsername: post.user.username,
    accountId: post.user.id,

    likeCount: post.like_count,
    commentCount: post.comment_count,

    images: [getImageUrlFromImageVersions()].filter(i => !!i).map(urlToMediaObject),
    videos: [getVideoUrlFromVideoVersions()].filter(v => !!v).map(urlToMediaObject),
  })
}

function timestampToDateString(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
  return moment.unix(timestamp).format(format)
}

module.exports = InstagramScraperAPI2ResponseProcessor
