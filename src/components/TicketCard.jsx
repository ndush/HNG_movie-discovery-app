import { Link } from "react-router";
import { img } from "../api";
import { GENRES } from "../picker";
import { library } from "../library";
import { SaveButton, SeenButton } from "./Actions";
import TrailerButton from "./TrailerButton";

export default function TicketCard({ movie, n }) {
  const genres = movie.genre_ids.map((g) => GENRES[g]).filter(Boolean).slice(0, 2).join(" / ");
  return (
    <article className="ticket">
      <Link to={`/movies/${movie.id}`} className="ticket-poster" tabIndex={-1} aria-hidden="true">
        <img src={img(movie.poster_path, "w342")} alt="" />
      </Link>
      <div className="ticket-stub">
        <p className="mono">Admit one · No. {String(n).padStart(3, "0")}</p>
        <h3><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h3>
        <p className="ticket-meta">
          {movie.release_date?.slice(0, 4)} · ★ {movie.vote_average.toFixed(1)}{genres && ` · ${genres}`}
        </p>
        <p className="ticket-blurb">{movie.blurb}</p>
        <div className="ticket-actions">
          <TrailerButton movieId={movie.id} className="pill pill--accent" />
          <SaveButton movie={movie} />
          <SeenButton id={movie.id} />
          <button className="pill pill--quiet" onClick={() => library.skip(movie.id)}>Not for me</button>
        </div>
      </div>
    </article>
  );
}
