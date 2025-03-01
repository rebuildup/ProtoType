import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";

import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);

import { getLatestKey, isNomalKey, keyCodeToText } from "./009_keyinput";

export function Player_register(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    app.stage.removeChildren();
    const screenCenter = { x: app.screen.width / 2, y: app.screen.height / 2 };
    let player_name = "";
    const select_select = new PIXI.Text({
      text: "Go",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 30,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = screenCenter.x - select_select.width / 2;
    select_select.y = screenCenter.y - select_select.height / 2 + 100;
    select_select.interactive = true;

    let currentKeyController: AbortController | null = null;

    select_select.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_scene";
      get_out();
    });
    app.stage.addChild(select_select);

    const input_waku = new PIXI.Graphics();
    input_waku.roundRect(0, 0, 480, 80, 50).stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    input_waku.x = screenCenter.x - input_waku.width / 2;
    input_waku.y = screenCenter.y - input_waku.height / 2;
    app.stage.addChild(input_waku);

    const player_name_text = new PIXI.Text({
      text: gameData.current_Player_name,
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 30,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });

    player_name_text.x = screenCenter.x - player_name_text.width / 2;
    player_name_text.y = screenCenter.y - player_name_text.height / 2;
    app.stage.addChild(player_name_text);

    function get_out() {
      currentKeyController?.abort();
      gsap.to(select_select, { alpha: 0, ease: "power4.out", duration: 1 });
      setTimeout(() => {
        resolve();
      }, 1000);
    }

    while (gameData.CurrentSceneName === "register_scene") {
      currentKeyController = new AbortController();
      try {
        const keyCode = await getLatestKey(currentKeyController.signal);
        console.log(keyCode);
        if (keyCode.code === "Escape") {
          gameData.CurrentSceneName = "game_select";
          get_out();
        } else if (keyCode.code === "Backspace") {
          console.log("baa");
          if (player_name.length > 0) player_name = player_name.slice(0, -1);
          player_name_text.text = player_name;
          player_name_text.x = screenCenter.x - player_name_text.width / 2;
        } else if (isNomalKey(keyCode.code)) {
          if (player_name.length < 10) {
            player_name += keyCodeToText(keyCode.code, keyCode.shift);
            player_name_text.text = player_name;
            player_name_text.x = screenCenter.x - player_name_text.width / 2;
          }
        } else if (keyCode.code === "Enter") {
          gameData.CurrentSceneName = "game_scene";
          if (player_name.length != 0) {
            gameData.current_Player_name = player_name;
          }
          get_out();
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          break;
        } else {
          console.error(error);
        }
      }
    }
  });
}
