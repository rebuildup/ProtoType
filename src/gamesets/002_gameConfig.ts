export interface Issue {
  text: string;
  romaji: string;
}
import { ConversionTendencies } from "./008_generate_pattern";

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
  combo_cnt: number;
  max_combo: number;
}

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
  combo_cnt: 0,
  max_combo: 0,
};
