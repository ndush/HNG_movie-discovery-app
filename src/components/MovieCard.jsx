import { Link } from "react-router";
import { img } from "../api";

export default function MovieCard({ movie }) {
  const poster = img(movie.poster_path, "w342");
  return (
    <Link to={`/movies/${movie.id}`} className="card" data-testid="movie-card">
      <div className="card-media">
        {poster ? (
          <img src={poster} alt="" loading="lazy" className="card-poster" data-testid="movie-poster" />
        ) : (
          <div className="card-poster card-poster--empty">No image</div>
        )}
        {movie.vote_average > 0 && <span className="rating">★ {movie.vote_average.toFixed(1)}</span>}
      </div>
      <h3 className="card-title" data-testid="movie-title">{movie.title}</h3>
      <p className="muted" data-testid="movie-release-date">{movie.release_date?.slice(0, 4) || "TBA"}</p>
    </Link>
  );
}
