import { library, useLibrary } from "../library";

export function SaveButton({ movie }) {
  const on = useLibrary().saved.some((m) => m.id === movie.id);
  return (
    <button className={`pill ${on ? "pill--on" : ""}`} aria-pressed={on} onClick={() => library.toggleSaved(movie)}>
      {on ? "✓ Saved" : "+ Save"}
    </button>
  );
}

export function SeenButton({ id }) {
  const on = useLibrary().seen.includes(id);
  return (
    <button className={`pill ${on ? "pill--on" : ""}`} aria-pressed={on} onClick={() => library.toggleSeen(id)}>
      {on ? "✓ Seen" : "Seen it"}
    </button>
  );
}
