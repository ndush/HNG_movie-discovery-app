import React from "react";

function MovieCard({ movie }) {
  return (
    <div data-testid="movie-card" className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        data-testid="movie-poster"
        className="movie-poster"
      />
      <h2 data-testid="movie-title" className="movie-title">
        {movie.title}
      </h2>
      <p data-testid="movie-release-date" className="movie-release-date">
        {movie.release_date}
      </p>
    </div>
  );
}

export default MovieCard;
