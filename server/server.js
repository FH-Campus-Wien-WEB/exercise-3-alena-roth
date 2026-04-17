const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) { // doing this removed the 404 error at bottom of index.html
  // to-dos: get genres from movies in movie-model -- sort alphabetically
  let movies = Object.values(movieModel);
  let genreSet = new Set(); // Set removes duplicates automatically
  movies.forEach(movie => { // Loop nested --> for movies with several genres, for each movie iterate through its genres
    movie.Genres.forEach(genre => {
      genreSet.add(genre);
    })
  })
  let genres = Array.from(genreSet).sort(); // Set and JSON don't get along; .sort for alphabetically
  res.send(genres);
})


/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel)
  res.send(movies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel

  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)
  }
})

app.put('/movies/:imdbID', function (req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }

})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
