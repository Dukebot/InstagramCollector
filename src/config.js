const dontenv = require('dotenv')

dontenv.config()

module.exports = {
    API_KEY: process.env.API_KEY,
}