import { useSearchParams } from "react-router";
import MovieList from "../components/MovieList";

export default function Search() {
  const q = useSearchParams()[0].get("q")?.trim();
  if (!q) return <p className="notice">Type a title in the search box above.</p>;
  return (
    <MovieList key={q} path="/search/movie" query={q} title={`Results for “${q}”`}
      empty={`Nothing matches “${q}”. Check the spelling or try fewer words.`} />
  );
}
