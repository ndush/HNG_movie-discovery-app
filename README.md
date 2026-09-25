# Matinee ✦

**Tell it your mood, get three movies worth watching tonight.**

Most movie apps show an endless grid and leave you scrolling for 40 minutes. Matinee asks two questions (how you feel and how much time you have) and hands you three "tickets". Save what looks good, mark what you've seen, and it never shows you those again.

## Requirements

### Must have (v1, built)
| # | Requirement |
|---|---|
| R1 | Pick a **mood** (9 options) and a **time budget** (any / under 1½h / ~2h / all night) |
| R2 | Optional **"watching with kids"** filter (PG and below, no horror, thriller, crime or war) |
| R3 | **Roll** returns 3 random, well-rated picks, each with a one-line reason. **Roll again** never repeats them |
| R4 | On each pick: **watch trailer** (in-page), **save**, **seen it**, **not for me** |
| R5 | Seen and skipped movies are **never picked again** |
| R6 | **Saved** page split into *Up next* and *Watched* |
| R7 | **Movie page**: synopsis, runtime, rating, director, cast, trailer, **where to stream in your country**, similar movies |
| R8 | **Search** by title as a fallback |
| R9 | Works on phones; light ("matinee") and dark ("late show") themes; keyboard accessible |
| R10 | No accounts: everything is stored on the device |

### Later (not built)
- Sync across devices (accounts and a hosted database)
- Filter by the streaming services you own
- "Movie night" shared link where friends vote on the three picks
- "Hidden gems" mode (high rating, low popularity)

## Design

**Theme: warm retro cinema.** A picture house from the 1950s rather than a streaming service.

| Token | Matinee (light) | Late show (dark) | Used for |
|---|---|---|---|
| `--bg` | `#f4ead8` cream paper | `#16100d` projector booth | page |
| `--accent` | `#8c1c2b` velvet curtain | `#d1455c` | buttons, selected chips, logo |
| `--brass` | `#b7832a` | `#e2b45c` | marquee bulbs, labels, genre tags |

- **Type:** Fraunces (display serif, italic for voice), DM Sans (body), DM Mono ("ADMIT ONE" labels)
- **Details:** film-grain overlay, dotted "bulb" borders on the header and footer, picks styled as tear-off tickets with punched notches, slightly tilted posters, sepia backdrops
- **Motion ([React Bits](https://reactbits.dev), copied into `src/components/bits/`):** LightRays projector beam behind the headline, RotatingText mood phrases, a spinning CircularText "Admit one" badge, a ScrollVelocity marquee of trending titles, a StarBorder chasing light on the Roll button, and a TiltedCard poster on movie pages. All of these are skipped when the OS asks for reduced motion
- All colours are CSS variables in [`src/index.css`](src/index.css). A theme only redefines the tokens

## Architecture

```
api/
  tmdb.js             server-side TMDB proxy: adds the key, allows only the endpoints the app uses
netlify/functions/
  tmdb.js             Netlify entry point for api/tmdb.js
src/
  main.jsx            routes + layout (header / page / footer)
  api.js              tmdb() → /api/tmdb, img() URL helper, useTmdb() hook
  picker.js           pure logic: moods → TMDB discover params, random fresh picks
  picker.test.js      node:test checks for picker.js
  library.js          saved / seen / skipped store (localStorage + useSyncExternalStore)
  pages/
    Tonight.jsx       /              mood form → 3 tickets
    Movie.jsx         /movies/:id    details, cast, providers, similar
    Saved.jsx         /saved         up next / watched
    Search.jsx        /search?q=     title search
  components/         Header, Footer, TicketCard, MovieCard, MovieList, TrailerButton, Actions
```

**Data flow:** Tonight builds a `/discover/movie` query from the mood (genres ORed, excluded genres, runtime, rating ≥ 6.3 with 150+ votes). It fetches a random page from the first five, drops anything seen, skipped or already shown, and picks 3 at random. The movie page gets details, videos, credits, recommendations and watch providers in **one** request (`append_to_response`). Region comes from the browser language (`en-KE` → Kenya).

**API key:** the browser never sees one. It calls `/api/tmdb`, a Netlify Function (`netlify/functions/tmdb.js` → `api/tmdb.js`, the same code Vite runs in dev) that adds `TMDB_KEY` from the server environment.

**Stack:** React 19, React Router 7, Vite 7, `motion` and `ogl` (for React Bits). No state library, no UI kit, no CSS framework.

## Run it

The key is set **once by whoever hosts the app**. People using the app never need one.

```sh
echo "TMDB_KEY=your_key" > .env.local   # free key: themoviedb.org/settings/api
npm install
npm run dev        # http://localhost:5173
npm test           # picker + proxy checks
```

**Deploy on Netlify:** `netlify.toml` has the build settings and routes `/api/tmdb` to the function. Add `TMDB_KEY` under *Site configuration → Environment variables*, then deploy.

Movie data from [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.
