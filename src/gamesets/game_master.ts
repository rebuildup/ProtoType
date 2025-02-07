// game_master.ts
import * as PIXI from "pixi.js";
import { game_scene } from "./game_scene";

import { playCollect, playMiss } from "./soundplay";

import { gameData } from "./gameConfig";

import { opening_scene } from "./opening";
import { game_select } from "./game_select";
import { setting_scene } from "./setting_scene";
import { result_scene } from "./result_scene";

import { settings } from "../SiteInterface";
import { fetchTexts /*, postPlayData */ } from "./APIget";

export async function initializeGame(app: PIXI.Application) {
  const loading_text = new PIXI.Text({
    text: "Loading",
    style: {
      fontFamily: gameData.FontFamily,
      fontSize: 50,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  loading_text.x = app.screen.width / 2 - loading_text.width / 2;
  loading_text.y = app.screen.height / 2 - loading_text.height / 2;
  app.stage.addChild(loading_text);
  try {
    const textsData = await fetchTexts();
    gameData.textsData = textsData;
  } catch (error) {
    console.error(error);
  }
  /*
  try {
    const result = await postPlayData("いいね！", 3333);
    console.log("Post result:", result);
  } catch (error) {
    console.error(error);
  }
    */
  //setProp("CurrentSceneName", "opening");
  gameData.CurrentSceneName = "game_scene";
  gameData.GameMode = "nomal";
  gameData.FontFamily = settings.fontTheme.fontFamily;
  while (gameData.CurrentSceneName != "exit") {
    switch (gameData.CurrentSceneName) {
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
        gameData.CurrentSceneName = "exit";
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
