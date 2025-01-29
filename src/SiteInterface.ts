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

// 設定を更新する関数
export const updateSetting = <T>(key: string, newValue: T) => {
  saveToCache(key, newValue);
  console.log(`${key} updated:`, newValue);
};

/*
// 使用例
updateSetting("colorTheme", {
  name: "dark",
  colors: {
    MainBG: "#000000",
    MainColor: "#ffffff",
    MainAccent: "#ff9900",
    SecondAccent: "#0099ff",
  },
});

updateSetting("fontTheme", {
  fontFamily: "Roboto",
  fontSize: 18,
});

updateSetting("user", {
  id: 2,
  name: "Alice",
  isLoggedin: true,
});

updateSetting("gameData", {
  keylayout: "AZERTY",
});
*/
