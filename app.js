const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDb();

//API 1

app.get("/movies/", async (request, response) => {
  const query = `SELECT movie_name FROM movie`;
  const data = await db.all(query);
  let list = [];
  for (let i of data) {
    list.push({
      movieName: i.movie_name,
    });
  }
  response.send(list);
});

//API 2

app.post("/movies/", async (request, response) => {
  const body = request.body;
  const { director_id, movie_name, lead_actor } = body;
  const query = `INSERT INTO movie(director_id,movie_name,lead_actor)
   VALUES('${director_id}','${movie_name}','${lead_actor}')`;
  const data = await db.run(query);
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movie_id/", async (request, response) => {
  const { movie_id } = request.params;
  const query = `SELECT * FROM movie WHERE movie_id=${movie_id}`;
  const data = await db.get(query);
  const dataModified = {
    movieId: data.movie_id,
    directorId: data.director_id,
    movieName: data.movie_name,
    leadActor: data.lead_actor,
  };
  response.send(dataModified);
});

//API 4

app.put("/movies/:movie_id/", async (request, response) => {
  const { movie_id } = request.params;
  const details = request.body;
  const { director_id, movie_name, lead_actor } = details;
  const query = `UPDATE movie SET 
       director_id='${director_id}',
       movie_name='${movie_name}',
       lead_actor='${lead_actor}' 
       WHERE movie_id=${movie_id}`;
  const data = await db.run(query);
  response.send("Movie Details Updated");
});

//API 5

app.delete("/movies/:movie_id", async (request, response) => {
  const { movie_id } = request.params;
  const query = `DELETE FROM movie WHERE movie_id=${movie_id}`;
  await db.run(query);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  const query = `SELECT * FROM director`;
  const data = await db.all(query);
  let list = [];
  for (let i of data) {
    list.push({
      directorId: i.director_id,
      directorName: i.director_name,
    });
  }
  response.send(list);
});

//API 7

app.get("/directors/:director_id/movies/", async (request, response) => {
  const { director_id } = request.params;
  const query = `SELECT movie_name FROM movie WHERE director_id=${director_id}`;
  const data = await db.all(query);
  let list = [];
  for (let i of data) {
    list.push({
      movieName: i.movie_name,
    });
  }
  response.send(list);
});

module.exports = app;
