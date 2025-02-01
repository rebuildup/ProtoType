import * as PIXI from "pixi.js";
import { replaceHash } from "./game_master";
import { getProp } from "../gamesets/gameConfig";
import { Keyboard } from "../gamesets/keybord";
import { settings } from "../SiteInterface";
export function game_scene(app: PIXI.Application) {
  const sentetce_text = new PIXI.Text({
    text: "構想は練った...後は作るだけ",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  sentetce_text.x = app.screen.width / 2 - sentetce_text.width / 2;
  sentetce_text.y = 150;
  app.stage.addChild(sentetce_text);
  const alphabet_text = new PIXI.Text({
    text: "kousouhanetta...atohatukurudake",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  alphabet_text.x = app.screen.width / 2 - alphabet_text.width / 2;
  alphabet_text.y = 180;
  app.stage.addChild(alphabet_text);
  const next_text = new PIXI.Text({
    text: "昨年はゲーム部門1位でした",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 16,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  next_text.x = app.screen.width / 2 - next_text.width / 2;
  next_text.y = 230;
  app.stage.addChild(next_text);

  const score_text = new PIXI.Text({
    text: "30000",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  score_text.x = app.screen.width / 2 - score_text.width / 2;
  score_text.y = 10;
  app.stage.addChild(score_text);

  const combo_text = new PIXI.Text({
    text: "30",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  combo_text.x = app.screen.width / 2 - combo_text.width / 2;
  combo_text.y = 300;
  app.stage.addChild(combo_text);

  const accuracyLine = new PIXI.Graphics();
  accuracyLine.moveTo(50, 50);
  accuracyLine.lineTo(app.screen.width - 50, 50);
  accuracyLine.stroke({
    width: 2,
    color: replaceHash(settings.colorTheme.colors.MainColor),
    alpha: 1,
  });
  app.stage.addChild(accuracyLine);
  const progressLine = new PIXI.Graphics();
  progressLine.moveTo(50, 280);
  progressLine.lineTo(app.screen.width - 50, 280);
  progressLine.stroke({
    width: 2,
    color: replaceHash(settings.colorTheme.colors.MainColor),
    alpha: 1,
  });
  app.stage.addChild(progressLine);
  const progressDot = new PIXI.Graphics();

  progressDot.circle(100, 280, 1);
  progressDot.stroke({
    width: 8,
    color: replaceHash(settings.colorTheme.colors.MainColor),
  });
  app.stage.addChild(progressDot);
  Keyboard(app);
  return;
}
