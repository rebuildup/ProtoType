import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";

import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);

import { getLatestKey } from "./009_keyinput";
import { playMiss } from "./012_soundplay";

const Select_dot_x = 1170;
const opened_record = { play: 0, achieve: 1, ranking: 2, graph: 3 };
export function record_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    let isOpened_record = opened_record.play;
    const screenCenter = { x: app.screen.width / 2, y: app.screen.height / 2 };
    const circle_m = new PIXI.Graphics();
    circle_m
      .circle(0, 0, 800)
      .fill(replaceHash(settings.colorTheme.colors.MainBG));
    circle_m.position = screenCenter;
    app.stage.addChild(circle_m);
    circle_m.scale = 0;
    gsap.to(circle_m.scale, { x: 1, y: 1, ease: "power4.out", duration: 2 });

    const exit_btn = new PIXI.Text({
      text: "↓",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 60,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    exit_btn.x = screenCenter.x - exit_btn.width / 2;
    exit_btn.y = app.screen.height - 100;
    exit_btn.interactive = true;

    let currentKeyController: AbortController | null = null;

    exit_btn.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      get_out();
    });
    app.stage.addChild(exit_btn);

    const play_record_text = new PIXI.Text({
      text: "プレイ記録",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 26,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    play_record_text.x = Select_dot_x + 20;
    play_record_text.y = screenCenter.y - play_record_text.height / 2 - 120;
    play_record_text.interactive = true;
    play_record_text.on("pointerdown", async () => {
      playMiss(0.3);
      isOpened_record = opened_record.play;
      dot_pos_update(isOpened_record);
      update_open(isOpened_record);
    });
    app.stage.addChild(play_record_text);

    const achieve_text = new PIXI.Text({
      text: "実績一覧",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 26,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    achieve_text.x = Select_dot_x + 20;
    achieve_text.y = screenCenter.y - achieve_text.height / 2 - 40;
    achieve_text.interactive = true;
    achieve_text.on("pointerdown", async () => {
      playMiss(0.3);
      isOpened_record = opened_record.achieve;
      dot_pos_update(isOpened_record);
      update_open(isOpened_record);
    });
    app.stage.addChild(achieve_text);

    const ranking_text = new PIXI.Text({
      text: "ローカルランキング",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 26,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    ranking_text.x = Select_dot_x + 20;
    ranking_text.y = screenCenter.y - ranking_text.height / 2 + 40;
    ranking_text.interactive = true;
    ranking_text.on("pointerdown", async () => {
      playMiss(0.3);
      isOpened_record = opened_record.ranking;
      dot_pos_update(isOpened_record);
      update_open(isOpened_record);
    });
    app.stage.addChild(ranking_text);

    const graph_text = new PIXI.Text({
      text: "スコアグラフ",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 26,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    graph_text.x = Select_dot_x + 20;
    graph_text.y = screenCenter.y - graph_text.height / 2 + 120;
    graph_text.interactive = true;
    graph_text.on("pointerdown", async () => {
      playMiss(0.3);
      isOpened_record = opened_record.graph;
      dot_pos_update(isOpened_record);
      update_open(isOpened_record);
    });
    app.stage.addChild(graph_text);

    const selectDotAcc = new PIXI.Graphics();
    selectDotAcc.circle(0, 0, 8);
    selectDotAcc.position.set(
      Select_dot_x,
      play_record_text.y + play_record_text.height / 2
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
      gsap.to(exit_btn, { alpha: 0, ease: "power4.out", duration: 1 });
      setTimeout(() => {
        app.stage.removeChild(achieve_text);
        app.stage.removeChild(play_record_text);
        resolve();
      }, 1000);
    }
    function dot_pos_update(select: number) {
      switch (select) {
        case opened_record.play:
          dot_to(
            Select_dot_x,
            play_record_text.y + play_record_text.height / 2
          );
          break;
        case opened_record.achieve:
          dot_to(Select_dot_x, achieve_text.y + achieve_text.height / 2);
          break;
        case opened_record.ranking:
          dot_to(Select_dot_x, ranking_text.y + ranking_text.height / 2);
          break;
        case opened_record.graph:
          dot_to(Select_dot_x, graph_text.y + graph_text.height / 2);
          break;
      }
    }
    function update_open(opened: number) {
      const lastcontainer = app.stage.children.find(
        (child) => child.label === "record_container"
      );
      if (lastcontainer) {
        app.stage.removeChild(lastcontainer);
      }
      const last_record_title = app.stage.children.find(
        (child) => child.label === "record_title"
      );
      if (last_record_title) {
        app.stage.removeChild(last_record_title);
      }
      const record_container = new PIXI.Container();
      record_container.label = "record_container";
      app.stage.addChild(record_container);

      const scroll_mask = new PIXI.Graphics();
      scroll_mask
        .rect(300, 200, app.screen.width - 600, app.screen.height - 400)
        .fill(replaceHash(settings.colorTheme.colors.SecondAccent));
      scroll_mask.x = 0;
      scroll_mask.y = 0;
      record_container.mask = scroll_mask;

      const tmpBG = new PIXI.Graphics();
      tmpBG
        .rect(0, 0, app.screen.width, app.screen.height)
        .fill(replaceHash(settings.colorTheme.colors.SecondAccent));
      tmpBG.x = screenCenter.x - tmpBG.width / 2;
      tmpBG.y = screenCenter.y - tmpBG.height / 2;
      record_container.addChild(tmpBG);

      const title_text = new PIXI.Text({
        text: "",
        style: {
          fontFamily: gameData.FontFamily,
          fontSize: 30,
          fill: replaceHash(settings.colorTheme.colors.MainColor),
          align: "center",
        },
      });
      title_text.label = "record_title";
      title_text.y = 220;
      app.stage.addChild(title_text);

      switch (opened) {
        case opened_record.play:
          title_text.text = play_record_text.text;
          title_text.x = screenCenter.x - title_text.width / 2;
          break;
        case opened_record.achieve:
          title_text.text = achieve_text.text;
          title_text.x = screenCenter.x - title_text.width / 2;
          break;
        case opened_record.ranking:
          title_text.text = ranking_text.text;
          title_text.x = screenCenter.x - title_text.width / 2;
          break;
        case opened_record.graph:
          title_text.text = graph_text.text;
          title_text.x = screenCenter.x - title_text.width / 2;
          break;
      }

      let isDragging = false;
      let lastPosition = { y: 0 };
      let velocity = 0;
      //let animationFrame: number | null = null;

      const maxScroll = Math.max(0, record_container.height);
      let currentScroll = 0;

      // Make the container interactive to receive pointer and wheel events
      record_container.eventMode = "static";
      record_container.cursor = "grab";

      // Pointer (drag) events
      record_container
        .on("pointerdown", (e: PIXI.FederatedPointerEvent) => {
          isDragging = true;
          lastPosition.y = e.global.y;
          velocity = 0;
          record_container.cursor = "grabbing";
        })
        .on("pointermove", (e: PIXI.FederatedPointerEvent) => {
          if (!isDragging) return;
          const deltaY = e.global.y - lastPosition.y;
          lastPosition.y = e.global.y;
          currentScroll = Math.min(
            Math.max(currentScroll + deltaY, -maxScroll),
            0
          );
          updateScrollPosition();
          velocity = deltaY;
        })
        .on("pointerup", () => endDrag())
        .on("pointerupoutside", () => endDrag());

      record_container.on("wheel", (e: PIXI.FederatedWheelEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const wheelDelta = -e.deltaY;
        currentScroll = Math.min(
          Math.max(currentScroll + wheelDelta, -maxScroll),
          0
        );
        updateScrollPosition();
      });

      const updateScrollPosition = () => {
        record_container.y = currentScroll;
      };
      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        record_container.cursor = "grab";
        applyMomentum();
      };
      const applyMomentum = () => {
        if (Math.abs(velocity) < 0.5) return;
        velocity *= 0.95;
        currentScroll = Math.min(
          Math.max(currentScroll + velocity, -maxScroll),
          0
        );
        updateScrollPosition();
        if (Math.abs(velocity) > 0.5) {
          //animationFrame = requestAnimationFrame(applyMomentum);
        }
      };

      // Ticker を利用した（ドラッグ中でない場合の）慣性スクロールの処理
      app.ticker.add(() => {
        if (!isDragging && Math.abs(velocity) > 0.5) {
          velocity *= 0.95;
          currentScroll = Math.min(
            Math.max(currentScroll + velocity, -maxScroll),
            0
          );
          updateScrollPosition();
        }
      });
    }

    while (gameData.CurrentSceneName === "record_scene") {
      currentKeyController = new AbortController();
      try {
        const keyCode = await getLatestKey(currentKeyController.signal);
        if (keyCode.code === "Escape") {
          gameData.CurrentSceneName = "game_select";
          get_out();
        } else if (
          ["ArrowDown", "ArrowRight", "ShiftRight"].includes(keyCode.code)
        ) {
          playMiss(0.3);
          if (isOpened_record >= 3) {
            isOpened_record = 0;
          } else {
            isOpened_record++;
          }
          dot_pos_update(isOpened_record);
          update_open(isOpened_record);
        } else if (
          ["ArrowUp", "ArrowLeft", "ShiftLeft"].includes(keyCode.code)
        ) {
          playMiss(0.3);
          if (isOpened_record <= 0) {
            isOpened_record = 3;
          } else {
            isOpened_record--;
          }
          dot_pos_update(isOpened_record);
          update_open(isOpened_record);
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
