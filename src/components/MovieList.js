import React, { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import "../index.css";

function MovieList({ movies }) {
  const cardsPerRow = 5;
  const [displayCount, setDisplayCount] = useState(10);

  const allMovies = movies.slice(0, displayCount);

  const handleSeeMoreClick = () => {
    setDisplayCount(displayCount + 10);
  };

  const firstRowMovies = allMovies.slice(0, cardsPerRow);
  const secondRowMovies = allMovies.slice(cardsPerRow, cardsPerRow * 2);

  return (
    <div className="movie-list">
      <div className="featured-title-container">
        <div className="featured-title-row">
          <h2 className="featured-title">Featured Movies</h2>
          <button className="see-more-button" onClick={handleSeeMoreClick}>
            See More
          </button>
        </div>
      </div>

      <div className="row">
        {firstRowMovies.map((movie) => (
          <div key={movie.id} className="movie-grid-item">
            <Link to={`/movies/${movie.id}`} className="movie-link">
              <div className="movie-card">
                <MovieCard movie={movie} />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row">
        {secondRowMovies.map((movie) => (
          <div key={movie.id} className="movie-grid-item">
            <Link to={`/movies/${movie.id}`} className="movie-link">
              <div className="movie-card">
                <MovieCard movie={movie} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
