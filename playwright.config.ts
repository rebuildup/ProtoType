import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the standalone ProtoType build.
 *
 * Asserts the contract the my-web-2026 parent depends on:
 *
 *   1. The built artifact (`dist/`) mounts a React tree inside
 *      `#root` and renders the host header + tab navigation.
 *   2. Tab button clicks swap the rendered view (the "representative
 *      interaction" my-web-2026's iframe cannot directly assert).
 *   3. No console errors fire during the mount + interaction.
 *
 * Local run:
 *
 *   pnpm install --frozen-lockfile
 *   pnpm run build
 *   pnpm exec playwright install --with-deps chromium
 *   pnpm run preview &       # vite preview, default :4173
 *   pnpm run test:e2e
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // `--host 127.0.0.1` pins preview to the IPv4 loopback that the
    // `url` probe below also uses. Without it, Vite defaults to
    // `localhost`, which can resolve to `::1` on the GitHub-hosted
    // runner and make Playwright's `url` probe miss it (IPv4 vs IPv6).
    command: "pnpm run preview --port 4173 --strictPort --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    // Vite preview cold-start on the GitHub-hosted runner takes ~15s;
    // allow generous headroom so the test job doesn't flake when the
    // runner is under contention.
    timeout: 120_000,
  },
});
