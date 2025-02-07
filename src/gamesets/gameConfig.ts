import { Roman } from "./generate_pattern";

export interface Issue {
  text: string;
  romaji: Roman;
}

let CurrentSceneName = "Opening";
let FontFamily = "Noto Sans JP";
let KeyLayout = "QUERTY";
let Score = 0;
let Accuracy = 100.0;
let Miss = 0;
let GameMode = "nomal";
let textsData = [["none"], ["none"]];
let Issues: Issue[] = [];
let Issues_num = 15;
let current_Issue = 0;

export const getProp = (option: string): any => {
  switch (option) {
    case "CurrentSceneName":
      return CurrentSceneName;
    case "FontFamily":
      return FontFamily;
    case "KeyLayout":
      return KeyLayout;
    case "Score":
      return Score;
    case "Accuracy":
      return Accuracy;
    case "Miss":
      return Miss;
    case "GameMode":
      return GameMode;
    case "textsData":
      return textsData;
    case "Issues":
      return Issues;
    case "Issues_num":
      return Issues_num;
    case "current_Issue":
      return current_Issue;
    default:
      return null;
  }
};

export const setProp = (option: string, input: any) => {
  switch (option) {
    case "CurrentSceneName":
      CurrentSceneName = input;
      break;
    case "FontFamily":
      FontFamily = input;
      break;
    case "KeyLayout":
      KeyLayout = input;
      break;
    case "Score":
      Score = input;
      break;
    case "Accuracy":
      Accuracy = input;
      break;
    case "Miss":
      Miss = input;
      break;
    case "GameMode":
      GameMode = input;
      break;
    case "textsData":
      textsData = input;
      break;
    case "Issues":
      Issues = input;
      break;
    case "Issues_num":
      Issues_num = input;
      break;
    case "current_Issue":
      current_Issue = input;
      break;
    default:
      console.warn(`Unknown property: ${option}`);
      break;
  }
};
