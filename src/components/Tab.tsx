import React from "react";
import "../styles/tab.css";
interface TabProps {
  onTabChange: (tab: string) => void;
}

const Tab: React.FC<TabProps> = ({ onTabChange }) => {
  return (
    <div className="tab">
      <button onClick={() => onTabChange("Game")}>Game</button>
      <br />
      <button onClick={() => onTabChange("PlayBook")}>PlayBook</button>
      <br />
      <button onClick={() => onTabChange("Ranking")}>Ranking</button>
      <br />
      <button onClick={() => onTabChange("Setting")}>Setting</button>
    </div>
  );
};

export default Tab;
