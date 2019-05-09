export default {
  PORT: 4002,
  hostName: process.env.HOST_NAME,
  spotify: {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: '/player',
  }
}
