import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";
import { playCollect } from "./012_soundplay";
import { BG_grid } from "./018_grid";

export function opening_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    app.stage.removeChildren();
    BG_grid(app);
    let i = 1;

    const sentence_text = new PIXI.Text({
      text: i.toString(),
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 24,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });

    sentence_text.x = app.screen.width / 2 - sentence_text.width / 2;
    sentence_text.y = app.screen.height / 2 - sentence_text.height / 2;
    app.stage.addChild(sentence_text);
    function showNextText() {
      sentence_text.text = i.toString();
      if (i == 0) {
        //console.log("opening終了");
        gameData.CurrentSceneName = "game_select";
        resolve();
        return;
      }

      //console.log(i);

      i--;
      playCollect();
      setTimeout(showNextText, 1000);
    }

    showNextText();
  });
}
