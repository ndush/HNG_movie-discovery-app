import { useEffect, useRef, useState } from "react";
import { tmdb } from "../api";
import { MOODS, TIMES, discoverParams, pickFresh } from "../picker";
import { useLibrary } from "../library";
import TicketCard from "../components/TicketCard";
import NowShowing from "../components/NowShowing";
import LightRays from "../components/bits/LightRays";
import RotatingText from "../components/bits/RotatingText";
import CircularText from "../components/bits/CircularText";
import StarBorder from "../components/bits/StarBorder";
import { reducedMotion, useTheme } from "../theme";

const MOOD_IDS = Object.keys(MOODS);
const PHRASES = MOOD_IDS.map((id) => MOODS[id].phrase);

// ponytail: survives in-app navigation (e.g. back from a movie page) but not a reload; move to sessionStorage if that matters.
let memory = { form: { mood: null, time: "any", kids: false }, picks: null };

export default function Tonight() {
  const [form, setForm] = useState(memory.form);
  const [picks, setPicks] = useState(memory.picks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { seen, skipped } = useLibrary();
  const results = useRef(null);
  const rotator = useRef(null);
  const dark = useTheme() === "dark";
  const justRolled = useRef(false);

  useEffect(() => { memory = { form, picks }; }, [form, picks]);
  useEffect(() => {
    if (justRolled.current) results.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    justRolled.current = false;
  }, [picks]);

  // Headline cycles through moods until one is picked, then settles on it.
  useEffect(() => {
    if (form.mood) rotator.current?.jumpTo(MOOD_IDS.indexOf(form.mood));
  }, [form.mood]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const visible = picks?.filter((m) => !seen.includes(m.id) && !skipped.includes(m.id));

  async function roll(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Random page among the first few for variety; fall back into range if the mood is niche.
      let d = await tmdb("/discover/movie", discoverParams(form, 1 + Math.floor(Math.random() * 5)));
      if (!d.results.length && d.total_pages > 0) {
        d = await tmdb("/discover/movie", discoverParams(form, 1 + Math.floor(Math.random() * Math.min(d.total_pages, 500))));
      }
      const exclude = new Set([...seen, ...skipped, ...(picks ?? []).map((m) => m.id)]);
      const lines = MOODS[form.mood].lines;
      const offset = Math.floor(Math.random() * lines.length);
      justRolled.current = true;
      setPicks(pickFresh(d.results, exclude).map((m, i) => ({ ...m, blurb: lines[(offset + i) % lines.length] })));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="intro">
        {!reducedMotion && (
          <LightRays className="intro-rays" raysOrigin="top-center" raysColor={dark ? "#e2b45c" : "#b7832a"}
            raysSpeed={0.6} lightSpread={0.9} rayLength={1.4} mouseInfluence={0.08}
            noiseAmount={0.08} distortion={0.04} lightMode={!dark} />
        )}
        <div className="container intro-inner">
          <div>
            <p className="mono">Now showing · {new Date().toLocaleDateString(undefined, { weekday: "long" })} night</p>
            <h1>What are we watching <em>tonight?</em></h1>
            <p className="lede">
              I'm in the mood for{" "}
              <RotatingText ref={rotator} texts={PHRASES} auto={!form.mood && !reducedMotion}
                rotationInterval={2400} staggerDuration={0.02} splitBy="characters"
                mainClassName="rotator" elementLevelClassName="rotator-char" />
            </p>
          </div>
          {!reducedMotion && (
            <div className="spin-badge" aria-hidden="true">
              <CircularText text="ADMIT ONE ✦ NOW SHOWING ✦ " spinDuration={24} onHover="speedUp" className="spin-text" />
              <span>🎟️</span>
            </div>
          )}
        </div>
      </section>

      <NowShowing />

      <form className="container booth" onSubmit={roll}>
        <fieldset>
          <legend>I'm in the mood for…</legend>
          <div className="chips">
            {Object.entries(MOODS).map(([id, m]) => (
              <label key={id} className="chip">
                <input type="radio" name="mood" checked={form.mood === id} onChange={() => set("mood", id)} />
                <span><span aria-hidden="true">{m.icon}</span> {m.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>I've got…</legend>
          <div className="chips">
            {Object.entries(TIMES).map(([id, t]) => (
              <label key={id} className="chip">
                <input type="radio" name="time" checked={form.time === id} onChange={() => set("time", id)} />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="booth-footer">
          <label className="check">
            <input type="checkbox" checked={form.kids} onChange={(e) => set("kids", e.target.checked)} />
            Watching with kids
          </label>
          <StarBorder as="button" className="roll" color="#f6d58e" speed="4s" thickness={2}
            backgroundColor="var(--accent)" textColor="var(--accent-ink)" borderColor="transparent"
            disabled={!form.mood || loading}>
            {loading ? "Rolling…" : !form.mood ? "Pick a mood first" : picks ? "Roll again" : "Roll the reel"}
          </StarBorder>
        </div>
      </form>

      {error && <p className="notice">{error.message}</p>}

      {visible && (
        <section ref={results} className="container results">
          <h2 className="section-title">Tonight's {visible.length === 3 ? "triple feature" : "picks"}</h2>
          {visible.length ? (
            <ol className="tickets">
              {visible.map((m, i) => <li key={m.id}><TicketCard movie={m} n={i + 1} /></li>)}
            </ol>
          ) : (
            <p className="notice">That's the whole reel. Roll again or try another mood.</p>
          )}
        </section>
      )}
    </main>
  );
}
