import * as PIXI from "pixi.js";
import { setProp, getProp } from "./gameConfig";
import { replaceHash } from "./game_master";
import { settings } from "../SiteInterface";

export function setting_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    app.stage.removeChildren();

    const select_select = new PIXI.Text({
      text: "ゲーム選択に戻る",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 24,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = app.screen.width / 2 - select_select.width / 2;
    select_select.y = app.screen.height / 2 - select_select.height / 2;
    select_select.interactive = true;
    select_select.on("pointerdown", async () => {
      setProp("CurrentSceneName", "game_select");
      resolve();
    });
    app.stage.addChild(select_select);
  });
}
