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
export type GameData = {
  keylayout: string;
};
// キャッシュに保存・取得・更新を管理するユーティリティ関数
export const saveToCache = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromCache = <T>(key: string, defaultValue: T): T => {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : defaultValue;
};

export const updateSetting = <K extends keyof typeof settings>(
  key: K,
  newValue: (typeof settings)[K]
) => {
  settings[key] = newValue;
  saveToCache(key, newValue);
  console.log(`${key} updated:`, newValue);
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
  gameData: loadFromCache<GameData>("gameData", {
    keylayout: "QWERTY",
  }),
};

/*
updateSetting("colorTheme", {
  name: "dark",
  colors: {
    MainBG: "#000000",
    MainColor: "#ffffff",
    MainAccent: "#ff9900",
    SecondAccent: "#0099ff",
  },
});
*/
