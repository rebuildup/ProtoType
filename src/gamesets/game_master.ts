// game_master.ts
import * as PIXI from "pixi.js";
import { game_scene } from "./game_scene";

import { playCollect, playMiss } from "./soundplay";

import { fetchGASData } from "./textget";

import { getRomajiPatterns } from "./generate_pattern";

export function initializeGame(app: PIXI.Application) {
  game_scene(app);
  fetchGASData();
  playCollect();
  playMiss();
  console.log("totemo");
  console.log(getRomajiPatterns("こんなん"));
}
export function replaceHash(color: string): string {
  if (typeof color !== "string") return "";
  return color.startsWith("#") ? color.replace("#", "0x") : color;
}
