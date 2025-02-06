// game_master.ts
import * as THREE from "three";
import { game_scene } from "./game_scene";
import { playCollect, playMiss } from "./soundplay";
<<<<<<< HEAD

=======
>>>>>>> 516a1f97dbc2ea7fca0c07ccc2326a7d53d793ef
import { getProp, setProp } from "./gameConfig";
import { opening_scene } from "./opening";
import { game_select } from "./game_select";
import { setting_scene } from "./setting_scene";
import { result_scene } from "./result_scene";

<<<<<<< HEAD
//import { TextToRomaji } from "./generate_pattern";
import { fetchTexts } from "./APIget";

export async function initializeGame(app: PIXI.Application) {
  //setProp("CurrentSceneName", "opening");
  setProp("CurrentSceneName", "game_scene");
  try {
    const textsData = await fetchTexts();
    console.log("Texts data:", textsData);
  } catch (error) {
    console.error(error);
  }
  while (getProp("CurrentSceneName") != "exit") {
=======
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
>>>>>>> 516a1f97dbc2ea7fca0c07ccc2326a7d53d793ef
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
