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
