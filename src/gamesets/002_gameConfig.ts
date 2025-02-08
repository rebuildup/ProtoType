// Issue interface definition
export interface Issue {
  text: string;
  romaji: string;
}
import { ConversionTendencies } from "./008_generate_pattern";
// GameData interface that holds all game properties
export interface GameData {
  CurrentSceneName: string;
  FontFamily: string;
  KeyLayout: string;
  Score: number;
  Accuracy: number;
  Miss: number;
  GameMode: string;
  textsData: string[][];
  Issues: Issue[];
  Issues_num: number;
  current_Issue: number;
  current_inputed: string;
  IsStarted: boolean;
  StartTime: number;
  Conversion: ConversionTendencies;
}

// Centralized game data object for easy property management
export const gameData: GameData = {
  CurrentSceneName: "Opening",
  FontFamily: "Noto Sans JP",
  KeyLayout: "QUERTY",
  Score: 0,
  Accuracy: 100.0,
  Miss: 0,
  GameMode: "nomal",
  textsData: [["none"], ["none"]],
  Issues: [],
  Issues_num: 15,
  current_Issue: 0,
  current_inputed: "",
  IsStarted: false,
  StartTime: Date.now(),
  Conversion: [],
};
/*
// Simplified getter function for game properties
export const getProp = <K extends keyof GameData>(key: K): GameData[K] => {
  return gameData[key];
};

// Simplified setter function for game properties
export const setProp = <K extends keyof GameData>(
  key: K,
  value: GameData[K]
): void => {
  gameData[key] = value;
};
*/
