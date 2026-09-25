import { useEffect, useState } from "react";

export const img = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export async function tmdb(path, params = {}, signal) {
  const qs = new URLSearchParams({ path, language: "en-US", ...params });
  const res = await fetch(`/api/tmdb?${qs}`, { signal });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).status_message;
    throw new Error(msg || `Couldn't load movies (${res.status}). Try again in a moment.`);
  }
  return res.json();
}

// Loads `path` whenever path/params change and aborts stale requests. A null path skips the fetch.
export function useTmdb(path, params) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const key = path && JSON.stringify([path, params]);
  useEffect(() => {
    if (!key) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    tmdb(path, params, ctrl.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => error.name !== "AbortError" && setState({ data: null, error, loading: false }));
    return () => ctrl.abort();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}
