import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";
import { BG_grid } from "./018_grid";

import { getLatestKey } from "./009_keyinput";

export function record_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    app.stage.removeChildren();
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
      resolve();
    });
    app.stage.addChild(select_select);
    while (gameData.CurrentSceneName == "record_scene") {
      const keyCode = await getLatestKey();
      if (keyCode.code == "Escape") {
        gameData.CurrentSceneName = "game_select";
        resolve();
      }
    }
  });
}
