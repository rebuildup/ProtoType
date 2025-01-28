import React, { useState } from "react";

import Game from "./components/Game.tsx";
import PlayBook from "./components/PlayBook.tsx";
import Ranking from "./components/Ranking.tsx";
import Setting from "./components/Setting.tsx";
import WebGLPopup from "./components/WebGLPopup.tsx";
import Header from "./components/Header.tsx";
import Tab from "./components/Tab.tsx";

import "./index.css";

const App: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const [currentTab, setCurrentTab] = useState<string>("Game");

  // 現在のタブに応じて表示するコンポーネントを切り替える
  const renderCurrentComponent = () => {
    switch (currentTab) {
      case "Game":
        return <Game onOpenPopup={handleOpenPopup} />;
      case "PlayBook":
        return <PlayBook />;
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
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {renderCurrentComponent()}
      </div>
      {showPopup && <WebGLPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default App;
