// setting_scene.ts
import * as THREE from "three";
import { setProp, getProp } from "./gameConfig";
import { replaceHash } from "./game_master";
import { settings } from "../SiteInterface";
import { ThreeGameContext } from "./game_master";

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

export function setting_scene(context: ThreeGameContext): Promise<void> {
  return new Promise<void>((resolve) => {
    while (context.scene.children.length > 0) {
      context.scene.remove(context.scene.children[0]);
    }
    const selectButton = createTextSprite("ゲーム選択に戻る", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    });
    selectButton.position.set(0, 0, 0);
    selectButton.userData.onClick = async () => {
      setProp("CurrentSceneName", "game_select");
      resolve();
    };
    context.scene.add(selectButton);
  });
}
