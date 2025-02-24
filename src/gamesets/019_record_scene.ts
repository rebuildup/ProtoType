import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";
import { BG_grid } from "./018_grid";

import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);

import { getLatestKey } from "./009_keyinput";
import { GlowFilter } from "pixi-filters";

export function record_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    //app.stage.removeChildren();
    const glowFilter = new GlowFilter({
      distance: 28,
      outerStrength: 20,
      innerStrength: 0,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      quality: 0.01,
      alpha: 0.02,
    });
    const circle_m = new PIXI.Graphics();
    circle_m
      .circle(0, 0, 800)
      .fill(replaceHash(settings.colorTheme.colors.MainBG));
    circle_m.x = app.screen.width / 2;
    circle_m.y = app.screen.height / 2;
    app.stage.addChild(circle_m);
    circle_m.scale = 0;
    gsap.to(circle_m.scale, { x: 1, y: 1, ease: "power4.out", duration: 2 });
    BG_grid(app);
    const select_select = new PIXI.Text({
      text: "プレイ記録",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 30,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = app.screen.width / 2 - select_select.width / 2;
    select_select.y = app.screen.height / 2 - select_select.height / 2;
    select_select.interactive = true;
    select_select.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      get_out();
    });
    select_select.filters = [glowFilter];
    app.stage.addChild(select_select);

    function get_out() {
      gsap.to(circle_m.scale, { x: 0, y: 0, ease: "power4.out", duration: 1 });
      gsap.to(select_select, { alpha: 0, ease: "power4.out", duration: 1 });
      setTimeout(() => {
        resolve();
      }, 1000);
    }
    while (gameData.CurrentSceneName == "record_scene") {
      const keyCode = await getLatestKey();
      if (keyCode.code == "Escape" || keyCode.code == "Space") {
        gameData.CurrentSceneName = "game_select";
        get_out();
      }
    }
  });
}
