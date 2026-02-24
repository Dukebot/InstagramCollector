
const Post = require("./post")

class User {
  constructor({
    otherId = null, // El ID de Instagram
    name = null, // full_name de Instagram
    username = null, // El nombre de usuario en Instagram
    biography = null, // El texto de la biografía del perfil
    externalUrl = null, // URL que haya en la cuenta (creo)
    socialNetwork = "Instagram",
    posts = [],
  }) {
    this.otherId = otherId
    this.name = name
    this.username = username
    this.biography = biography
    this.externalUrl = externalUrl
    this.socialNetwork = socialNetwork
    this.posts = posts.map(p => new Post(p)) 
  }
}

module.exports = User
