import { Strategy as SpotifyStrategy } from 'passport-spotify';
import config from '../config/keys';

export default new SpotifyStrategy({
  ...config.spotify,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { accessToken, refreshToken, profile });
});
