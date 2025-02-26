import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";

import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);

import { getLatestKey } from "./009_keyinput";

export function record_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const screenCenter = { x: app.screen.width / 2, y: app.screen.height / 2 };
    // Remove waku_circle if exists
    const wakuCircle = app.stage.children.find(
      (child) => child.label === "waku_circle"
    );
    if (wakuCircle) {
      app.stage.removeChild(wakuCircle);
    }
    const circle_m = new PIXI.Graphics();
    // Draw the circle
    circle_m
      .circle(0, 0, 800)
      .fill(replaceHash(settings.colorTheme.colors.MainBG));
    circle_m.position = screenCenter;
    app.stage.addChild(circle_m);
    circle_m.scale = 0;
    gsap.to(circle_m.scale, { x: 1, y: 1, ease: "power4.out", duration: 2 });

    const select_select = new PIXI.Text({
      text: "プレイ記録",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 30,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = screenCenter.x - select_select.width / 2;
    select_select.y = screenCenter.y - select_select.height / 2;
    select_select.interactive = true;

    // Current key input AbortController reference
    let currentKeyController: AbortController | null = null;

    // Pointer event to change scene
    select_select.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      // Abort pending key input
      currentKeyController?.abort();
      get_out();
    });
    app.stage.addChild(select_select);

    function get_out() {
      // Abort pending key input
      currentKeyController?.abort();
      gsap.to(circle_m.scale, { x: 0, y: 0, ease: "power4.out", duration: 1 });
      gsap.to(select_select, { alpha: 0, ease: "power4.out", duration: 1 });
      setTimeout(() => {
        resolve();
      }, 1000);
    }

    // Main loop for key input
    while (gameData.CurrentSceneName === "record_scene") {
      // Create a new AbortController for each iteration
      currentKeyController = new AbortController();
      try {
        // Wait for a key input with abort signal
        const keyCode = await getLatestKey(currentKeyController.signal);
        if (keyCode.code === "Escape" || keyCode.code === "Space") {
          gameData.CurrentSceneName = "game_select";
          get_out();
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          // Key input was aborted, exit loop if scene changed
          break;
        } else {
          console.error(error);
        }
      }
    }
  });
}
