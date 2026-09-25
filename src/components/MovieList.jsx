import { useEffect, useState } from "react";
import { tmdb } from "../api";
import MovieCard from "./MovieCard";

// Paginated grid for any TMDB list endpoint. Parent re-keys it when path/query change.
export default function MovieList({ path, query, title, empty = "No movies found." }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    tmdb(path, query ? { query, page } : { page }, ctrl.signal)
      .then((d) => {
        setMovies((m) => {
          const seen = new Set(m.map((x) => x.id));
          return [...m, ...d.results.filter((x) => !seen.has(x.id))];
        });
        setTotalPages(d.total_pages);
        setStatus("idle");
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e);
        setStatus("error");
      });
    return () => ctrl.abort();
  }, [path, query, page]);

  const firstLoad = status === "loading" && movies.length === 0;

  return (
    <main className="container">
      {title && <h2 className="section-title">{title}</h2>}
      {status === "error" && <p className="notice">{error.message}</p>}
      {status === "idle" && movies.length === 0 && <p className="notice">{empty}</p>}
      <ul className="grid" aria-busy={status === "loading"}>
        {movies.map((m) => <li key={m.id}><MovieCard movie={m} /></li>)}
        {firstLoad && Array.from({ length: 12 }, (_, i) => (
          <li key={i} aria-hidden="true"><div className="card-poster skeleton" /></li>
        ))}
      </ul>
      {page < totalPages && status !== "error" && movies.length > 0 && (
        <button className="btn btn--ghost more" disabled={status === "loading"}
          onClick={() => setPage((p) => p + 1)}>
          {status === "loading" ? "Loading…" : "Load more"}
        </button>
      )}
    </main>
  );
}
