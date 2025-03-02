import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";

import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);

import { getLatestKey } from "./009_keyinput";

import { keyLayouts } from "../components/012_KeyLayout";
const Select_dot_x = 880;
export function setting_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const screenCenter = { x: app.screen.width / 2, y: app.screen.height / 2 };
    const circle_m = new PIXI.Graphics();
    circle_m
      .circle(0, 0, 800)
      .fill(replaceHash(settings.colorTheme.colors.MainBG));
    circle_m.position = screenCenter;
    app.stage.addChild(circle_m);
    circle_m.scale = 0;
    gsap.to(circle_m.scale, { x: 1, y: 1, ease: "power4.out", duration: 2 });

    const select_select = new PIXI.Text({
      text: "↑",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 60,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = screenCenter.x - select_select.width / 2;
    select_select.y = 100;
    select_select.interactive = true;

    let currentKeyController: AbortController | null = null;

    select_select.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      get_out();
    });
    app.stage.addChild(select_select);
    const keylayout_text = new PIXI.Text({
      text: "キー配列",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    keylayout_text.x = screenCenter.x - keylayout_text.width / 2;
    keylayout_text.y = screenCenter.y - keylayout_text.height / 2 - 80;
    keylayout_text.interactive = true;
    keylayout_text.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      get_out();
    });
    app.stage.addChild(keylayout_text);
    const instantkey_n_text = new PIXI.Text({
      text: "瞬間キー数",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    instantkey_n_text.x = screenCenter.x - instantkey_n_text.width / 2;
    instantkey_n_text.y = screenCenter.y - instantkey_n_text.height / 2 + 80;
    instantkey_n_text.interactive = true;
    instantkey_n_text.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      get_out();
    });
    app.stage.addChild(instantkey_n_text);

    const selectDotAcc = new PIXI.Graphics();
    selectDotAcc.circle(0, 0, 8);
    selectDotAcc.position.set(
      Select_dot_x,
      keylayout_text.y + keylayout_text.height / 2
    );
    selectDotAcc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    selectDotAcc.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    app.stage.addChild(selectDotAcc);
    gsap.from(selectDotAcc.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
    });
    function dot_to(x: number, y: number) {
      gsap.to(selectDotAcc, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power4.out",
      });
    }

    function get_out() {
      currentKeyController?.abort();
      gsap.to(circle_m.scale, { x: 0, y: 0, ease: "power4.out", duration: 1 });
      gsap.to(select_select, { alpha: 0, ease: "power4.out", duration: 1 });
      setTimeout(() => {
        app.stage.removeChild(keylayout_text);
        app.stage.removeChild(instantkey_n_text);
        resolve();
      }, 1000);
    }
    const option_select_values = { keylayoutset: 0, instantkey_n: 1 };
    const opened_options = { menu: -1, keylayout: 0, instantkey: 1 };
    let isOpened_option = opened_options.menu;
    function dot_pos_update(select: number) {
      switch (select) {
        case option_select_values.keylayoutset:
          dot_to(Select_dot_x, keylayout_text.y + keylayout_text.height / 2);
          break;
        case option_select_values.instantkey_n:
          dot_to(
            Select_dot_x,
            instantkey_n_text.y + instantkey_n_text.height / 2
          );
          break;
      }
    }
    function update_open(opened: number, select: number = 0) {
      const lastcontainer = app.stage.children.find(
        (child) => child.label === "setting_container"
      );
      if (lastcontainer) {
        app.stage.removeChild(lastcontainer);
      }
      const setting_container = new PIXI.Container();
      setting_container.label = "setting_container";
      app.stage.addChild(setting_container);

      switch (opened) {
        case opened_options.menu:
          break;
        case opened_options.keylayout:
          const layout_container = new PIXI.Graphics();
          layout_container.fill(replaceHash(settings.colorTheme.colors.MainBG));
          layout_container.position = screenCenter;

          const layout_BG = new PIXI.Graphics();
          layout_BG
            .rect(0, 0, 800, 800)
            .fill(replaceHash(settings.colorTheme.colors.MainBG));
          layout_BG.alpha = 1;
          layout_BG.x = -layout_BG.width / 2;
          layout_BG.y = -layout_BG.height / 2;
          layout_container.addChild(layout_BG);
          for (let i = 0; i < keyLayouts.length; i++) {
            const layout_selection = new PIXI.Text({
              text: keyLayouts[i].name,
              style: {
                fontFamily: gameData.FontFamily,
                fontSize: 40,
                fill: replaceHash(settings.colorTheme.colors.MainColor),
                align: "center",
              },
            });
            layout_selection.alpha = i == select ? 1 : 0.5;
            layout_selection.x = -layout_selection.width / 2;
            layout_selection.y = (i - keyLayouts.length / 2) * 80;
            layout_container.addChild(layout_selection);
          }
          setting_container.addChild(layout_container);
          break;
        case opened_options.instantkey:
          const instant_container = new PIXI.Graphics();
          instant_container.fill(
            replaceHash(settings.colorTheme.colors.MainBG)
          );
          instant_container.position = screenCenter;

          const instant_BG = new PIXI.Graphics();
          instant_BG
            .rect(0, 0, 800, 800)
            .fill(replaceHash(settings.colorTheme.colors.MainBG));
          instant_BG.alpha = 1;
          instant_BG.x = -instant_BG.width / 2;
          instant_BG.y = -instant_BG.height / 2;
          instant_container.addChild(instant_BG);

          const instant_selection = new PIXI.Text({
            text: select,
            style: {
              fontFamily: gameData.FontFamily,
              fontSize: 40,
              fill: replaceHash(settings.colorTheme.colors.MainColor),
              align: "center",
            },
          });
          instant_selection.x = -instant_selection.width / 2;
          instant_selection.y = -instant_selection.height / 2;
          instant_container.addChild(instant_selection);

          setting_container.addChild(instant_container);
          break;
      }
    }
    let option_select = option_select_values.keylayoutset;
    let current_select = 0;
    while (gameData.CurrentSceneName === "setting_scene") {
      currentKeyController = new AbortController();
      try {
        const keyCode = await getLatestKey(currentKeyController.signal);
        if (keyCode.code === "Escape") {
          if (isOpened_option == opened_options.menu) {
            gameData.CurrentSceneName = "game_select";
            get_out();
          } else {
            isOpened_option = opened_options.menu;
            update_open(isOpened_option);
          }
        } else if (
          ["ArrowDown", "ArrowRight", "ShiftRight"].includes(keyCode.code)
        ) {
          switch (isOpened_option) {
            case opened_options.menu:
              if (option_select >= 1) {
                option_select = 0;
              } else {
                option_select++;
              }
              dot_pos_update(option_select);
              break;
            case opened_options.keylayout:
              if (current_select >= keyLayouts.length - 1) {
                current_select = 0;
              } else {
                current_select++;
              }
              update_open(isOpened_option, current_select);
              break;
            case opened_options.instantkey:
              if (current_select >= 100) {
                current_select = 0;
              } else {
                current_select++;
              }
              update_open(isOpened_option, current_select);
              break;
          }
        } else if (
          ["ArrowUp", "ArrowLeft", "ShiftLeft"].includes(keyCode.code)
        ) {
          switch (isOpened_option) {
            case opened_options.menu:
              if (option_select <= 0) {
                option_select = 1;
              } else {
                option_select--;
              }
              dot_pos_update(option_select);
              break;
            case opened_options.keylayout:
              if (current_select <= 0) {
                current_select = keyLayouts.length - 1;
              } else {
                current_select--;
              }
              update_open(isOpened_option, current_select);
              break;
            case opened_options.instantkey:
              if (current_select <= 0) {
                current_select = 100;
              } else {
                current_select--;
              }
              update_open(isOpened_option, current_select);
              break;
          }
        } else if (["Enter", "Space"].includes(keyCode.code)) {
          if (isOpened_option == opened_options.menu) {
            switch (option_select) {
              case option_select_values.keylayoutset:
                isOpened_option = opened_options.keylayout;
                current_select = keyLayouts.findIndex(
                  (layout) => layout.name === gameData.KeyLayout
                );
                break;
              case option_select_values.instantkey_n:
                isOpened_option = opened_options.instantkey;
                current_select = gameData.instant_key_n;
                break;
            }
            update_open(isOpened_option, current_select);
          } else if (isOpened_option == opened_options.keylayout) {
            gameData.KeyLayout = keyLayouts[current_select].name;
            isOpened_option = opened_options.menu;
            update_open(isOpened_option);
          } else if (isOpened_option == opened_options.instantkey) {
            gameData.instant_key_n = current_select;
            isOpened_option = opened_options.menu;
            update_open(isOpened_option);
          }
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
