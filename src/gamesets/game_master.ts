// game_master.ts
import * as PIXI from "pixi.js";
import { getProp } from "../gamesets/gameConfig";
import { Keyboard } from "../gamesets/keybord";
import { settings } from "../SiteInterface";

export function initializeGame(app: PIXI.Application) {
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
  progressLine.moveTo(50, 300);
  progressLine.lineTo(app.screen.width - 50, 300);
  progressLine.stroke({
    width: 2,
    color: replaceHash(settings.colorTheme.colors.MainColor),
    alpha: 1,
  });
  app.stage.addChild(progressLine);
  Keyboard(app);
}
export function replaceHash(color: string): string {
  if (typeof color !== "string") return "";
  return color.startsWith("#") ? color.replace("#", "0x") : color;
}
