import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { GET } from "./api/tmdb.js";

// In dev, serve /api/tmdb from the same handler Vercel runs in production.
const tmdbProxy = {
  name: "tmdb-proxy",
  configureServer(server) {
    server.middlewares.use("/api/tmdb", async (req, res) => {
      const response = await GET(new Request(new URL(req.originalUrl, "http://localhost")));
      res.statusCode = response.status;
      response.headers.forEach((v, k) => res.setHeader(k, v));
      res.end(await response.text());
    });
  },
};

export default defineConfig(({ mode }) => {
  // Load TMDB_KEY from .env.local into process.env (no VITE_ prefix, so it's never bundled).
  Object.assign(process.env, loadEnv(mode, process.cwd(), "TMDB_"));
  return { plugins: [react(), tmdbProxy] };
});
