// game_scene.ts
import * as THREE from "three";
import { getProp, setProp } from "./gameConfig";
import { replaceHash } from "./game_master";
import { settings } from "../SiteInterface";
import { playCollect } from "./soundplay";
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
  canvas.width = 512;
  canvas.height = 128;
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
  // Scale factor can be adjusted as needed
  sprite.scale.set(canvas.width / 4, canvas.height / 4, 1);
  return sprite;
}

function createLine(
  start: THREE.Vector3,
  end: THREE.Vector3,
  lineWidth: number
): THREE.Line {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({
    color: Number(replaceHash(settings.colorTheme.colors.MainColor)),
    linewidth: lineWidth,
  });
  return new THREE.Line(geometry, material);
}

export function game_scene(context: ThreeGameContext): Promise<void> {
  return new Promise((resolve) => {
    // Clear previous objects
    while (context.scene.children.length > 0) {
      context.scene.remove(context.scene.children[0]);
    }
    // In an orthographic setup, (0,0) is the center.
    const winpos = { x: 0, y: 0 };

    switch (getProp("GameMode")) {
      case "nomal":
      case "focus":
      case "exact":
      case "long":
        break;
      default:
        console.log("gamemode nothing");
        resolve();
        return;
    }

    const sentenceSprite = createTextSprite("拝啓ドッペルゲンガー君は 君は誰", {
      fontFamily: getProp("FontFamily"),
      fontSize: 20,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    });
    sentenceSprite.position.set(winpos.x, winpos.y, 0);
    context.scene.add(sentenceSprite);

    const alphabetSprite = createTextSprite("kousouhanetta...atohatukurudake", {
      fontFamily: getProp("FontFamily"),
      fontSize: 14,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
    });
    alphabetSprite.position.set(0, 50, 0);
    context.scene.add(alphabetSprite);

    const nextSprite = createTextSprite("昨年はゲーム部門1位でした", {
      fontFamily: getProp("FontFamily"),
      fontSize: 14,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
    });
    nextSprite.position.set(0, 0, 0);
    context.scene.add(nextSprite);

    const scoreSprite = createTextSprite("30000", {
      fontFamily: getProp("FontFamily"),
      fontSize: 16,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
    });
    scoreSprite.position.set(0, -100, 0);
    context.scene.add(scoreSprite);

    const comboSprite = createTextSprite("30", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
    });
    comboSprite.position.set(-150, 0, 0);
    context.scene.add(comboSprite);

    const kpmSprite = createTextSprite("5.2", {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
    });
    kpmSprite.position.set(150, 0, 0);
    context.scene.add(kpmSprite);

    // Draw lines
    const accuracyLine = createLine(
      new THREE.Vector3(-200, -50, 0),
      new THREE.Vector3(200, -50, 0),
      2
    );
    context.scene.add(accuracyLine);
    const progressLine = createLine(
      new THREE.Vector3(-200, -150, 0),
      new THREE.Vector3(200, -150, 0),
      2
    );
    context.scene.add(progressLine);
    const positionLine = createLine(
      new THREE.Vector3(-300, 0, 0),
      new THREE.Vector3(300, 0, 0),
      1
    );
    context.scene.add(positionLine);
    const posiiLine = createLine(
      new THREE.Vector3(0, -200, 0),
      new THREE.Vector3(0, 200, 0),
      1
    );
    context.scene.add(posiiLine);

    // Draw progress dot as a small circle
    const dotGeometry = new THREE.CircleGeometry(3, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: Number(replaceHash(settings.colorTheme.colors.MainColor)),
    });
    const progressDot = new THREE.Mesh(dotGeometry, dotMaterial);
    progressDot.position.set(winpos.x, winpos.y, 0);
    context.scene.add(progressDot);

    setProp("CurrentSceneName", "result_scene");
    setTimeout(() => {
      resolve();
    }, 60000);
  });
}
