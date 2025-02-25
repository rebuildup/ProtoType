import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);
import { gameData } from "./002_gameConfig";
import { settings } from "../SiteInterface";
import { replaceHash } from "./001_game_master";
import { playCollect, playMiss } from "./012_soundplay";
import { BG_grid } from "./018_grid";
import { getLatestKey } from "./009_keyinput";

import { GlowFilter } from "pixi-filters";
//import { scale } from "./011_keybord";

const button_spacing = 120;
export async function game_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    app.stage.removeChildren();
    const glowFilter = new GlowFilter({
      distance: 28, // Glow distance
      outerStrength: 10, // Outer glow strength
      innerStrength: 0, // Inner glow strength
      color: replaceHash(settings.colorTheme.colors.MainColor), // Glow color
      quality: 0.001,
      alpha: 0.01, // Glow quality
    });
    BG_grid(app);

    const waku_circle = new PIXI.Graphics();
    waku_circle.label = "waku_circle";
    waku_circle.circle(0, 0, 840);
    waku_circle.x = app.screen.width / 2;
    waku_circle.y = app.screen.height / 2;

    waku_circle.stroke({
      width: 2,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(waku_circle);
    waku_circle.filters = [glowFilter];
    gsap.fromTo(
      waku_circle.scale,
      {
        x: 1.2,
        y: 1.2,
      },
      {
        x: 1,
        y: 1,
        duration: 2,
        ease: "power4.out",
      }
    );

    const circle_acc = new PIXI.Graphics();
    circle_acc.label = "circle_acc";
    circle_acc.circle(0, 0, 1000);
    circle_acc.x = app.screen.width / 2 - 300;
    circle_acc.y = app.screen.height / 2 - 280;
    circle_acc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    circle_acc.scale = 0.3;
    circle_acc.alpha = 0.8;
    circle_acc.filters = [glowFilter];
    app.stage.addChild(circle_acc);
    gsap.from(circle_acc.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
      delay: 0.2,
    });

    const circle_main = new PIXI.Graphics();
    circle_main.label = "circle_main";
    circle_main.circle(0, 0, 1000);
    circle_main.x = app.screen.width / 2 + 300;
    circle_main.y = app.screen.height / 2 + 280;
    circle_main.fill(replaceHash(settings.colorTheme.colors.MainColor));
    circle_main.scale = 0.2;
    circle_main.alpha = 0.8;
    circle_main.filters = [glowFilter];
    app.stage.addChild(circle_main);
    gsap.from(circle_main.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
      delay: 0.4,
    });

    const game_select_text = make_Button("ゲーム選択");
    game_select_text.x = app.screen.width / 2 - game_select_text.width / 2;
    game_select_text.y = app.screen.height / 2 - game_select_text.height / 2;
    game_select_text.interactive = true;

    app.stage.addChild(game_select_text);
    game_select_text.filters = [glowFilter];

    const setting_select_text = make_Button("ゲーム設定");
    setting_select_text.x =
      app.screen.width / 2 - setting_select_text.width / 2;
    setting_select_text.y =
      app.screen.height / 2 - setting_select_text.height / 2 + button_spacing;
    setting_select_text.interactive = true;

    app.stage.addChild(setting_select_text);
    setting_select_text.filters = [glowFilter];

    const record_text = make_Button("プレイ記録");
    record_text.x = app.screen.width / 2 - record_text.width / 2;
    record_text.y =
      app.screen.height / 2 - record_text.height / 2 - button_spacing;
    record_text.interactive = true;

    app.stage.addChild(record_text);
    record_text.filters = [glowFilter];

    const SelectDot_acc = new PIXI.Graphics();
    SelectDot_acc.circle(0, 0, 8);
    SelectDot_acc.x = app.screen.width / 2 + (game_select_text.width / 2 + 20);
    SelectDot_acc.y = app.screen.height / 2;
    SelectDot_acc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    SelectDot_acc.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    app.stage.addChild(SelectDot_acc);
    SelectDot_acc.filters = [glowFilter];
    gsap.from(SelectDot_acc.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
    });

    const SelectDot_main = new PIXI.Graphics();
    SelectDot_main.circle(0, 0, 8);
    SelectDot_main.x = app.screen.width / 2 - (game_select_text.width / 2 + 15);
    SelectDot_main.y = app.screen.height / 2;
    SelectDot_main.fill(replaceHash(settings.colorTheme.colors.MainColor));
    SelectDot_main.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(SelectDot_main);
    SelectDot_main.filters = [glowFilter];
    gsap.from(SelectDot_main.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
    });

    let select = 1;
    function scene_m() {
      gsap.to(waku_circle.scale, {
        x: 1.2,
        y: 1.2,
        duration: 0.5,
        ease: "power4.out",
      });
      gsap.to(record_text, { alpha: 0, duration: 0.5 });
      gsap.to(setting_select_text, { alpha: 0, duration: 0.5 });
      gsap.to(game_select_text, { alpha: 0, duration: 0.5 });
      gsap.to(SelectDot_acc, { alpha: 0, duration: 0.5 });
      gsap.to(SelectDot_main, { alpha: 0, duration: 0.5 });
    }
    function rec_m() {
      scene_m();
      gameData.CurrentSceneName = "record_scene";
      gsap.to(circle_main, {
        alpha: 0,
        ease: "power4.out",
        duration: 0.5,
      });
      gsap.to(circle_acc, {
        x: app.screen.width / 2,
        y: app.screen.height / 2,

        ease: "power4.out",
        duration: 1,
      });
      gsap.to(circle_acc.scale, {
        x: 1,
        y: 1,
        ease: "power4.out",
        duration: 1,
        delay: 0.5,
      });
      setTimeout(() => {
        resolve();
      }, 1000);
    }
    record_text.on("pointerdown", async () => {
      rec_m();
    });
    function set_m() {
      scene_m();
      gameData.CurrentSceneName = "setting_scene";
      gsap.to(circle_acc, {
        alpha: 0,
        ease: "power4.out",
        duration: 0.5,
      });
      gsap.to(circle_main, {
        x: app.screen.width / 2,
        y: app.screen.height / 2,

        ease: "power4.out",
        duration: 1,
      });
      gsap.to(circle_main.scale, {
        x: 1,
        y: 1,
        ease: "power4.out",
        duration: 1,
        delay: 0.5,
      });
      setTimeout(() => {
        resolve();
      }, 1000);
    }
    setting_select_text.on("pointerdown", async () => {
      set_m();
    });
    function game_mode_m() {
      scene_m();
      gameData.CurrentSceneName = "game_mode_select_scene";
      gsap.to(circle_main, {
        alpha: 0,
        ease: "power4.out",
        duration: 0.5,
      });
      gsap.to(circle_acc, {
        x: app.screen.width / 2,
        y: app.screen.height / 2,

        ease: "power4.out",
        duration: 1,
      });
      gsap.to(circle_acc.scale, {
        x: 0.16,
        y: 0.16,
        ease: "power4.out",
        duration: 1,
        delay: 0.5,
      });
      setTimeout(async () => {
        await game_mode_select(app);
        resolve();
      }, 1000);
    }
    game_select_text.on("pointerdown", async () => {
      game_mode_m();
    });

    while (gameData.CurrentSceneName == "game_select") {
      const keyCode = await getLatestKey();

      if (
        keyCode.code == "ArrowDown" ||
        keyCode.code == "ArrowRight" ||
        keyCode.code == "ShiftRight"
      ) {
        playMiss();
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
              SelectDot_acc,
              app.screen.height / 2 - button_spacing,
              0,
              true
            );
            select_anim(
              SelectDot_main,
              app.screen.height / 2 - button_spacing,
              0.03,
              true
            );
            break;
          case 1:
            select_anim(SelectDot_acc, app.screen.height / 2, 0, true);
            select_anim(SelectDot_main, app.screen.height / 2, 0.03, true);
            break;
          case 2:
            select_anim(
              SelectDot_acc,
              app.screen.height / 2 + button_spacing,
              0,
              true
            );
            select_anim(
              SelectDot_main,
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
        playMiss();
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
              SelectDot_acc,
              app.screen.height / 2 - button_spacing,
              0.03,
              false
            );
            select_anim(
              SelectDot_main,
              app.screen.height / 2 - button_spacing,
              0,
              false
            );
            break;
          case 1:
            select_anim(SelectDot_acc, app.screen.height / 2, 0.03, false);
            select_anim(SelectDot_main, app.screen.height / 2, 0, false);
            break;
          case 2:
            select_anim(
              SelectDot_acc,
              app.screen.height / 2 + button_spacing,
              0.03,
              false
            );
            select_anim(
              SelectDot_main,
              app.screen.height / 2 + button_spacing,
              0,
              false
            );
            break;
        }
      } else if (keyCode.code == "Enter" || keyCode.code == "Space") {
        switch (select) {
          case 0:
            rec_m();

            break;
          case 1:
            game_mode_m();

            break;
          case 2:
            set_m();
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
    { y: direction ? to_Y - 10 : to_Y + 10, alpha: 0 },
    { y: to_Y, alpha: 1, duration: 0.5, ease: "power4.out", delay: delay }
  );
}
function game_mode_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    //app.stage.removeChildren();
    //BG_grid(app);
    playCollect();
    const circle_radius = 410;
    const circle_acc = app.stage.children.find(
      (child) => child.label === "circle_acc"
    );
    const waku_circle = app.stage.children.find(
      (child) => child.label === "waku_circle"
    );
    if (waku_circle) {
      gsap.fromTo(
        waku_circle.scale,
        {
          x: 1.2,
          y: 1.2,
        },
        {
          x: 0.95,
          y: 0.95,
          duration: 1.5,
          ease: "power4.out",
        }
      );
    }

    if (circle_acc) {
      gsap.to(circle_acc, {
        x: app.screen.width / 2 - 200,
        duration: 1.5,
        ease: "power4.out",
      });
    }
    const mask = new PIXI.Graphics();
    mask.circle(0, 0, 155).fill(replaceHash(settings.colorTheme.colors.MainBG));
    mask.x = app.screen.width / 2;
    mask.y = app.screen.height / 2;
    app.stage.addChild(mask);
    gsap.fromTo(
      mask,
      {
        x: app.screen.width / 2,
        y: app.screen.height / 2,
      },
      {
        x: app.screen.width / 2 - 200,
        duration: 1.5,
        ease: "power4.out",
      }
    );
    gsap.from(mask.scale, { x: 0, y: 0, duration: 1.5, ease: "power4.out" });

    const SelectDot_acc = new PIXI.Graphics();
    SelectDot_acc.circle(circle_radius, 0, 8);
    SelectDot_acc.x = app.screen.width / 2 - 200 - 20;
    SelectDot_acc.y = app.screen.height / 2;
    SelectDot_acc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    SelectDot_acc.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    app.stage.addChild(SelectDot_acc);
    gsap.fromTo(
      SelectDot_acc,
      { alpha: 0 },
      { alpha: 1, duration: 2, ease: "power3.out" }
    );
    function dot_move(selected: number) {
      let rot;
      switch (selected) {
        case 0:
          rot = -Math.PI / 5;
          break;
        case 1:
          rot = -Math.PI / 10;
          break;
        case 2:
          rot = 0;
          break;
        case 3:
          rot = Math.PI / 10;
          break;
        case 4:
          rot = Math.PI / 5;
          break;
        default:
          rot = 0;
          break;
      }
      /*
      gsap.fromTo(
        SelectDot_acc,
        { rotation: d ? rot - 0.5 : rot + 0.5, alpha: 0 },
        { rotation: rot, alpha: 1, duration: 1, ease: "power4.out" }
      );*/

      gsap.to(SelectDot_acc, {
        rotation: rot,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    const select_long = make_Button("長文モード");
    select_long.x = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_long.height / 2,
      circle_radius,
      -Math.PI / 5
    ).x;
    select_long.y = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_long.height / 2,
      circle_radius,
      -Math.PI / 5
    ).y;
    select_long.on("pointerdown", async () => {
      gameData.GameMode = "long";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });

    const select_focus = make_Button("集中モード");
    select_focus.x = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_focus.height / 2,
      circle_radius,
      -Math.PI / 10
    ).x;
    select_focus.y = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_focus.height / 2,
      circle_radius,
      -Math.PI / 10
    ).y;
    select_focus.on("pointerdown", async () => {
      gameData.GameMode = "focus";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_focus.interactive = true;
    app.stage.addChild(select_focus);

    const select_nomal = make_Button("スタンダード");
    select_nomal.x = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_nomal.height / 2,
      circle_radius,
      0
    ).x;
    select_nomal.y = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_nomal.height / 2,
      circle_radius,
      0
    ).y;
    select_nomal.on("pointerdown", async () => {
      gameData.GameMode = "nomal";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_nomal.interactive = true;
    app.stage.addChild(select_nomal);

    const select_exact = make_Button("正確性重視");
    select_exact.x = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_exact.height / 2,
      circle_radius,
      Math.PI / 10
    ).x;
    select_exact.y = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_exact.height / 2,
      circle_radius,
      Math.PI / 10
    ).y;
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
    select_number.x = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_number.height / 2,
      circle_radius,
      Math.PI / 5
    ).x;
    select_number.y = getCircularPosition(
      app.screen.width / 2 - 200,
      app.screen.height / 2 - select_number.height / 2,
      circle_radius,
      Math.PI / 5
    ).y;
    select_number.on("pointerdown", async () => {
      gameData.GameMode = "number";
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    select_number.interactive = true;
    app.stage.addChild(select_number);
    function get_out() {
      gameData.CurrentSceneName = "game_select";
      resolve();
    }
    let select_m = 2;
    while (gameData.CurrentSceneName == "game_mode_select_scene") {
      const keyCode = await getLatestKey();
      if (
        keyCode.code == "ArrowDown" ||
        keyCode.code == "ArrowRight" ||
        keyCode.code == "ShiftRight"
      ) {
        select_m++;
        if (select_m > 4) {
          select_m = 0;
        }
        dot_move(select_m);
      } else if (
        keyCode.code == "ArrowUp" ||
        keyCode.code == "ArrowLeft" ||
        keyCode.code == "ShiftLeft"
      ) {
        select_m--;
        if (select_m < 0) {
          select_m = 4;
        }
        dot_move(select_m);
      } else if (keyCode.code == "Escape") {
        get_out();
      } else if (keyCode.code == "Enter" || keyCode.code == "Space") {
        switch (select_m) {
          case 0:
            gameData.GameMode = "long";
            break;
          case 1:
            gameData.GameMode = "focus";
            break;
          case 2:
            gameData.GameMode = "nomal";
            break;
          case 3:
            gameData.GameMode = "exact";
            break;
          case 4:
            gameData.GameMode = "number";
            break;
          default:
            gameData.GameMode = "nomal";
            break;
        }
        gameData.CurrentSceneName = "game_scene";
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
function getCircularPosition(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
