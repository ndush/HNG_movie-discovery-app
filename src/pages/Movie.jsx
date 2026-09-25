import { useLocation, useNavigate, useParams } from "react-router";
import { img, useTmdb } from "../api";
import MovieCard from "../components/MovieCard";
import TrailerButton from "../components/TrailerButton";
import TiltedCard from "../components/bits/TiltedCard";
import { SaveButton, SeenButton } from "../components/Actions";

const region = (navigator.language.split("-")[1] || "US").toUpperCase();

export default function Movie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: movie, error, loading } = useTmdb(`/movie/${movieId}`, {
    append_to_response: "videos,credits,recommendations,watch/providers",
  });

  if (loading) return <section className="feature skeleton" />;
  if (error) return <p className="notice">{error.message}</p>;

  const backdrop = img(movie.backdrop_path, "w1280");
  const poster = img(movie.poster_path, "w500");
  const cast = movie.credits.cast.slice(0, 12);
  const similar = movie.recommendations.results.filter((m) => m.poster_path).slice(0, 12);
  const director = movie.credits.crew.find((c) => c.job === "Director");
  const where = movie["watch/providers"].results[region];
  const [kind, providers] = where?.flatrate ? ["Stream on", where.flatrate]
    : where?.rent ? ["Rent on", where.rent] : where?.buy ? ["Buy on", where.buy] : [];
  // Arrived from outside the app? Back goes home instead of leaving the site.
  const back = () => (location.key === "default" ? navigate("/") : navigate(-1));

  return (
    <main>
      <title>{`${movie.title} · Matinee`}</title>
      <section className="feature" style={backdrop && { "--backdrop": `url(${backdrop})` }}>
        <div className="container feature-inner">
          {poster && (
            <div className="feature-poster">
              <TiltedCard imageSrc={poster} altText={`${movie.title} poster`} containerHeight="auto"
                imageWidth="100%" imageHeight="100%" rotateAmplitude={10} scaleOnHover={1.04}
                showMobileWarning={false} showTooltip={false} />
            </div>
          )}
          <div>
            <button className="back" onClick={back}>← Back</button>
            <p className="mono">
              {movie.release_date?.slice(0, 4) || "TBA"}
              {movie.runtime > 0 && ` · ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
              {movie.vote_average > 0 && ` · ★ ${movie.vote_average.toFixed(1)}`}
            </p>
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">“{movie.tagline}”</p>}
            <ul className="tags">{movie.genres.map((g) => <li key={g.id}>{g.name}</li>)}</ul>
            <p className="overview">{movie.overview}</p>
            {director && <p className="muted">Directed by <strong>{director.name}</strong></p>}
            <div className="actions">
              <TrailerButton movieId={movie.id} videos={movie.videos} />
              <SaveButton movie={movie} />
              <SeenButton id={movie.id} />
            </div>
            {providers && (
              <a className="providers" href={where.link} target="_blank" rel="noreferrer">
                <span className="mono">{kind}</span>
                {providers.slice(0, 5).map((p) => (
                  <img key={p.provider_id} src={img(p.logo_path, "w92")} alt={p.provider_name} title={p.provider_name} />
                ))}
              </a>
            )}
          </div>
        </div>
      </section>

      {cast.length > 0 && (
        <section className="container">
          <h2 className="section-title">Starring</h2>
          <ul className="cast">
            {cast.map((p) => (
              <li key={p.credit_id}>
                {p.profile_path ? <img src={img(p.profile_path, "w185")} alt="" loading="lazy" />
                  : <div className="cast-empty" aria-hidden="true">{p.name[0]}</div>}
                <strong>{p.name}</strong>
                <span className="muted">{p.character}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {similar.length > 0 && (
        <section className="container">
          <h2 className="section-title">If you liked this</h2>
          <ul className="grid">{similar.map((m) => <li key={m.id}><MovieCard movie={m} /></li>)}</ul>
        </section>
      )}
    </main>
  );
}
