// At the top of the `liri.js` file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();
var Spotify = require('node-spotify-api');

// from instructions: Add the code required to import the `keys.js` file and store it in a variable.
var keys = require("./keys.js");

//pull in other dependencies
var axios = require("axios");
var moment = require("moment");

// var moment = require("moment");
// var fs = require("fs");

// this allows us to access our API key info
var spotify = new Spotify(keys.spotify);

var command = process.argv[2]
var input = process.argv[3]

// Case statement so liri.js can take in one of the following commands:
// `concert-this`
// `spotify-this-song`
// `movie-this`
// `do-what-it-says`
switch (command) {
    case 'spotify-this-song':
        runSpotify();
        break;

    case 'concert-this':
        runConcertThis();
        break;

    case 'movie-this':
        runMovieThis();
        break;

    case 'do-what-it-says':
        runDoWhatItSays();
        break;

    default:
        console.log("Please enter a valid command")
}

//SPOTIFY function--------------------------------------
// `node liri.js spotify-this-song '<song name here>'`

function runSpotify() {
    var query = input || "The Sign Ace of Base";
    // input ? input : "The Sign" ternary operator option 
    //use spotify search from spotify API documentation
    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist: " + data.tracks.items[0].album.artists[0].name); //populates with ARTIST
        console.log("Song name: " + data.tracks.items[0].name); //populate with SONG NAME
        console.log("Song preview link: " + data.tracks.items[0].preview_url); //populate with PREVIEW LINK
        console.log("Album: " + data.tracks.items[0].album.name); //populate with SONG ALBUM

    });
}

//BANDSINTOWN function--------------------------------------
//`node liri.js concert-this <artist/band name here>`

function runConcertThis() {
    var concertArtist = input || "please enter a valid artist";
    var concertQueryURL = "https://rest.bandsintown.com/artists/" + concertArtist + "/events?app_id=codingbootcamp";

    axios.get(concertQueryURL).then(
        function (response) {
            //console log out data if response IS NOT undefined
            if (response.data[0].venue != undefined) {
                // console.log(response.data)
                console.log("Name of venue: " + response.data[0].venue.name);
                console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
                var dateTime = moment(response.data[0].datetime);
                console.log("Date of the Event: " + dateTime.format("dddd, MMMM Do YYYY"));
            }
            else {
                console.log("No results found.");
            }
        }
    ).catch(function (error) {
        console.log(error);
    });
}

//OMDB--------------------------------------
// `node liri.js movie-this '<movie name here>'`

function runMovieThis() {
    var movieName = input || "Mr. Nobody";
    var movieQueryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    var message = "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/. It's on Netflix!";

    //need to figure out where to put this to render message corrently on if
    if (input === "") {
        movieName = 'Mr Nobody';
        console.log(message);
    }

    axios.get(movieQueryURL).then(
        function (response) {
            // console.log(response);
            console.log("Movie title: " + response.data.Title); // Title of the movie
            console.log("Release year: " + response.data.Year); //Year the movie came out
            console.log("IMDB movie rating: " + response.data.imdbRating); //IMDB Rating of the movie
            console.log("Rotten Tomatoes movie rating: " + response.data.Ratings[1].Value); //Rotten Tomatoes Rating of the movie
            console.log("Produced in: " + response.data.Country); //Country where the movie was produced.
            console.log("Movie language: " + response.data.Language); //Language of the movie
            console.log("Movie plot: " + response.data.Plot); //Plot of the movie
            console.log("Actors: " + response.data.Actors); //Actors in the movie.
        })
};