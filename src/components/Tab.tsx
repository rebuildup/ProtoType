import React from "react";
import "../styles/tab.css";
interface TabProps {
  onTabChange: (tab: string) => void;
}

const Tab: React.FC<TabProps> = ({ onTabChange }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <button onClick={() => onTabChange("Game")}>Game</button>
      <button onClick={() => onTabChange("PlayBook")}>PlayBook</button>
      <button onClick={() => onTabChange("Ranking")}>Ranking</button>
      <button onClick={() => onTabChange("Setting")}>Setting</button>
    </div>
  );
};

export default Tab;
