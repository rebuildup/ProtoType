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
  timeout: 30_000,
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
    command: "pnpm run preview --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
