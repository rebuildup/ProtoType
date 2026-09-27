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
 *
 * Note on visibility vs attachment:
 *
 * `.home-container` is a `display: flex` wrapper whose only child is
 * `.openbtn` — a `position: fixed` element taken out of the flex flow.
 * Because the flex item contributes zero width/height to its parent,
 * `.home-container` resolves to a 0×0 box and Playwright's `toBeVisible`
 * reports it as "hidden" (zero bounding box). That is NOT a mount
 * failure — the Game tab is active and the button is on screen. The
 * representative interaction contract is "the tab content rendered,"
 * which is best asserted via:
 *
 *   - `.home-container` is attached to the DOM (mount contract), AND
 *   - `.openbtn` inside it is the visible interactive surface.
 *
 * `.setting-container` has the same shape — we assert `.setting-container`
 * is attached and that the visible Setting UI text "キーコンフィグ" /
 * "キー配列" is on screen.
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

		// The default tab is Game — assert mount + visible button.
		await expect(page.locator(".home-container")).toBeAttached({ timeout: 15_000 });
		await expect(page.locator(".home-container .openbtn")).toBeVisible();

		// Click the Ranking tab and assert the view swaps.
		await page.getByRole("button", { name: "ランキング" }).click();
		await expect(page.getByText("オンラインランキング")).toBeVisible({
			timeout: 5_000,
		});
		// The Game container should no longer be in the DOM.
		await expect(page.locator(".home-container")).toHaveCount(0);
	});

	test("clicking the Setting tab swaps to the setting view", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator(".home-container")).toBeAttached({ timeout: 15_000 });
		await expect(page.locator(".home-container .openbtn")).toBeVisible();

		await page.getByRole("button", { name: "サイト設定" }).click();
		await expect(page.locator(".setting-container")).toBeAttached({
			timeout: 5_000,
		});
		// Assert the Setting UI renders something visible to the user
		// (Setting container is also a flex wrapper around fixed-position
		// controls, so we assert by content text instead).
		await expect(
			page.locator(".setting-container").getByText("キー"),
		).toBeVisible({ timeout: 5_000 });
	});

	test("no console errors fire during the full interaction cycle", async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") consoleErrors.push(msg.text());
		});

		await page.goto("/");
		await expect(page.locator(".home-container")).toBeAttached({ timeout: 15_000 });
		await expect(page.locator(".home-container .openbtn")).toBeVisible();

		await page.getByRole("button", { name: "ランキング" }).click();
		await expect(page.getByText("オンラインランキング")).toBeVisible({
			timeout: 5_000,
		});

		await page.getByRole("button", { name: "サイト設定" }).click();
		await expect(page.locator(".setting-container")).toBeAttached({
			timeout: 5_000,
		});

		// Switch back to Game.
		await page.getByRole("button", { name: "ゲーム" }).click();
		await expect(page.locator(".home-container")).toBeAttached({ timeout: 5_000 });

		expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
	});
});
