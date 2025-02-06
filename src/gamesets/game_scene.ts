import * as THREE from "three";
import { getProp, setProp } from "./gameConfig";
import { settings } from "../SiteInterface";
<<<<<<< HEAD

export function game_scene(app: PIXI.Application): Promise<void> {
  return new Promise((resolve) => {
    app.stage.removeChildren();
=======
import { playCollect } from "./soundplay";
import { ThreeGameContext } from "./game_master";
>>>>>>> 516a1f97dbc2ea7fca0c07ccc2326a7d53d793ef

// Create a text sprite using a high-resolution canvas
function createTextSprite(
  message: string,
  fontSize: number,
  fontFamily: string,
  fill: string,
  align: CanvasTextAlign = "center"
): THREE.Sprite {
  // Create a high-resolution canvas for crisp text
  const canvas = document.createElement("canvas");
  // Use larger dimensions for better quality
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  // Multiply fontSize to compensate for high resolution
  ctx.font = `bold ${fontSize * 4}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  // Use the CSS color string directly (e.g. "#FFFFFF")
  ctx.fillStyle = fill;
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  // Create texture and sprite material with transparency enabled
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  // Scale the sprite down to a desired size
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
    // Use the CSS color string converted to a number if needed
    color: Number(settings.colorTheme.colors.MainColor.replace("#", "0x")),
    linewidth: lineWidth,
  });
  return new THREE.Line(geometry, material);
}

export function game_scene(context: ThreeGameContext): Promise<void> {
  return new Promise((resolve) => {
    // Remove any existing objects from the scene
    while (context.scene.children.length > 0) {
      context.scene.remove(context.scene.children[0]);
    }

    // Define center as (0,0)
    const center = { x: 0, y: 0 };

    // Ensure a valid GameMode before proceeding
    switch (getProp("GameMode")) {
      case "nomal":
      case "focus":
      case "exact":
      case "long":
        break;
      default:
        console.log("GameMode not set");
        resolve();
        return;
    }

<<<<<<< HEAD
    // 各テキストに対して解像度を設定（グローバル設定が適用される場合は省略してもOK）
    const sentetce_text = new PIXI.Text({
      text: "構想は練った...後は作るだけ",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 20,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    sentetce_text.resolution = window.devicePixelRatio || 1;
    sentetce_text.x = app.screen.width / 2 - sentetce_text.width / 2;
    sentetce_text.y = 175;
    app.stage.addChild(sentetce_text);

    const alphabet_text = new PIXI.Text({
      text: "kousouhanetta...atohatukurudake",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 14,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    alphabet_text.resolution = window.devicePixelRatio || 1;
    alphabet_text.x = app.screen.width / 2 - alphabet_text.width / 2;
    alphabet_text.y = 200;
    app.stage.addChild(alphabet_text);

    const next_text = new PIXI.Text({
      text: "昨年はゲーム部門1位でした",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 14,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    next_text.resolution = window.devicePixelRatio || 1;
    next_text.x = app.screen.width / 2 - next_text.width / 2;
    next_text.y = 251;
    app.stage.addChild(next_text);

    const score_text = new PIXI.Text({
      text: "30000",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 16,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    score_text.resolution = window.devicePixelRatio || 1;
    score_text.x = app.screen.width / 2 - score_text.width / 2;
    score_text.y = 100;
    app.stage.addChild(score_text);

    const combo_text = new PIXI.Text({
      text: "30",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 24,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    combo_text.resolution = window.devicePixelRatio || 1;
    combo_text.x = 81;
    combo_text.y = 179;
    app.stage.addChild(combo_text);

    const kpm_text = new PIXI.Text({
      text: "5.2",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 24,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "right",
      },
    });
    kpm_text.resolution = window.devicePixelRatio || 1;
    kpm_text.x = app.screen.width - 81 - 32;
    kpm_text.y = 179;
    app.stage.addChild(kpm_text);

    const accuracyLine = new PIXI.Graphics();
    accuracyLine.moveTo(81, 87);
    accuracyLine.lineTo(app.screen.width - 81, 87);
    accuracyLine.stroke({
      width: 2,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      alpha: 1,
    });
    app.stage.addChild(accuracyLine);

    const progressLine = new PIXI.Graphics();
    progressLine.moveTo(81, 298);
    progressLine.lineTo(app.screen.width - 81, 298);
    progressLine.stroke({
      width: 2,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      alpha: 1,
    });
    app.stage.addChild(progressLine);

    const progressDot = new PIXI.Graphics();
    progressDot.circle(100, 280, 1);
    progressDot.stroke({
      width: 8,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(progressDot);

    Keyboard(app);
=======
    // Create several text sprites at different vertical positions
    const sentenceSprite = createTextSprite(
      "テキスト表示確認",
      20,
      getProp("FontFamily"),
      settings.colorTheme.colors.MainColor
    );
    // Position slightly higher
    sentenceSprite.position.set(center.x, center.y + 100, 0);
    context.scene.add(sentenceSprite);

    const alphabetSprite = createTextSprite(
      "kousouhanetta...atohatukurudake",
      14,
      getProp("FontFamily"),
      settings.colorTheme.colors.MainColor
    );
    // Position a bit lower than the first text
    alphabetSprite.position.set(center.x, center.y + 50, 0);
    context.scene.add(alphabetSprite);

    const nextSprite = createTextSprite(
      "昨年はゲーム部門1位でした",
      14,
      getProp("FontFamily"),
      settings.colorTheme.colors.MainColor
    );
    // Position in the middle
    nextSprite.position.set(center.x, center.y, 0);
    context.scene.add(nextSprite);

    const scoreSprite = createTextSprite(
      "30000",
      16,
      getProp("FontFamily"),
      settings.colorTheme.colors.MainColor
    );
    // Position below center
    scoreSprite.position.set(center.x, center.y - 50, 0);
    context.scene.add(scoreSprite);

    const comboSprite = createTextSprite(
      "30",
      24,
      getProp("FontFamily"),
      settings.colorTheme.colors.MainColor
    );
    // Position to the left
    comboSprite.position.set(center.x - 150, center.y, 0);
    context.scene.add(comboSprite);

    const kpmSprite = createTextSprite(
      "5.2",
      24,
      getProp("FontFamily"),
      settings.colorTheme.colors.MainColor
    );
    // Position to the right
    kpmSprite.position.set(center.x + 150, center.y, 0);
    context.scene.add(kpmSprite);

    // Draw some lines for visual reference
    const accuracyLine = createLine(
      new THREE.Vector3(-200, center.y - 30, 0),
      new THREE.Vector3(200, center.y - 30, 0),
      2
    );
    context.scene.add(accuracyLine);
    const progressLine = createLine(
      new THREE.Vector3(-200, center.y - 100, 0),
      new THREE.Vector3(200, center.y - 100, 0),
      2
    );
    context.scene.add(progressLine);
    const horizontalLine = createLine(
      new THREE.Vector3(-300, center.y, 0),
      new THREE.Vector3(300, center.y, 0),
      1
    );
    context.scene.add(horizontalLine);
    const verticalLine = createLine(
      new THREE.Vector3(center.x, -200, 0),
      new THREE.Vector3(center.x, 200, 0),
      1
    );
    context.scene.add(verticalLine);

    // Draw a small progress dot
    const dotGeometry = new THREE.CircleGeometry(20, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: Number(settings.colorTheme.colors.MainColor.replace("#", "0x")),
    });
    const progressDot = new THREE.Mesh(dotGeometry, dotMaterial);
    progressDot.position.set(center.x, center.y, 0);
    context.scene.add(progressDot);

    // Change to next scene after a delay (for demonstration)
>>>>>>> 516a1f97dbc2ea7fca0c07ccc2326a7d53d793ef
    setProp("CurrentSceneName", "result_scene");
    setTimeout(() => {
      resolve();
    }, 60000);
  });
}
