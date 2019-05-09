import passport from 'passport';

import SpotifyStrategy from '../passport/Spotify';

passport.use(SpotifyStrategy);

export default passport;
