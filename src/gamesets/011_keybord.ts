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

import * as PIXI from "pixi.js";

import { settings } from "../SiteInterface";
import { replaceHash } from "./001_game_master";
export const keybord_size = { width: 558, height: 180 };
export const scale = 2;

export function Keyboard(app: PIXI.Application) {
  const keybord_pos = { x: app.screen.width / 2, y: app.screen.height - 300 };

  const g = new PIXI.Graphics();
  app.stage.addChild(g);

  g.rect(
    keybords[33][2] * scale -
      (keybord_size.width * scale) / 2 +
      1 +
      keybord_pos.x,
    keybords[33][3] * scale -
      (keybord_size.height * scale) / 2 +
      1 +
      keybord_pos.y,
    keybords[33][0] * scale,
    keybords[33][1] * scale
  ).fill(replaceHash(settings.colorTheme.colors.MainAccent));

  g.rect(
    keybords[36][2] * scale -
      (keybord_size.width * scale) / 2 +
      1 +
      keybord_pos.x,
    keybords[36][3] * scale -
      (keybord_size.height * scale) / 2 +
      1 +
      keybord_pos.y,
    keybords[36][0] * scale,
    keybords[36][1] * scale
  ).fill(replaceHash(settings.colorTheme.colors.MainAccent));
  g.alpha = 0.2;

  for (let i = 0; i < keybords.length; i++) {
    g.rect(
      keybords[i][2] * scale - (keybord_size.width * scale) / 2 + keybord_pos.x,
      keybords[i][3] * scale -
        (keybord_size.height * scale) / 2 +
        keybord_pos.y,
      keybords[i][0] * scale,
      keybords[i][1] * scale
    ).fill(replaceHash(settings.colorTheme.colors.MainColor));
  }
}
