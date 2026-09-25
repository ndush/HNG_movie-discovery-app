// Pure logic for the mood picker: TMDB genre ids, mood/time presets, query building, picking.

export const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary",
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western",
};

export const MOODS = {
  cozy: { icon: "🛋️", label: "Cozy", phrase: "something cozy", genres: [35, 10751, 16, 10749], without: [27, 53, 80, 10752],
    lines: ["Blanket-and-tea territory.", "Warm, gentle, easy to love.", "Low stakes, high comfort."] },
  laugh: { icon: "😂", label: "A good laugh", phrase: "a good laugh", genres: [35], without: [27, 10752],
    lines: ["Guaranteed chuckles, possible snorts.", "Comedy that holds up.", "Laugh-out-loud pick."] },
  thrilled: { icon: "⚡", label: "Edge of my seat", phrase: "edge-of-seat thrills", genres: [53, 28, 80],
    lines: ["Tension from the first reel.", "Grip the armrest.", "Twists, chases, no breathers."] },
  scared: { icon: "👻", label: "Scared", phrase: "a proper scare", genres: [27],
    lines: ["Lights off. If you dare.", "Sleep with the lamp on.", "A proper fright."] },
  mindbent: { icon: "🌀", label: "Mind-bending", phrase: "a mind-bender", genres: [878, 9648],
    lines: ["You'll be thinking about it tomorrow.", "Pay attention — it rewards you.", "Big ideas, bigger twists."] },
  cry: { icon: "😢", label: "A good cry", phrase: "a good cry", genres: [18], without: [35, 27],
    lines: ["Tissues within reach.", "It'll get you. In a good way.", "Heavy heart, full heart."] },
  inspired: { icon: "✨", label: "Inspired", phrase: "something inspiring", genres: [99, 36, 10402],
    lines: ["True stories, real sparks.", "You'll want to go do something.", "Made from the real thing."] },
  adventure: { icon: "🧭", label: "Adventure", phrase: "an adventure", genres: [12, 14],
    lines: ["Pack light, it's a journey.", "Far-off places, big quests.", "Pure escapism."] },
  romantic: { icon: "💘", label: "Romantic", phrase: "a love story", genres: [10749], without: [27],
    lines: ["Swoon-worthy.", "For hand-holding.", "Love, but make it cinema."] },
};

export const TIMES = {
  any: { label: "Any length", params: {} },
  short: { label: "Under 1½ hours", params: { "with_runtime.lte": 95 } },
  standard: { label: "About 2 hours", params: { "with_runtime.gte": 90, "with_runtime.lte": 130 } },
  epic: { label: "All night", params: { "with_runtime.gte": 130 } },
};

export function discoverParams({ mood, time, kids }, page = 1) {
  const m = MOODS[mood];
  const without = new Set(m.without ?? []);
  if (kids) [27, 53, 80, 10752].forEach((g) => without.add(g));
  return {
    with_genres: m.genres.join("|"), // "|" = any of these genres
    without_genres: [...without].join(","),
    "vote_count.gte": 150,
    "vote_average.gte": 6.3,
    sort_by: "popularity.desc",
    include_adult: "false",
    page,
    ...TIMES[time].params,
    ...(kids && { certification_country: "US", "certification.lte": "PG" }),
  };
}

// Random `n` movies with posters that aren't excluded (partial Fisher–Yates).
export function pickFresh(results, exclude, n = 3, rand = Math.random) {
  const pool = results.filter((m) => m.poster_path && !exclude.has(m.id));
  const k = Math.min(n, pool.length);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rand() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, k);
}
