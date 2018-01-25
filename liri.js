var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fse = require("fs-extra")
var keys = require("./keys.js");
var twt = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys)
var ombdKey = keys.ombdAPIkeys
var song = ""
var separator = ">>>>"
var wrap = "*************************************"

var command = process.argv[2]

if (command === "my-tweets") {
  callTweets()
} else if (command === "spotify-this-song") {
  song = process.argv[3]
  if (song === undefined) {
    song = "The Sign"
    callSpotify(song)
  } else {
    callSpotify(song)
  }

} else if (command === "movie-this") {
  var movieName = process.argv[3]
  callMovie(movieName)
} else if (command === "do-what-it-says") {
  fse.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    command = dataArr[0]
    var value = dataArr[1]
    callSpotify(value)

  });
} else {
  console.log("");
  console.log(">>>>>>>>>>>>>>>>>>>>>>>")
  console.log("");
  console.log("Invalid input. Try: ")
  console.log("To get my tweets >>>>>>>>>>>>>>>>>>>>> node liri my-tweets ")
  console.log("To get information about the song >>>> node liri spotify-this-song 'Let it Snow'")
  console.log("To get information about the movie >>> node liri movie-this 'harry potter'")
  console.log("")
  console.log("Note, name of the song or the movie showld be in quotes")
  console.log("");
  console.log(">>>>>>>>>>>>>>>>>>>>>>>")
  console.log("");
}

function saveOutput(entry) {

  fse.appendFile("log.txt", entry + "\r\n", function(err){
    if(err) {
      console.log("could not append new data, because ", err)
    }
  }); // end of appendFile
}

function callMovie(movieName) {

  var urlOMDB = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + ombdKey
  request(urlOMDB , function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      var title = JSON.parse(body).Title
      var year = JSON.parse(body).Year
      var imdbRt = JSON.parse(body).imdbRating
      var rotTomRt = JSON.parse(body).Ratings[1].Value
      var country = JSON.parse(body).Country
      var language = JSON.parse(body).Language
      var plot = JSON.parse(body).Plot
      var actors = JSON.parse(body).Actors
      console.log("");
      console.log("Title of the movie >>>>>>>>>>>>>>>>>>>>>>> " + title);
      console.log("Year the movie came out >>>>>>>>>>>>>>>>>> " + year);
      console.log("IMDB Rating of the movie >>>>>>>>>>>>>>>>> " + imdbRt);
      console.log("Rotten Tomatoes Rating of the movie >>>>>> " + rotTomRt);
      console.log("Country where the movie was produced >>>>> " + country);
      console.log("Language of the movie >>>>>>>>>>>>>>>>>>>> " + language);
      console.log("Plot of the movie >>>>>>>>>>>>>>>>>>>>>>>> " + plot);
      console.log("Actors in the movie >>>>>>>>>>>>>>>>>>>>>> " + actors);
      console.log("");
      var movieQuery = wrap + " node liri movie-this " + "'" + movieName + "' " + wrap
      saveOutput(movieQuery)
      var movieInfo = {
        "Title": title,
        "Year": year,
        "IMDB Rating": imdbRt,
        "Rotten Tomatoes Rating": rotTomRt,
        "Country": country,
        "Language": language,
        "Plot": plot,
        "Actors": actors
      }
      //var infoLine = ""
      saveOutput(separator)
      for (var line in movieInfo) {
        var infoLine = line + " : " + movieInfo[line]
        saveOutput(infoLine)
      }
      saveOutput(separator)

    } else {
      console.log(error)
    }
  });
}



function callSpotify(song) {

  var optionsSpotify = {
    type: 'track',
    query: song,
    limit: 1
  }

  spotify.search(optionsSpotify, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var tracksArray = data.tracks.items

    var querySong = wrap + " node liri spotify-this-song " + "'" + song + "' " + wrap
    saveOutput(querySong)
    tracksArray.forEach(function(track) {
      var artistName = track.album.artists[0].name
      var trackName = track.name
      var albumName = track.album.name
      var songUrl = track.album.external_urls.spotify
      console.log("");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>")
      console.log("");
      console.log("Name of the artist >> ", artistName);
      console.log("Name of the song   >> ", trackName);
      console.log("Name of the album  >> ", albumName);
      console.log("External url       >> ", songUrl);
      saveOutput(separator)
      var arrayOfSongInfo = [artistName, trackName, albumName, songUrl]
      arrayOfSongInfo.forEach(function(infoSongLine) {

        saveOutput(infoSongLine)
      })
    })
    saveOutput(separator)
    console.log("");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>")
    console.log("");

    //console.log(data);
  });

}; // end of call spotify function


function callTweets() {

  var paramsTwitter = {
    screen_name: 'tvorozhokjs',
    count: 20
  }

  twt.get('statuses/user_timeline', paramsTwitter, function(error, tweets, response) {
    if(error) console.log(error);
    var queryTweets = wrap + " node liri my-tweets " + wrap
    saveOutput(queryTweets)
    tweets.forEach(function(tweet) {
      var date = tweet.created_at
      var twtText = tweet.text
      console.log("");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>")
      console.log("");
      console.log("Created at >>> ", date)
      console.log(twtText)
      saveOutput(separator)
      var dateWriteIntoFile = "Created at" + " : " + date
      var textWriteIntoFile = "Tweet" + " : " + twtText
      saveOutput(dateWriteIntoFile)
      saveOutput(textWriteIntoFile)

    })
    saveOutput(separator)
    console.log("");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>")
    console.log("");

  });

}; // end of call tweets  function
