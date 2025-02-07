// game_master.ts
import * as PIXI from "pixi.js";
import { game_scene } from "./game_scene";

import { playCollect, playMiss } from "./soundplay";

import { getProp, setProp } from "./gameConfig";

import { opening_scene } from "./opening";
import { game_select } from "./game_select";
import { setting_scene } from "./setting_scene";
import { result_scene } from "./result_scene";
import { fetchTexts, postPlayData } from "./APIget";

//import { TextToRomaji } from "./generate_pattern";

export async function initializeGame(app: PIXI.Application) {
  try {
    const textsData = await fetchTexts();
    console.log("Texts data:", textsData);
  } catch (error) {
    console.error(error);
  }
  try {
    const result = await postPlayData("いいね！", 3333);
    console.log("Post result:", result);
  } catch (error) {
    console.error(error);
  }
  //setProp("CurrentSceneName", "opening");
  setProp("CurrentSceneName", "game_scene");
  while (getProp("CurrentSceneName") != "exit") {
    switch (getProp("CurrentSceneName")) {
      case "opening":
        playCollect();
        await opening_scene(app);
        break;
      case "game_scene":
        playCollect();
        await game_scene(app);
        break;
      case "game_select":
        playCollect();
        await game_select(app);
        break;
      case "setting_scene":
        playCollect();
        await setting_scene(app);
        break;
      case "result_scene":
        playCollect();
        await result_scene(app);
        break;
      default:
        setProp("CurrentSceneName", "exit");
        break;
    }
  }
  console.log("何が起こった？");
  playMiss();
  //console.log(TextToRomaji("げつようがちかいよ"));
}
export function replaceHash(color: string): string {
  if (typeof color !== "string") return "";
  return color.startsWith("#") ? color.replace("#", "0x") : color;
}
