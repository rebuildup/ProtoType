import React, { useState } from "react";
import "../styles/010_colorpalette.css";
import { updateSetting } from "../SiteInterface.ts";

export const themes = [
  {
    name: "Dark",
    colors: {
      "--MainBG": "#000000",
      "--MainColor": "#ffffff",
      "--MainAccent": "#ff0000",
      "--SecondAccent": "#ffffff",
    },
  },
  {
    name: "Grey",
    colors: {
      "--MainBG": "#333333",
      "--MainColor": "#eeeeee",
      "--MainAccent": "#007bff",
      "--SecondAccent": "#ff4081",
    },
  },
  {
    name: "Dark Bule",
    colors: {
      "--MainBG": "#000011",
      "--MainColor": "#eeeeee",
      "--MainAccent": "#EDE84C",
      "--SecondAccent": "#0000ee",
    },
  },
  {
    name: "Light",
    colors: {
      "--MainBG": "#eeeeee",
      "--MainColor": "#333333",
      "--MainAccent": "#ff0000",
      "--SecondAccent": "#0000ee",
    },
  },
];

const ColorPalette: React.FC = () => {
  const [, setCurrentTheme] = useState(themes[0].name);

  const applyTheme = (theme: (typeof themes)[0]) => {
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    setCurrentTheme(theme.name);
    console.log(document.documentElement.style);
    updateSetting("colorTheme", {
      name: theme.name,
      colors: {
        MainBG: theme.colors["--MainBG"],
        MainColor: theme.colors["--MainColor"],
        MainAccent: theme.colors["--MainAccent"],
        SecondAccent: theme.colors["--SecondAccent"],
      },
    });
  };

  return (
    <div className="p-4">
      <h1>カラーテーマ</h1>
      <div className="flex gap-4">
        {themes.map((theme) => (
          <button key={theme.name} onClick={() => applyTheme(theme)}>
            <svg width="100" height="100" viewBox="-100 -100 200 200">
              <filter id="invert">
                <feColorMatrix
                  values="-1 0 0 0 1 
                            0 -1 0 0 1 
                            0 0 -1 0 1 
                            0 0 0 1 0"
                />
              </filter>

              <circle
                cx="0"
                cy="0"
                r="100"
                fill={theme.colors["--MainBG"]}
                strokeWidth="2"
                stroke="transparent"
              />

              <circle
                cx="0"
                cy="0"
                r="100"
                fill="none"
                stroke={theme.colors["--MainBG"]} // 元の色をストロークに適用
                strokeWidth="2"
                filter="url(#invert)" // フィルターで色反転
              />

              <circle
                cx="-30"
                cy="-20"
                r="40"
                fill={theme.colors["--MainColor"]}
              />
              <circle
                cx="40"
                cy="10"
                r="25"
                fill={theme.colors["--MainAccent"]}
              />
              <circle
                cx="0"
                cy="45"
                r="15"
                fill={theme.colors["--SecondAccent"]}
              />
            </svg>
            <br />
            <span>{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
