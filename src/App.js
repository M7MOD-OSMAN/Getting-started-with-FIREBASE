import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://react-max-post-request-default-rtdb.firebaseio.com/movies.json"
      );
      console.log(response);
      if (!response.status === 200) {
        throw new Error("Something went wrong!");
      }
      // const data = await response.json();
      const loadedMovies = [];
      console.log(response.data);
      for (const key in response.data) {
        loadedMovies.push({
          id: key,
          title: response.data[key].title,
          openingText: response.data[key].openingText,
          releaseDate: response.data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   fetchMoviesHandler();
  // }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    console.log(movie);
    const response = await axios.post(
      "https://react-max-post-request-default-rtdb.firebaseio.com/movies.json",
      movie
    );
    console.log(response);
    // const data = await response.json();
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
