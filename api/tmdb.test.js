import { test } from "node:test";
import assert from "node:assert/strict";
import { allowed } from "./tmdb.js";

test("proxy only allows the endpoints the app uses", () => {
  for (const p of ["/movie/550", "/movie/550/videos", "/discover/movie", "/search/movie", "/trending/movie/day", "/movie/popular"])
    assert.ok(allowed(p), p);
  for (const p of ["/account", "/movie/550/../../account", "/movie/550?x=1", "", null, "/authentication/token/new"])
    assert.ok(!allowed(p), String(p));
});
