import * as PIXI from "pixi.js";
import { getProp, setProp } from "./gameConfig";
import { settings } from "../SiteInterface";
import { replaceHash } from "./game_master";
import { playCollect } from "./soundplay";
export function game_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    app.stage.removeChildren();
    const game_select_text = make_Button("ゲーム選択");
    game_select_text.x = app.screen.width / 2 - game_select_text.width / 2;
    game_select_text.y = app.screen.height / 2 - game_select_text.height / 2;
    game_select_text.interactive = true;
    game_select_text.on("pointerdown", async () => {
      await game_mode_select(app);
      resolve();
    });
    app.stage.addChild(game_select_text);

    const setting_select_text = make_Button("設定");
    setting_select_text.x =
      app.screen.width / 2 - setting_select_text.width / 2;
    setting_select_text.y =
      app.screen.height / 2 - setting_select_text.height / 2 + 50;
    setting_select_text.interactive = true;
    setting_select_text.on("pointerdown", async () => {
      console.log("setting_scene");
      setProp("CurrentSceneName", "setting_scene");
      resolve();
    });
    app.stage.addChild(setting_select_text);

    const record_text = make_Button("プレイ記録");
    record_text.x = app.screen.width / 2 - record_text.width / 2;
    record_text.y = app.screen.height / 2 - record_text.height / 2 - 50;
    record_text.interactive = true;
    record_text.on("pointerdown", async () => {
      setProp("CurrentSceneName", "setting_scene");
      resolve();
    });
    app.stage.addChild(record_text);
  });
}
function game_mode_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    app.stage.removeChildren();

    playCollect();

    const select_nomal = make_Button("スタンダード");
    select_nomal.x = app.screen.width / 2 - select_nomal.width / 2;
    select_nomal.y = app.screen.height / 2 - select_nomal.height / 2 - 75;
    select_nomal.on("pointerdown", async () => {
      setProp("GameMode", "nomal");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    select_nomal.interactive = true;
    app.stage.addChild(select_nomal);

    const select_focus = make_Button("集中モード");
    select_focus.x = app.screen.width / 2 - select_focus.width / 2;
    select_focus.y = app.screen.height / 2 - select_focus.height / 2 - 25;
    select_focus.on("pointerdown", async () => {
      setProp("GameMode", "focus");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    select_focus.interactive = true;
    app.stage.addChild(select_focus);

    const select_exact = make_Button("正確性重視");
    select_exact.x = app.screen.width / 2 - select_exact.width / 2;
    select_exact.y = app.screen.height / 2 - select_exact.height / 2 + 25;
    select_exact.on("pointerdown", async () => {
      setProp("GameMode", "exact");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    select_exact.interactive = true;
    app.stage.addChild(select_exact);

    const select_long = make_Button("ランダム長文");
    select_long.x = app.screen.width / 2 - select_long.width / 2;
    select_long.y = app.screen.height / 2 - select_long.height / 2 + 75;
    select_long.on("pointerdown", async () => {
      setProp("GameMode", "long");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    select_long.interactive = true;
    app.stage.addChild(select_long);
  });
}

function make_Button(text: string) {
  const output = new PIXI.Text({
    text: text,
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 60,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  return output;
}
