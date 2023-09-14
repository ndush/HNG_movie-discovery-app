import React from "react";

function MovieDetails({ movie }) {
  console.log("Movie details received:", movie);
  if (!movie) {
    return <p>No movie details available.</p>;
  }

  const releaseDate = new Date(movie.release_date).toUTCString();

  return (
    <div>
      <h2 data-testid="movie-title">{movie.title}</h2>
      <p data-testid="movie-release-date">Release Date: {releaseDate}</p>
      <p data-testid="movie-runtime">Runtime: {movie.runtime} minutes</p>
      <p data-testid="movie-overview">{movie.overview}</p>
    </div>
  );
}

export default MovieDetails;
