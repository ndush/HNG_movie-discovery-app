// Server-side TMDB proxy: the browser calls /api/tmdb?path=/movie/123&..., the key stays here.
// Runs as a Netlify Function in production and as Vite middleware in dev (see vite.config.js).

// Only the read-only endpoints the app uses, so this can't be used as an open proxy.
const ALLOWED = /^\/(movie\/(\d+(\/videos)?|popular|top_rated|now_playing|upcoming)|search\/movie|discover\/movie|trending\/movie\/(day|week))$/;
export const allowed = (path) => ALLOWED.test(path ?? "");

// ponytail: no rate limiting; add one (e.g. a Netlify rate-limit rule) if the key starts hitting TMDB limits.
export async function GET(request) {
  const key = process.env.TMDB_KEY;
  if (!key) return json(500, { status_message: "Server is missing TMDB_KEY." });

  const params = new URL(request.url).searchParams;
  const path = params.get("path");
  if (!allowed(path)) return json(400, { status_message: "Unsupported path." });
  params.delete("path");
  params.set("api_key", key);

  const res = await fetch(`https://api.themoviedb.org/3${path}?${params}`);
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": "application/json",
      // Let the CDN reuse responses: faster for users, fewer calls on the key.
      ...(res.ok && { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" }),
    },
  });
}

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
