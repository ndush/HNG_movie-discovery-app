import { test } from "node:test";
import assert from "node:assert/strict";
import { discoverParams, pickFresh } from "./picker.js";

test("discoverParams maps mood, time and kids", () => {
  const p = discoverParams({ mood: "cozy", time: "short", kids: true }, 3);
  assert.equal(p.with_genres, "35|10751|16|10749");
  assert.equal(p["with_runtime.lte"], 95);
  assert.equal(p["certification.lte"], "PG");
  assert.equal(p.page, 3);
  assert.ok(p.without_genres.split(",").includes("27"));
  assert.equal(discoverParams({ mood: "scared", time: "any", kids: false }).without_genres, "");
});

test("pickFresh skips excluded and posterless, returns at most n unique", () => {
  const movies = [1, 2, 3, 4, 5].map((id) => ({ id, poster_path: id === 5 ? null : "/p.jpg" }));
  const picks = pickFresh(movies, new Set([1]), 3);
  assert.equal(picks.length, 3);
  assert.equal(new Set(picks.map((m) => m.id)).size, 3);
  assert.ok(picks.every((m) => m.id !== 1 && m.id !== 5));
  assert.equal(pickFresh(movies, new Set([1, 2, 3]), 3).length, 1);
});
