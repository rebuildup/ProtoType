import React, { useState } from "react";
import "../styles/colorpalette.css";

const themes = [
  {
    name: "Light",
    colors: {
      "--MainBG": "#ffffff",
      "--MainColor": "#333333",
      "--MainAccent": "#007bff",
      "--SecondAccent": "#ff4081",
    },
  },
  {
    name: "Dark",
    colors: {
      "--MainBG": "#333333",
      "--MainColor": "#ffffff",
      "--MainAccent": "#1e90ff",
      "--SecondAccent": "#ff1493",
    },
  },
  {
    name: "Solarized",
    colors: {
      "--MainBG": "#fdf6e3",
      "--MainColor": "#657b83",
      "--MainAccent": "#268bd2",
      "--SecondAccent": "#d33682",
    },
  },
];

const ColorPalette: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(themes[0].name);

  const applyTheme = (theme: (typeof themes)[0]) => {
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    setCurrentTheme(theme.name);
  };

  return (
    <div className="p-4">
      <h1>Color Theme</h1>
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
                stroke-width="2"
                stroke="transparent"
              />

              <circle
                cx="0"
                cy="0"
                r="100"
                fill="none"
                stroke={theme.colors["--MainBG"]} // 元の色をストロークに適用
                stroke-width="2"
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
