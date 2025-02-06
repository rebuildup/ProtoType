// game_select.ts
import * as THREE from "three";
import { getProp, setProp } from "./gameConfig";
import { settings } from "../SiteInterface";
import { playCollect } from "./soundplay";
import { ThreeGameContext } from "./game_master";
import { game_scene } from "./game_scene";

function createTextSprite(
  message: string,
  parameters: {
    fontFamily: string;
    fontSize: number;
    fill: string;
    align?: string;
  }
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 256;
  canvas.height = 64;
  ctx.font = `${parameters.fontSize}px ${parameters.fontFamily}`;
  ctx.textAlign = parameters.align
    ? (parameters.align as CanvasTextAlign)
    : "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = parameters.fill;
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(canvas.width, canvas.height, 1);
  return sprite;
}

// Simple interactive registration using the sprite's userData.
// Actual pointer detection via raycasting should be implemented in the main loop.
function registerInteractive(
  sprite: THREE.Sprite,
  onClick: () => Promise<void>
) {
  sprite.userData.onClick = onClick;
}

export function game_select(context: ThreeGameContext): Promise<void> {
  return new Promise<void>((resolve) => {
    while (context.scene.children.length > 0) {
      context.scene.remove(context.scene.children[0]);
    }
    const gameSelectButton = createTextSprite("ゲーム選択", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    gameSelectButton.position.set(0, 0, 0);
    registerInteractive(gameSelectButton, async () => {
      console.log("gamemode");
      await game_mode_select(context);
      resolve();
    });
    context.scene.add(gameSelectButton);

    const settingSelectButton = createTextSprite("設定", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    settingSelectButton.position.set(0, -50, 0);
    registerInteractive(settingSelectButton, async () => {
      console.log("setting_scene");
      setProp("CurrentSceneName", "setting_scene");
      resolve();
    });
    context.scene.add(settingSelectButton);

    const recordButton = createTextSprite("プレイ記録", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    recordButton.position.set(0, 50, 0);
    registerInteractive(recordButton, async () => {
      setProp("CurrentSceneName", "setting_scene");
      resolve();
    });
    context.scene.add(recordButton);
  });
}

function game_mode_select(context: ThreeGameContext): Promise<void> {
  return new Promise<void>((resolve) => {
    while (context.scene.children.length > 0) {
      context.scene.remove(context.scene.children[0]);
    }
    playCollect();
    const select_nomal = createTextSprite("スタンダード", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    select_nomal.position.set(0, 50, 0);
    registerInteractive(select_nomal, async () => {
      setProp("GameMode", "nomal");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    context.scene.add(select_nomal);

    const select_focus = createTextSprite("集中モード", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    select_focus.position.set(0, 0, 0);
    registerInteractive(select_focus, async () => {
      setProp("GameMode", "focus");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    context.scene.add(select_focus);

    const select_exact = createTextSprite("正確性重視", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    select_exact.position.set(0, -50, 0);
    registerInteractive(select_exact, async () => {
      setProp("GameMode", "exact");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    context.scene.add(select_exact);

    const select_long = createTextSprite("ランダム長文", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: settings.colorTheme.colors.MainColor,
      align: "center",
    });
    select_long.position.set(0, -100, 0);
    registerInteractive(select_long, async () => {
      setProp("GameMode", "long");
      setProp("CurrentSceneName", "game_scene");
      resolve();
    });
    context.scene.add(select_long);
  });
}
