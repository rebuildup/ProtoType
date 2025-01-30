// game_master.ts
import * as PIXI from "pixi.js";
import { getProp } from "../gamesets/gameConfig";
import { Keyboard } from "../gamesets/keybord";
import { settings } from "../SiteInterface";

export function initializeGame(app: PIXI.Application) {
  console.log(settings.colorTheme.colors.MainAccent);
  Keyboard(app);
}
export function replaceHash(color: string): string {
  if (typeof color !== "string") return "";
  return color.startsWith("#") ? color.replace("#", "0x") : color;
}
