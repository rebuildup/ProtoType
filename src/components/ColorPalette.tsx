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
      <div className="flex gap-4">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            className="flex items-center gap-2 p-2 border rounded-lg hover:shadow-md"
          >
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill={theme.colors["--MainAccent"]}
              />
            </svg>
            <span>{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
