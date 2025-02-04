let CurrentSceneName = "Opening";
let FontFamily = "Noto Sans JP";
let KeyLayout = "QUERTY";
let Score = 0;
let Accuracy = 100.0;
let Miss = 0;
let GameMode = "nomal";

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
    default:
      console.warn(`Unknown property: ${option}`);
      break;
  }
};
