require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
    let artistQuery = req.query['artist-search']; //el valor de la busqueda acceder variable de get
    // console.log(artistQuery)
    spotifyApi
        .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/artistQuery)
        .then(data => {
            console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let artistObj = data.body.artists.items[0]
            let artistImg = artistObj.images[0].url
            let artistId = artistObj.id
            let artistName = artistObj.name
           
            // console.log(artistObj)
            // console.log(artistId)
            res.render('artist-search-results', {artistImg, artistName, artistId})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res,) => {
    let artistIdAlbum = req.params.artistId
    spotifyApi
        .getArtistAlbums(artistIdAlbum)
        .then(data => {
            let albumItems = data.body.items
            let albumArr = []
            for(let i=0; i<albumItems.length; i++){
                let albumName = albumItems[i].name
                let albumImg = albumItems[i].images[0].url
                let albumId = albumItems[i].id
                // console.log(albumName, albumImg, albumId)
                let albumObj = {albumName, albumImg, albumId}
                // console.log (albumName, albumImg, albumId)
                // return albumObj
                albumArr.push(albumObj);
            }

            res.render('albums', {albumArr})
        })


        .catch(err => console.log('The error while searching artists albums occurred: ', err));
});

// app.get('/albums/:artistId', (req, res,) => {
//     let artistIdAlbum = req.params.artistId
//     spotifyApi
//         .getArtistAlbums(artistIdAlbum)
//         .then(data => {
//             let albumItems = data.body.items
//             let albumImg = albumItems.images[0].url
//             let albumId = albumItems.id
//             let albumName = albumItems.name

//             // console.log(albumImg, albumName, albumId)

//             res.render('albums', {albumImg, albumId, albumName})
//         })


//         .catch(err => console.log('The error while searching artists albums occurred: ', err));
// });

// app.get('/tracks/:albumId', (req, res,) => {
//     let IdAlbum = req.params.albumId
//     spotifyApi
//         .getAlbumTracks(IdAlbum)
//         .then(data => {
//             let albumItems = data.body.items
//             let albumId = albumItems.id
//             let albumName = albumItems.name
//             let track = albumItems.preview_url
//             console.log(albumItems)
//             res.render('tracks', {track, albumId, albumName})
//         })


//         .catch(err => console.log('The error while searching tracks occurred: ', err));
// });


app.get('/albums/tracks/:albumId', (req, res,) => {
    let IdAlbum = req.params.albumId
    spotifyApi
        .getAlbumTracks(IdAlbum)
        .then(data => {
            let albumItems = data.body.items
            let trackArr = []
            for(let i=0; i<albumItems.length; i++){
                let albumName = albumItems[i].name
                let track = albumItems[i].preview_url
                let trackObj = {albumName, track}
                trackArr.push(trackObj);
            }
            // let albumId = albumItems.id
            
            console.log(trackArr)
            res.render('tracks', {trackArr})
        })


        .catch(err => console.log('The error while searching tracks occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
