import { loadFromCache, saveToCache } from "./lib/safeStorage";

export type ColorTheme = {
  name: string;
  colors: {
    MainBG: string;
    MainColor: string;
    MainAccent: string;
    SecondAccent: string;
  };
};
export type FontTheme = {
  fontFamily: string;
  fontSize: number;
};
export type User = {
  id: number;
  name: string;
  isLoggedin: boolean;
};
export type keylayout = string;

// Added animation settings type
export type AnimationSettings = {
  enabled: boolean;
  reducedMotion: boolean;
};

// `loadFromCache` and `saveToCache` are re-exported so legacy
// `import { loadFromCache, saveToCache } from "../SiteInterface"`
// call sites continue to work. New code should import directly from
// `./lib/safeStorage` (or `../lib/safeStorage`).
export { loadFromCache, saveToCache };

export const updateSetting = <K extends keyof typeof settings>(
  key: K,
  newValue: (typeof settings)[K],
) => {
  settings[key] = newValue;
  saveToCache(key, newValue);
  //console.log(`${key} updated:`, newValue);
};

export const settings = {
  colorTheme: loadFromCache<ColorTheme>("colorTheme", {
    name: "default",
    colors: {
      MainBG: "#ffffff",
      MainColor: "#000000",
      MainAccent: "#ff0000",
      SecondAccent: "#00ff00",
    },
  }),
  fontTheme: loadFromCache<FontTheme>("fontTheme", {
    fontFamily: "Arial",
    fontSize: 16,
  }),
  user: loadFromCache<User>("user", {
    id: 0,
    name: "Guest",
    isLoggedin: false,
  }),
  keyLayout: loadFromCache<keylayout>("keyLayout", "QWERTY"),
  // Add animation settings
  animationSettings: loadFromCache<AnimationSettings>("animationSettings", {
    enabled: true,
    reducedMotion: false,
  }),
};

/*
updateSetting("colorTheme", {
  name: "dark",
  colors: {
    MainBG: "#000000",
    MainColor: "#ffffff",
    MainAccent: "#ff9900",
    MainColor: "#0099ff",
  },
});
*/
