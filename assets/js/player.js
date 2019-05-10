const updatePlayingData = (artwork, artistsName, trackName) => {
  document.getElementById('artwork').src = artwork;
  document.getElementById('artistName').innerText = artistsName;
  document.getElementById('trackName').innerText = trackName;

}

const getAuthToken = (refresh_token) => {
  return new Promise((resolve, reject) => {
    try {
      fetch('/get_token', { method: 'post', refresh_token })
        .then(response => response.json())
        .then(responseJSON => resolve(responseJSON))
    } catch (err) {
      return reject(new Error('Unable to get new token'));
    }
  });
}

//window.location.search

window.addEventListener('DOMContentLoaded', (event) => {
  const { access_token, refresh_token } = window.sessionStorage;
  const { protocol, hostname, pathname, search } = window.location;

  const authCode = search.split('=')[1];
  const redirect_uri = `${protocol}//${hostname}${pathname}`;


  console.log('grant', authCode);
  console.log('redirect_uri', redirect_uri);
  console.log('access', access_token);
  console.log('refresh', refresh_token);

  console.log('DOM is fully loaded');

  window.onSpotifyWebPlaybackSDKReady = () => {
    // You can now initialize Spotify.Player and use the SDK
    console.log('Sdk ready')
    const token = access_token;

    const player = new Spotify.Player({
      name: 'Olawale',
      token,
      getOAuthToken: callback => {
        callback(token);
        //callback(getAuthToken(refresh_token))
      },
      volume: 0.5
    });

    player.on('initialization_error', ({ message }) => {
      console.error('Failed to initialize', message);
    });

    player.on('authentication_error', ({ message }) => {
      console.error('Failed to authenticate', message);
    });

    player.on('playback_error', ({ message }) => {
      console.error('Failed to perform playback', message);
    });

    player.addListener('ready', ({ device_id }) => {
      console.log('The Web Playback SDK is ready to play music!');
      console.log('Device ID', device_id);
    });

    player.addListener('player_state_changed', ({
      position,
      duration,
      track_window: { current_track }
    }) => {
      const { name, artists, album } = current_track;

      const artWork = album.images[2].url;
      const allArtists = artists.map(artist => artist.name).join(', ').replace(/(.+),$/, '$1');

      console.log('trackName', name);
      console.log('artWork', artWork);
      console.log('allArtists', allArtists);

      updatePlayingData(artWork, allArtists, name);
    });

    player.connect().then(success => {
      if (success)
        console.log('Successful connection')
    })
  };
});
