import * as PIXI from "pixi.js";
import { settings } from "../SiteInterface";
import { replaceHash } from "./001_game_master";
import gsap from "gsap";
import { gameData } from "./002_gameConfig";

export const keybords = [
  [26, 28, 0, 0],
  [26, 28, 38, 0],
  [26, 28, 76, 0],
  [26, 28, 114, 0],
  [26, 28, 152, 0],
  [26, 28, 190, 0],
  [26, 28, 228, 0],
  [26, 28, 266, 0],
  [26, 28, 304, 0],
  [26, 28, 342, 0],
  [26, 28, 380, 0],
  [26, 28, 418, 0],
  [26, 28, 456, 0],
  [26, 28, 494, 0],
  [26, 28, 532, 0],
  [45, 28, 0, 38],
  [26, 28, 57, 38],
  [26, 28, 95, 38],
  [26, 28, 133, 38],
  [26, 28, 171, 38],
  [26, 28, 209, 38],
  [26, 28, 247, 38],
  [26, 28, 285, 38],
  [26, 28, 323, 38],
  [26, 28, 399, 38],
  [26, 28, 361, 38],
  [26, 28, 437, 38],
  [26, 28, 475, 38],
  [54, 28, 0, 76],
  [45, 28, 513, 38],
  [26, 28, 66, 76],
  [26, 28, 104, 76],
  [26, 28, 142, 76],
  [26, 28, 180, 76],
  [26, 28, 218, 76],
  [26, 28, 256, 76],
  [26, 28, 294, 76],
  [26, 28, 332, 76],
  [26, 28, 370, 76],
  [26, 28, 408, 76],
  [26, 28, 446, 76],
  [26, 28, 484, 76],
  [36, 38, 522, 66],
  [70, 28, 0, 114],
  [26, 28, 82, 114],
  [26, 28, 120, 114],
  [26, 28, 158, 114],
  [26, 28, 196, 114],
  [26, 28, 234, 114],
  [26, 28, 272, 114],
  [26, 28, 310, 114],
  [26, 28, 348, 114],
  [26, 28, 386, 114],
  [26, 28, 424, 114],
  [26, 28, 462, 114],
  [58, 28, 500, 114],
  [42, 28, 0, 152],
  [38, 28, 52, 152],
  [38, 28, 100, 152],
  [26, 28, 150, 152],
  [130, 28, 190, 152],
  [26, 28, 330, 152],
  [38, 28, 366, 152],
  [38, 28, 414, 152],
  [38, 28, 462, 152],
  [48, 28, 510, 152],
];

export const keybord_size = { width: 558, height: 180 };
export const scale = 2;

export function Keyboard(app: PIXI.Application) {
  const keybord_pos = {
    x: app.screen.width / 2,
    y: app.screen.height - 320,
  };

  const container = new PIXI.Container();
  container.alpha = 0.2;
  app.stage.addChild(container);

  const offsetY = 100;
  const delayIncrement = 0.015;

  for (let i = 0; i < keybords.length; i++) {
    const [w, h, keyX, keyY] = keybords[i];

    const keyContainer = new PIXI.Container();
    keyContainer.alpha = 0;

    const baseKey = new PIXI.Graphics();
    baseKey
      .rect(0, 0, w * scale, h * scale)
      .fill(replaceHash(settings.colorTheme.colors.MainColor));
    baseKey.zIndex = 50;
    keyContainer.addChild(baseKey);

    if (i === 33 || i === 36) {
      const accentKey = new PIXI.Graphics();
      accentKey
        .rect(1, 1, w * scale, h * scale)
        .fill(replaceHash(settings.colorTheme.colors.MainAccent));
      accentKey.zIndex = 50;
      accentKey.alpha = 0.5;
      keyContainer.addChild(accentKey);
    }

    const finalX =
      keyX * scale - (keybord_size.width * scale) / 2 + keybord_pos.x;
    const finalY =
      keyY * scale - (keybord_size.height * scale) / 2 + keybord_pos.y;

    keyContainer.x = finalX;
    keyContainer.y = finalY + offsetY;
    container.zIndex = 50;
    container.addChild(keyContainer);

    gsap.to(keyContainer, {
      duration: 0.5,
      y: finalY,
      alpha: 1,
      ease: "power2.out",
      delay: i * delayIncrement,
    });
  }
}
export function light_key(app: PIXI.Application, index: number) {
  const keyData = keybords[index];
  if (!keyData) {
    return;
  }
  const [w, h, keyX, keyY] = keyData;

  const keybord_pos = {
    x: app.screen.width / 2,
    y: app.screen.height - 320,
  };

  const finalX =
    keyX * scale - (keybord_size.width * scale) / 2 + keybord_pos.x;
  const finalY =
    keyY * scale - (keybord_size.height * scale) / 2 + keybord_pos.y;

  const lightContainer = new PIXI.Container();
  lightContainer.x = finalX;
  lightContainer.y = finalY;
  lightContainer.alpha = 1;

  const lightKey = new PIXI.Graphics();
  lightKey
    .rect(0, 0, w * scale, h * scale)
    .fill(replaceHash(settings.colorTheme.colors.MainAccent));

  lightContainer.addChild(lightKey);

  app.stage.addChild(lightContainer);

  gsap.to(lightContainer, {
    duration: 0.5,
    alpha: 0,
    ease: "power2.out",
    onComplete: () => {
      app.stage.removeChild(lightContainer);
      lightContainer.destroy({ children: true });
    },
  });
}
const Acc_Key_Container = new PIXI.Container();
export function update_Acc_key(app: PIXI.Application) {
  // Remove the previous highlight container from the stage
  if (app.stage.children.includes(Acc_Key_Container)) {
    app.stage.removeChild(Acc_Key_Container);
  }
  // Clear all children from the global container
  Acc_Key_Container.removeChildren();

  // Iterate over each key index in gameData.acc_keys
  for (let i = 0; i < gameData.acc_keys.length; i++) {
    const keyData = keybords[gameData.acc_keys[i]];
    if (!keyData) {
      // Skip if the key data is not available
      continue;
    }
    const [w, h, keyX, keyY] = keyData;

    // Create a new container for each highlighted key
    const keyContainer = new PIXI.Container();

    // Calculate the key position relative to the stage
    const keybord_pos = {
      x: app.screen.width / 2,
      y: app.screen.height - 320,
    };
    keyContainer.x =
      keyX * scale - (keybord_size.width * scale) / 2 + keybord_pos.x;
    keyContainer.y =
      keyY * scale - (keybord_size.height * scale) / 2 + keybord_pos.y;
    keyContainer.alpha = 1;

    // Create the highlighted key graphic
    const lightKey = new PIXI.Graphics();
    lightKey
      .rect(0, 0, w * scale, h * scale)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));

    // Add the graphic to the key container
    keyContainer.addChild(lightKey);

    // Add the key container to the global highlight container
    Acc_Key_Container.addChild(keyContainer);
  }
  // Add the global highlight container to the stage
  app.stage.addChild(Acc_Key_Container);
}
