// game_master.ts
import * as THREE from "three";
import { game_scene } from "./game_scene";
import { playCollect, playMiss } from "./soundplay";
import { getProp, setProp } from "./gameConfig";
import { opening_scene } from "./opening";
import { game_select } from "./game_select";
import { setting_scene } from "./setting_scene";
import { result_scene } from "./result_scene";

// Define a context type for three.js components
export interface ThreeGameContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

export async function initializeGame(context: ThreeGameContext) {
  // Set the initial scene
  setProp("CurrentSceneName", "opening");

  // Main game loop
  while (getProp("CurrentSceneName") !== "exit") {
    switch (getProp("CurrentSceneName")) {
      case "opening":
        console.log("opening");
        playCollect();
        await opening_scene(context);
        break;
      case "game_scene":
        console.log("game_scene");
        playCollect();
        await game_scene(context);
        break;
      case "game_select":
        console.log("game_select");
        playCollect();
        await game_select(context);
        break;
      case "setting_scene":
        console.log("setting_scene");
        playCollect();
        await setting_scene(context);
        break;
      case "result_scene":
        console.log("result_scene");
        playCollect();
        await result_scene(context);
        break;
      default:
        setProp("CurrentSceneName", "exit");
        break;
    }
  }
  console.log("何が起こった？");
  playMiss();
}

export function replaceHash(color: string): string {
  if (typeof color !== "string") return "";
  // Convert hex color from PIXI.js format (#FFFFFF) to three.js format (0xFFFFFF)
  return color.startsWith("#") ? color.replace("#", "0x") : color;
}
