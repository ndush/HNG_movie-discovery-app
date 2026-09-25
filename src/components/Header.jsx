import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router";
import { useLibrary } from "../library";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const q = pathname === "/search" ? params.get("q") ?? "" : "";
  const { saved, seen } = useLibrary();
  const toWatch = saved.filter((m) => !seen.includes(m.id)).length;

  return (
    <header className="header">
      <Link to="/" className="logo">Matinee<span aria-hidden="true">✦</span></Link>
      <nav className="nav">
        <NavLink to="/" end>Tonight</NavLink>
        <NavLink to="/saved">Saved{toWatch > 0 && <span className="badge">{toWatch}</span>}</NavLink>
      </nav>
      <form className="search" role="search" onSubmit={(e) => {
        e.preventDefault();
        const text = new FormData(e.currentTarget).get("q").trim();
        if (text) navigate(`/search?q=${encodeURIComponent(text)}`);
      }}>
        <input key={q} name="q" type="search" defaultValue={q} placeholder="Find a title…" aria-label="Search movies" />
      </form>
      <ThemeToggle />
    </header>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("matinee:theme", theme); } catch { /* won't persist */ }
  }, [theme]);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button className="icon-btn" onClick={() => setTheme(next)}
      aria-label={next === "dark" ? "Switch to late show (dark)" : "Switch to matinee (light)"}>
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
