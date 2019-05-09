import 'dotenv/config';
import './config/passport';

import express from 'express';
import fetch from 'node-fetch';
import passport from 'passport';
import { Curl } from 'node-libcurl';


import logger from 'console';
import querystring from 'querystring';

import config from './config/keys';
import { resolve } from 'url';

const app = express();
const PORT = process.env.PORT || config.PORT;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(passport.initialize());
app.use(express.static(__dirname + '/assets'))
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  return res.render('home');
});

app.get('/auth/spotify', passport.authenticate('spotify', {
  scope: ['user-read-playback-state', 'user-read-private', 'streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private'],
  showDialog: true
}));

app.get('/player', passport.authenticate('spotify', { session: false }), (req, res) => {
  const { accessToken, refreshToken } = req.user;
  return res.render('player', { accessToken, refreshToken });
});

app.post('/get_token', async (req, res) => {
  const curl = new Curl();
  const { refresh_token } = req.body;
  const grant_type = 'refresh_token';
  const tokenURI = 'https://accounts.spotify.com/api/token';
  const appCredentials = `${config.spotify.clientID}:${config.spotify.clientSecret}`;
  const appCredentialsB64 = Buffer.from(appCredentials).toString('base64');

  // Using Curl because fetch won't work for some weird reason
  curl.setOpt(Curl.option.URL, tokenURI);
  curl.setOpt('FOLLOWLOCATION', true);
  curl.setOpt(Curl.option.POSTFIELDS, querystring.stringify({ grant_type, refresh_token }));
  curl.setOpt(Curl.option.HTTPHEADER, [`Authorization: Basic ${appCredentialsB64}`])
  curl.setOpt(Curl.option.VERBOSE, true);

  curl.on('end', (statusCode, body, headers) => {
    if (statusCode === 200)
      return res.status(200)
        .json(JSON.parse(body));
  curl.close();
});
curl.perform();
});

app.listen(PORT, () => logger.log(`Listening for request on ${PORT}`));
