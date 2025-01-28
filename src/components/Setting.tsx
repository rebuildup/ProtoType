import React from "react";
import ColorPalette from "./ColorPalette";
import "../styles/setting.css";

const Setting: React.FC = () => {
  return (
    <div className="setting-container">
      <ColorPalette />
    </div>
  );
};

export default Setting;
