import { useSyncExternalStore } from "react";

// The user's saved/seen/skipped movies, kept in localStorage (no accounts, no server).
const KEY = "matinee:library";
const empty = { saved: [], seen: [], skipped: [] };
const subs = new Set();
let state = load();

function load() {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return empty; }
}

function update(fn) {
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage blocked: keep in memory */ }
  subs.forEach((f) => f());
}

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
// Only what the Saved page needs to render a card, so storage stays small.
const mini = ({ id, title, poster_path, release_date, vote_average }) =>
  ({ id, title, poster_path, release_date, vote_average });

export const library = {
  toggleSaved: (movie) => update((s) => ({
    ...s,
    saved: s.saved.some((m) => m.id === movie.id)
      ? s.saved.filter((m) => m.id !== movie.id)
      : [mini(movie), ...s.saved],
  })),
  toggleSeen: (id) => update((s) => ({ ...s, seen: toggle(s.seen, id) })),
  skip: (id) => update((s) => ({ ...s, skipped: [...s.skipped, id] })),
};

export function useLibrary() {
  return useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => state);
}
