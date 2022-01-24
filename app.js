const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initialiseDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};
initialiseDBAndServer();
app.get("/movies/", async (request, response) => {
  const getMoviesDataQuery = `SELECT * FROM movie;`;
  const moviesList = await db.all(getMoviesDataQuery);
  response.send(moviesList);
});
app.post("/movies/", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;
  const addmoviesDataQuery = `INSERT INTO movie(director_id,movie_name,lead_actor) VALUES(${director_id},${movie_name},${lead_actor});`;
  const addmovieData = await db.run(addmoviesDataQuery);
  const movieId = addmovieData.lastID;
  response.send("Movie Successfully Added");
});
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieDataQuery = `SELECT * FROM movie WHERE movie_id=${movieId};`;
  const movie = await db.all(getMovieDataQuery);
  response.send(movie);
});
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const addMovieDataQuery = `UPDATE movie SET movie_id=${movieId},
    director_id=${directorId},movie_name=${movieName},
    lead_actor=${leadActor})  movie.director_id=director.director_id;`;
  const addMovieData = await db.run(addMovieDataQuery);

  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deletemovieDataQuery = `DELETE FROM movie WHERE movie_id=${movieId};`;
  const deletedMovie = await db.run(deletemovieDataQuery);
  response.send("Movie Removed");
});
app.get("/directors/", async (request, response) => {
  const getDirectorsDataQuery = `SELECT * FROM director;`;
  const directorsList = await db.all(getDirectorsDataQuery);
  response.send(directorsList);
});
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesDataQuery = `SELECT * FROM director JOIN movie ON 
    movie.director_id=director.director_id WHERE director_id=${directorId};`;
  const moviesArray = await db.all(getMoviesDataQuery);
  response.send(moviesArray);
});
module.exports = app;
