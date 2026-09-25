export default function Footer() {
  return (
    <footer className="footer">
      <p className="logo">Matinee<span aria-hidden="true">✦</span></p>
      <p className="muted">
        Movie data from <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>.
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
