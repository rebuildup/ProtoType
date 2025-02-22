import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);
import { gameData } from "./002_gameConfig";
import { settings } from "../SiteInterface";
import { replaceHash } from "./001_game_master";
import { playCollect } from "./012_soundplay";
import { BG_grid } from "./018_grid";
import { getLatestKey } from "./009_keyinput";

import { GlowFilter } from "pixi-filters";

const button_spacing = 120;
export function game_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    app.stage.removeChildren();
    const glowFilter = new GlowFilter({
      distance: 28, // Glow distance
      outerStrength: 20, // Outer glow strength
      innerStrength: 0, // Inner glow strength
      color: 0xffffff, // Glow color
      quality: 0.4,
      alpha: 0.02, // Glow quality
    });
    BG_grid(app);
    const game_select_text = make_Button("ゲーム選択");
    game_select_text.x = app.screen.width / 2 - game_select_text.width / 2;
    game_select_text.y = app.screen.height / 2 - game_select_text.height / 2;
    game_select_text.interactive = true;
    game_select_text.on("pointerdown", async () => {
      await game_mode_select(app);
      resolve();
    });
    app.stage.addChild(game_select_text);
    game_select_text.filters = [glowFilter];

    const setting_select_text = make_Button("ゲーム設定");
    setting_select_text.x =
      app.screen.width / 2 - setting_select_text.width / 2;
    setting_select_text.y =
      app.screen.height / 2 - setting_select_text.height / 2 + button_spacing;
    setting_select_text.interactive = true;
    setting_select_text.on("pointerdown", async () => {
      gameData.CurrentSceneName = "setting_scene";
      resolve();
    });
    app.stage.addChild(setting_select_text);
    setting_select_text.filters = [glowFilter];

    const record_text = make_Button("プレイ記録");
    record_text.x = app.screen.width / 2 - record_text.width / 2;
    record_text.y =
      app.screen.height / 2 - record_text.height / 2 - button_spacing;
    record_text.interactive = true;
    record_text.on("pointerdown", async () => {
      gameData.CurrentSceneName = "record_scene";
      resolve();
    });
    app.stage.addChild(record_text);
    record_text.filters = [glowFilter];

    const SelectDot_red = new PIXI.Graphics();
    SelectDot_red.circle(0, 0, 8);
    SelectDot_red.x = app.screen.width / 2 + (game_select_text.width / 2 + 20);
    SelectDot_red.y = app.screen.height / 2;
    SelectDot_red.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    SelectDot_red.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    app.stage.addChild(SelectDot_red);
    SelectDot_red.filters = [glowFilter];

    const SelectDot_white = new PIXI.Graphics();
    SelectDot_white.circle(0, 0, 8);
    SelectDot_white.x =
      app.screen.width / 2 - (game_select_text.width / 2 + 15);
    SelectDot_white.y = app.screen.height / 2;
    SelectDot_white.fill(replaceHash(settings.colorTheme.colors.MainColor));
    SelectDot_white.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(SelectDot_white);
    SelectDot_white.filters = [glowFilter];

    let select = 1;
    let fragloop = true;
    while (fragloop) {
      const keyCode = await getLatestKey();
      if (
        keyCode.code == "ArrowDown" ||
        keyCode.code == "ArrowRight" ||
        keyCode.code == "ShiftRight"
      ) {
        switch (select) {
          case 0:
            select = 1;
            break;
          case 1:
            select = 2;
            break;
          case 2:
            select = 0;
            break;
        }
        switch (select) {
          case 0:
            select_anim(
              SelectDot_red,
              app.screen.height / 2 - button_spacing,
              0,
              true
            );
            select_anim(
              SelectDot_white,
              app.screen.height / 2 - button_spacing,
              0.03,
              true
            );
            break;
          case 1:
            select_anim(SelectDot_red, app.screen.height / 2, 0, true);
            select_anim(SelectDot_white, app.screen.height / 2, 0.03, true);
            break;
          case 2:
            select_anim(
              SelectDot_red,
              app.screen.height / 2 + button_spacing,
              0,
              true
            );
            select_anim(
              SelectDot_white,
              app.screen.height / 2 + button_spacing,
              0.03,
              true
            );
            break;
        }
      } else if (
        keyCode.code == "ArrowUp" ||
        keyCode.code == "ArrowLeft" ||
        keyCode.code == "ShiftLeft"
      ) {
        switch (select) {
          case 0:
            select = 2;
            break;
          case 1:
            select = 0;
            break;
          case 2:
            select = 1;
            break;
        }
        switch (select) {
          case 0:
            select_anim(
              SelectDot_red,
              app.screen.height / 2 - button_spacing,
              0.03,
              false
            );
            select_anim(
              SelectDot_white,
              app.screen.height / 2 - button_spacing,
              0,
              false
            );
            break;
          case 1:
            select_anim(SelectDot_red, app.screen.height / 2, 0.03, false);
            select_anim(SelectDot_white, app.screen.height / 2, 0, false);
            break;
          case 2:
            select_anim(
              SelectDot_red,
              app.screen.height / 2 + button_spacing,
              0.03,
              false
            );
            select_anim(
              SelectDot_white,
              app.screen.height / 2 + button_spacing,
              0,
              false
            );
            break;
        }
      } else if (keyCode.code == "Enter" || keyCode.code == "Space") {
        fragloop = false;
        switch (select) {
          case 0:
            gameData.CurrentSceneName = "record_scene";
            resolve();
            break;
          case 1:
            await game_mode_select(app);
            resolve();
            break;
          case 2:
            gameData.CurrentSceneName = "setting_scene";
            resolve();
            break;
        }
      }
    }
  });
}
function select_anim(
  g: PIXI.Graphics,
  to_Y: number,
  delay: number,
  direction: boolean
) {
  gsap.fromTo(
    g,
    { y: direction ? to_Y - 50 : to_Y + 50, alpha: 0 },
    { y: to_Y, alpha: 1, duration: 0.5, ease: "power4.out", delay: delay }
  );
}
function game_mode_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    app.stage.removeChildren();
    BG_grid(app);
    playCollect();
    const select_long = make_Button("長文モード");
    select_long.x = app.screen.width / 2 + 50;
    select_long.y =
      app.screen.height / 2 - select_long.height / 2 - button_spacing * 2;
    select_long.on("pointerdown", async () => {
      gameData.GameMode = "long";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });

    const select_focus = make_Button("集中モード");
    select_focus.x = app.screen.width / 2 + 25 + 50;
    select_focus.y =
      app.screen.height / 2 - select_focus.height / 2 - button_spacing;
    select_focus.on("pointerdown", async () => {
      gameData.GameMode = "focus";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_focus.interactive = true;
    app.stage.addChild(select_focus);

    const select_nomal = make_Button("スタンダード");
    select_nomal.x = app.screen.width / 2 + 30 + 50;
    select_nomal.y = app.screen.height / 2 - select_nomal.height / 2;
    select_nomal.on("pointerdown", async () => {
      gameData.GameMode = "nomal";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_nomal.interactive = true;
    app.stage.addChild(select_nomal);

    const select_exact = make_Button("正確性重視");
    select_exact.x = app.screen.width / 2 + 25 + 50;
    select_exact.y =
      app.screen.height / 2 - select_exact.height / 2 + button_spacing;
    select_exact.on("pointerdown", async () => {
      gameData.GameMode = "exact";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_exact.interactive = true;
    app.stage.addChild(select_exact);

    select_long.interactive = true;
    app.stage.addChild(select_long);

    const select_number = make_Button("数値入力");
    select_number.x = app.screen.width / 2 + 50;
    select_number.y =
      app.screen.height / 2 - select_number.height / 2 + button_spacing * 2;
    select_number.on("pointerdown", async () => {
      gameData.GameMode = "number";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_number.interactive = true;
    app.stage.addChild(select_number);
    while (gameData.CurrentSceneName == "game_select") {
      const keyCode = await getLatestKey();
      if (keyCode.code == "Escape") {
        gameData.CurrentSceneName = "game_select";
        resolve();
      }
    }
  });
}

function make_Button(text: string) {
  const output = new PIXI.Text({
    text: text,
    style: {
      fontFamily: gameData.FontFamily,
      fontSize: 42,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  return output;
}
