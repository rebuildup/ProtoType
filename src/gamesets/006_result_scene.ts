import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";

export function result_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    // Ensure that app.stage is defined before calling removeChildren()
    if (!app.stage) {
      app.stage = new PIXI.Container();
    }
    app.stage.removeChildren();

    const select_replay = new PIXI.Text({
      text: "リプレイ",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 50,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_replay.x = app.screen.width / 2 - select_replay.width / 2;
    select_replay.y = app.screen.height / 2 - select_replay.height / 2 - 70;
    select_replay.interactive = true;
    select_replay.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    app.stage.addChild(select_replay);

    const select_select = new PIXI.Text({
      text: "ゲーム選択に戻る",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 50,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = app.screen.width / 2 - select_select.width / 2;
    select_select.y = app.screen.height / 2 - select_select.height / 2 + 70;
    select_select.interactive = true;
    select_select.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      resolve();
    });
    app.stage.addChild(select_select);
  });
}
/*
 const combo_text = new PIXI.Text({
      text: "30",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
    combo_text.y = win_pos.y - combo_text.height / 2;
    app.stage.addChild(combo_text);



*/
