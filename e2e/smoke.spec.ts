import { expect, test } from "@playwright/test";

/**
 * Standalone smoke test for ProtoType's built artifact.
 *
 * Asserts the contract the my-web-2026 parent depends on (the iframe
 * cannot drive this directly because it is sandboxed `allow-scripts`
 * with an opaque origin):
 *
 *   1. React mounts children inside `#root`.
 *   2. Tab buttons swap the rendered view (representative interaction).
 *   3. No console errors fire during the mount + interaction.
 *
 * The default tab is `Game` (renders `.home-container`). Clicking
 * `ランキング` swaps to the ranking view (renders `オンラインランキング`).
 * Clicking `サイト設定` swaps to the setting view (renders
 * `.setting-container`).
 */

test.describe("ProtoType standalone smoke", () => {
  test("React mounts the App tree inside #root", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    // `#root` is the mount target emitted by Vite's index.html.
    const root = page.locator("#root");
    await expect(root).toBeAttached();
    // The React tree must render at least one child node.
    await expect(root.locator("> *").first()).toBeVisible({ timeout: 15_000 });

    // The Header component is always rendered above the tab nav.
    await expect(page.getByRole("button", { name: "ランキング" })).toBeVisible();

    // No console errors during mount.
    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("clicking the Ranking tab swaps the rendered view", async ({ page }) => {
    await page.goto("/");

    // The default tab is Game (renders .home-container).
    await expect(page.locator(".home-container")).toBeVisible({ timeout: 15_000 });

    // Click the Ranking tab and assert the view swaps.
    await page.getByRole("button", { name: "ランキング" }).click();
    await expect(page.getByText("オンラインランキング")).toBeVisible({
      timeout: 5_000,
    });
    // The Game container should no longer be visible.
    await expect(page.locator(".home-container")).toHaveCount(0);
  });

  test("clicking the Setting tab swaps to the setting view", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".home-container")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "サイト設定" }).click();
    await expect(page.locator(".setting-container")).toBeVisible({
      timeout: 5_000,
    });
  });

  test("no console errors fire during the full interaction cycle", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.locator(".home-container")).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "ランキング" }).click();
    await expect(page.getByText("オンラインランキング")).toBeVisible({
      timeout: 5_000,
    });

    await page.getByRole("button", { name: "サイト設定" }).click();
    await expect(page.locator(".setting-container")).toBeVisible({
      timeout: 5_000,
    });

    // Switch back to Game.
    await page.getByRole("button", { name: "ゲーム" }).click();
    await expect(page.locator(".home-container")).toBeVisible({ timeout: 5_000 });

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});
