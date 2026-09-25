import { Link } from "react-router";
import { library, useLibrary } from "../library";
import MovieCard from "../components/MovieCard";

export default function Saved() {
  const { saved, seen } = useLibrary();
  const upNext = saved.filter((m) => !seen.includes(m.id));
  const watched = saved.filter((m) => seen.includes(m.id));

  if (!saved.length) {
    return (
      <main className="container notice">
        <h1 className="section-title">Your ticket box is empty</h1>
        <p>Save movies from tonight's picks and they'll wait for you here.</p>
        <Link className="btn" to="/">Find something to watch</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <Shelf title="Up next" movies={upNext} action={(m) => (
        <button className="pill" onClick={() => library.toggleSeen(m.id)}>Seen it</button>
      )} />
      <Shelf title="Watched" movies={watched} action={(m) => (
        <button className="pill" onClick={() => library.toggleSaved(m)}>Remove</button>
      )} />
    </main>
  );
}

function Shelf({ title, movies, action }) {
  if (!movies.length) return null;
  return (
    <section className="shelf">
      <h1 className="section-title">{title} <span className="muted">({movies.length})</span></h1>
      <ul className="grid">
        {movies.map((m) => <li key={m.id}><MovieCard movie={m} />{action(m)}</li>)}
      </ul>
    </section>
  );
}
