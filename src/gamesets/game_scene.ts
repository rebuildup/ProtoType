import * as PIXI from "pixi.js";
import { replaceHash } from "./game_master";
import { getProp, setProp } from "../gamesets/gameConfig";
import { Keyboard } from "../gamesets/keybord";
import { settings } from "../SiteInterface";
import { getLatestKey } from "../gamesets/keyinput";

export async function game_scene(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    app.stage.removeChildren();

    const texts_num = 15;
    const texts_pos = { x: app.screen.width / 2, y: app.screen.height / 2 };
    let keybord_flag = true;

    switch (getProp("GameMode")) {
      case "nomal":
        keybord_flag = true;
        break;
      case "focus":
        keybord_flag = false;
        break;
      case "exact":
        keybord_flag = true;
        break;
      case "long":
        keybord_flag = true;
        break;
      default:
        console.log("gamemode nothing");
        resolve();
        break;
    }

    const sentetce_text = new PIXI.Text({
      text: "構想は練った...後は作るだけ",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    //sentetce_text.resolution = window.devicePixelRatio * 2;

    sentetce_text.x = app.screen.width / 2 - sentetce_text.width / 2;
    sentetce_text.y = 175;
    app.stage.addChild(sentetce_text);
    const alphabet_text = new PIXI.Text({
      text: "kousouhanetta...atohatukurudake",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    alphabet_text.x = app.screen.width / 2 - alphabet_text.width / 2;
    alphabet_text.y = 200;
    app.stage.addChild(alphabet_text);
    const next_text = new PIXI.Text({
      text: "昨年はゲーム部門1位でした",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    next_text.x = app.screen.width / 2 - next_text.width / 2;
    next_text.y = 251;
    app.stage.addChild(next_text);

    const score_text = new PIXI.Text({
      text: "30000",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    score_text.x = app.screen.width / 2 - score_text.width / 2;
    score_text.y = 100;
    app.stage.addChild(score_text);

    const combo_text = new PIXI.Text({
      text: "30",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    combo_text.x = 81;
    combo_text.y = 179;
    app.stage.addChild(combo_text);

    const kpm_text = new PIXI.Text({
      text: "5.2",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "right",
      },
    });
    kpm_text.x = app.screen.width - 81 - 32;
    kpm_text.y = 179;
    app.stage.addChild(kpm_text);

    const accuracyLine = new PIXI.Graphics();
    accuracyLine.moveTo(81, 87);
    accuracyLine.lineTo(app.screen.width - 81, 87);
    accuracyLine.stroke({
      width: 6,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      alpha: 1,
    });
    app.stage.addChild(accuracyLine);
    const progressLine = new PIXI.Graphics();
    progressLine.moveTo(81, 298);
    progressLine.lineTo(app.screen.width - 81, 298);
    progressLine.stroke({
      width: 6,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      alpha: 1,
    });
    app.stage.addChild(progressLine);
    const progressDot = new PIXI.Graphics();

    progressDot.circle(100, 280, 1);
    progressDot.stroke({
      width: 40,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(progressDot);
    if (keybord_flag) {
      Keyboard(app);
    }

    setProp("CurrentSceneName", "result_scene");
    while (true) {
      const keyCode = await getLatestKey();

      if (keyCode === "KeyE") {
        resolve();
        break;
      }
    }
  });
}
