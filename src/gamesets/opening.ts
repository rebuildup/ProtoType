import * as PIXI from "pixi.js";
import { setProp, getProp } from "./gameConfig";
import { replaceHash } from "./game_master";
import { settings } from "../SiteInterface";
import { playCollect } from "./soundplay";

export function opening_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    app.stage.removeChildren();

    let i = 3;

    function showNextText() {
      app.stage.removeChildren();
      if (i == 0) {
        console.log("opening終了");
        setProp("CurrentSceneName", "game_select");
        resolve();
        return;
      }

      console.log(i);

      const sentence_text = new PIXI.Text({
        text: i.toString(),
        style: {
          fontFamily: getProp("FontFamily"),
          fontSize: 24,
          fill: replaceHash(settings.colorTheme.colors.MainColor),
          align: "center",
        },
      });

      sentence_text.x = app.screen.width / 2 - sentence_text.width / 2;
      sentence_text.y = app.screen.height / 2 - sentence_text.height / 2;
      app.stage.addChild(sentence_text);

      i--;
      playCollect();
      setTimeout(showNextText, 1000);
    }

    showNextText();
  });
}
