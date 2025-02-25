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

const BUTTON_SPACING = 120;
const CIRCULAR_BUTTON_CENTER_OFFSET = 200;

function createButton(text: string): PIXI.Text {
  const btn = new PIXI.Text({
    text,
    style: {
      fontFamily: gameData.FontFamily,
      fontSize: 42,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  btn.interactive = true;
  return btn;
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

function animateSelectionDot(
  dot: PIXI.Graphics,
  targetY: number,
  delay: number,
  isDown: boolean
) {
  gsap.fromTo(
    dot,
    { y: isDown ? targetY - 10 : targetY + 10, alpha: 0 },
    { y: targetY, alpha: 1, duration: 0.5, ease: "power4.out", delay }
  );
}

export async function game_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    app.stage.removeChildren();
    BG_grid(app);
    const winCenter = { x: app.screen.width / 2, y: app.screen.height / 2 };

    const wakuCircle = new PIXI.Graphics();
    wakuCircle.label = "waku_circle";
    wakuCircle.circle(0, 0, 840);
    wakuCircle.position.set(winCenter.x, winCenter.y);
    wakuCircle.stroke({
      width: 2,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(wakuCircle);
    gsap.fromTo(
      wakuCircle.scale,
      { x: 1.2, y: 1.2 },
      { x: 1, y: 1, duration: 2, ease: "power4.out" }
    );

    const circleAcc = new PIXI.Graphics();
    circleAcc.label = "circle_acc";
    circleAcc.circle(0, 0, 1000);
    circleAcc.position.set(winCenter.x - 300, winCenter.y - 280);
    circleAcc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    circleAcc.scale.set(0.3);
    circleAcc.alpha = 0.8;
    app.stage.addChild(circleAcc);
    gsap.from(circleAcc.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
      delay: 0.2,
    });

    const circleMain = new PIXI.Graphics();
    circleMain.label = "circle_main";
    circleMain.circle(0, 0, 1000);
    circleMain.position.set(winCenter.x + 300, winCenter.y + 280);
    circleMain.fill(replaceHash(settings.colorTheme.colors.MainColor));
    circleMain.scale.set(0.2);
    circleMain.alpha = 0.8;
    app.stage.addChild(circleMain);
    gsap.from(circleMain.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
      delay: 0.4,
    });

    const gameSelectBtn = createButton("ゲーム選択");
    gameSelectBtn.position.set(
      winCenter.x - gameSelectBtn.width / 2,
      winCenter.y - gameSelectBtn.height / 2
    );
    app.stage.addChild(gameSelectBtn);

    const settingSelectBtn = createButton("ゲーム設定");
    settingSelectBtn.position.set(
      winCenter.x - settingSelectBtn.width / 2,
      winCenter.y - settingSelectBtn.height / 2 + BUTTON_SPACING
    );
    app.stage.addChild(settingSelectBtn);

    const recordBtn = createButton("プレイ記録");
    recordBtn.position.set(
      winCenter.x - recordBtn.width / 2,
      winCenter.y - recordBtn.height / 2 - BUTTON_SPACING
    );
    app.stage.addChild(recordBtn);

    const selectDotAcc = new PIXI.Graphics();
    selectDotAcc.circle(0, 0, 8);
    selectDotAcc.position.set(
      winCenter.x + (gameSelectBtn.width / 2 + 20),
      winCenter.y
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

    const selectDotMain = new PIXI.Graphics();
    selectDotMain.circle(0, 0, 8);
    selectDotMain.position.set(
      winCenter.x - (gameSelectBtn.width / 2 + 15),
      winCenter.y
    );
    selectDotMain.fill(replaceHash(settings.colorTheme.colors.MainColor));
    selectDotMain.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(selectDotMain);
    gsap.from(selectDotMain.scale, {
      x: 0,
      y: 0,
      duration: 2,
      ease: "power4.out",
    });

    function hideSceneElements() {
      gsap.to(wakuCircle.scale, {
        x: 1.2,
        y: 1.2,
        duration: 0.5,
        ease: "power4.out",
      });
      [
        recordBtn,
        settingSelectBtn,
        gameSelectBtn,
        selectDotAcc,
        selectDotMain,
      ].forEach((el) => gsap.to(el, { alpha: 0, duration: 0.5 }));
    }

    function transitionToRecord() {
      hideSceneElements();
      gameData.CurrentSceneName = "record_scene";
      gsap.to(circleMain, { alpha: 0, ease: "power4.out", duration: 0.5 });
      gsap.to(circleAcc, {
        x: winCenter.x,
        y: winCenter.y,
        ease: "power4.out",
        duration: 1,
      });
      gsap.to(circleAcc.scale, {
        x: 1,
        y: 1,
        ease: "power4.out",
        duration: 1,
        delay: 0.5,
      });
      setTimeout(resolve, 1000);
    }
    function transitionToSetting() {
      hideSceneElements();
      gameData.CurrentSceneName = "setting_scene";
      gsap.to(circleAcc, { alpha: 0, ease: "power4.out", duration: 0.5 });
      gsap.to(circleMain, {
        x: winCenter.x,
        y: winCenter.y,
        ease: "power4.out",
        duration: 1,
      });
      gsap.to(circleMain.scale, {
        x: 1,
        y: 1,
        ease: "power4.out",
        duration: 1,
        delay: 0.5,
      });
      setTimeout(resolve, 1000);
    }
    async function transitionToGameModeSelect() {
      hideSceneElements();
      gameData.CurrentSceneName = "game_mode_select_scene";
      gsap.to(circleMain, { alpha: 0, ease: "power4.out", duration: 0.5 });
      gsap.to(circleAcc, {
        x: winCenter.x,
        y: winCenter.y,
        ease: "power4.out",
        duration: 1,
      });
      gsap.to(circleAcc.scale, {
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

    recordBtn.on("pointerdown", transitionToRecord);
    settingSelectBtn.on("pointerdown", transitionToSetting);
    gameSelectBtn.on("pointerdown", transitionToGameModeSelect);

    let selectedIndex = 1;
    const updateSelectDots = (index: number, isDown: boolean) => {
      const targetY = winCenter.y + (index - 1) * BUTTON_SPACING;
      animateSelectionDot(selectDotAcc, targetY, isDown ? 0 : 0.03, isDown);
      animateSelectionDot(selectDotMain, targetY, isDown ? 0.03 : 0, isDown);
    };

    while (gameData.CurrentSceneName === "game_select") {
      const keyCode = await getLatestKey();
      if (["ArrowDown", "ArrowRight", "ShiftRight"].includes(keyCode.code)) {
        playMiss();
        selectedIndex = (selectedIndex + 1) % 3;
        updateSelectDots(selectedIndex, true);
      } else if (["ArrowUp", "ArrowLeft", "ShiftLeft"].includes(keyCode.code)) {
        playMiss();
        selectedIndex = (selectedIndex + 2) % 3;
        updateSelectDots(selectedIndex, false);
      } else if (["Enter", "Space"].includes(keyCode.code)) {
        if (selectedIndex === 0) transitionToRecord();
        else if (selectedIndex === 1) transitionToGameModeSelect();
        else if (selectedIndex === 2) transitionToSetting();
      }
    }
  });
}

function game_mode_select(app: PIXI.Application): Promise<void> {
  return new Promise<void>(async (resolve) => {
    playCollect();
    const winCenter = { x: app.screen.width / 2, y: app.screen.height / 2 };
    const circleRadius = 410;
    const circleAcc = app.stage.children.find(
      (child) => child.label === "circle_acc"
    );
    const wakuCircle = app.stage.children.find(
      (child) => child.label === "waku_circle"
    );

    if (wakuCircle) {
      gsap.fromTo(
        wakuCircle.scale,
        { x: 1.2, y: 1.2 },
        { x: 0.95, y: 0.95, duration: 1.5, ease: "power4.out" }
      );
    }
    if (circleAcc) {
      gsap.to(circleAcc, {
        x: winCenter.x - CIRCULAR_BUTTON_CENTER_OFFSET,
        duration: 1.5,
        ease: "power4.out",
      });
    }

    const mask = new PIXI.Graphics();
    mask.circle(0, 0, 155).fill(replaceHash(settings.colorTheme.colors.MainBG));
    mask.position.set(winCenter.x, winCenter.y);
    app.stage.addChild(mask);
    gsap.fromTo(
      mask,
      { x: winCenter.x },
      {
        x: winCenter.x - CIRCULAR_BUTTON_CENTER_OFFSET,
        duration: 1.5,
        ease: "power4.out",
      }
    );
    gsap.from(mask.scale, { x: 0, y: 0, duration: 1.5, ease: "power4.out" });

    const selectDotAcc = new PIXI.Graphics();
    selectDotAcc.circle(circleRadius, 0, 8);
    selectDotAcc.position.set(
      winCenter.x - CIRCULAR_BUTTON_CENTER_OFFSET - 20,
      winCenter.y
    );
    selectDotAcc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    selectDotAcc.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    app.stage.addChild(selectDotAcc);
    gsap.fromTo(
      selectDotAcc,
      { alpha: 0 },
      { alpha: 1, duration: 2, ease: "power3.out" }
    );

    const moveDot = (selected: number) => {
      const rotations = [
        -Math.PI / 5,
        -Math.PI / 10,
        0,
        Math.PI / 10,
        Math.PI / 5,
      ];
      gsap.to(selectDotAcc, {
        rotation: rotations[selected] || 0,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const modes = [
      { label: "長文モード", mode: "long", angle: -Math.PI / 5 },
      { label: "集中モード", mode: "focus", angle: -Math.PI / 10 },
      { label: "スタンダード", mode: "nomal", angle: 0 },
      { label: "正確性重視", mode: "exact", angle: Math.PI / 10 },
      { label: "数値入力", mode: "number", angle: Math.PI / 5 },
    ];

    modes.forEach((item) => {
      const btn = createButton(item.label);
      const pos = getCircularPosition(
        winCenter.x - CIRCULAR_BUTTON_CENTER_OFFSET,
        winCenter.y - btn.height / 2,
        circleRadius,
        item.angle
      );
      btn.position.set(pos.x, pos.y);
      btn.on("pointerdown", async () => {
        gameData.GameMode = item.mode;
        gameData.CurrentSceneName = "game_scene";
        resolve();
      });
      app.stage.addChild(btn);
    });

    let selectedModeIndex = 2;
    while (gameData.CurrentSceneName === "game_mode_select_scene") {
      const keyCode = await getLatestKey();
      if (["ArrowDown", "ArrowRight", "ShiftRight"].includes(keyCode.code)) {
        selectedModeIndex = (selectedModeIndex + 1) % modes.length;
        moveDot(selectedModeIndex);
      } else if (["ArrowUp", "ArrowLeft", "ShiftLeft"].includes(keyCode.code)) {
        selectedModeIndex =
          (selectedModeIndex + modes.length - 1) % modes.length;
        moveDot(selectedModeIndex);
      } else if (keyCode.code === "Escape") {
        gameData.CurrentSceneName = "game_select";
        resolve();
      } else if (["Enter", "Space"].includes(keyCode.code)) {
        gameData.GameMode = modes[selectedModeIndex].mode;
        gameData.CurrentSceneName = "game_scene";
        resolve();
      }
    }
  });
}
