import * as PIXI from "pixi.js";
import { setProp, getProp } from "./gameConfig";
import { replaceHash } from "./game_master";
import { settings } from "../SiteInterface";

export function opening_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    app.stage.removeChildren();

    let i = 0;

    function showNextText() {
      app.stage.removeChildren();
      if (i >= 10) {
        console.log("opening終了");
        setProp("CurrentSceneName", "game_scene");
        resolve(); // ここでPromiseを解決しないと、次の処理に進まない
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
      sentence_text.y = 150;
      app.stage.addChild(sentence_text);

      i++;

      setTimeout(showNextText, 2000); // 200msごとに次のテキストを表示
    }

    showNextText(); // ループの最初の呼び出し
  });
}
