import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // The my-web-2026 parent serves this artifact at
  // `/tools/prototype/app/` (its `delivery.artifact_path`). Vite's
  // default `base: '/'` makes every EMITTED URL root-absolute:
  //   - asset imports such as `collect.wav` / `miss.wav` become
  //     `"/assets/<name>-<hash>.wav"` literals, and
  //   - the dynamic-import preload helper joins `base + chunk`, so
  //     pixi's lazy `browserAll-*` / `webworkerAll-*` chunks are
  //     requested at `https://<host>/assets/…`.
  // Hosted first-party, all of those resolve to the host origin root
  // and 404 while the same bytes exist under `/tools/prototype/app/
  // assets/` (Issue #896). With the base set, every emitted URL
  // resolves inside the tool's own namespace.
  base: "/tools/prototype/app/",
  plugins: [react()],
});
