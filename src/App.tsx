import React, { useState, useLayoutEffect } from "react";

import Game from "./components/Game.tsx";
import PlayRecord from "./components/PlayRecord.tsx";
import Ranking from "./components/Ranking.tsx";
import Setting from "./components/Setting.tsx";
import WebGLPopup from "./components/WebGLPopup.tsx";
import Header from "./components/Header.tsx";
import Tab from "./components/Tab.tsx";

import "./index.css";

import { loadFromCache, updateSetting } from "./SiteInterface.ts";
import { themes } from "./components/ColorPalette.tsx";

import { fonts } from "./components/FontSelector.tsx";

const App: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const [currentTab, setCurrentTab] = useState<string>("Game");

  useLayoutEffect(() => {
    const cachedTheme = loadFromCache<{
      name: string;
      colors: Record<string, string>;
    }>("colorTheme", themes[0]);

    if (cachedTheme && cachedTheme.colors) {
      Object.entries(cachedTheme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(
          key.startsWith("--") ? key : `--${key}`,
          value
        );
      });
    }
    updateSetting("colorTheme", {
      name: cachedTheme.name,
      colors: {
        MainBG: cachedTheme.colors["--MainBG"],
        MainColor: cachedTheme.colors["--MainColor"],
        MainAccent: cachedTheme.colors["--MainAccent"],
        SecondAccent: cachedTheme.colors["--SecondAccent"],
      },
    });
    const cachedFont = loadFromCache<{ fontFamily: string }>("fontTheme", {
      fontFamily: fonts[0].value,
    });
    document.documentElement.style.setProperty(
      "--First-font",
      cachedFont.fontFamily
    );
    updateSetting("fontTheme", {
      fontFamily: cachedFont.fontFamily,
      fontSize: 16,
    });
    const cachedLayout = loadFromCache<string>("keyLayout", "QWERTY");
    updateSetting("gameData", { keylayout: cachedLayout });
  }, []);

  const renderCurrentComponent = () => {
    switch (currentTab) {
      case "Game":
        return <Game onOpenPopup={handleOpenPopup} />;
      case "PlayRecord":
        return <PlayRecord />;
      case "Ranking":
        return <Ranking />;
      case "Setting":
        return <Setting />;
      default:
        return <div>タブが見つかりません。</div>;
    }
  };

  return (
    <div>
      <Header />
      <Tab onTabChange={setCurrentTab} />
      <div className="Components">{renderCurrentComponent()}</div>
      {showPopup && <WebGLPopup onClose={handleClosePopup} />}
      <a
        className="mySiteLink"
        href="https://yusuke-kim.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        yusuke-kim.com
      </a>
    </div>
  );
};

export default App;
