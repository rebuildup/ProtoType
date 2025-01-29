import React from "react";
import ColorPalette from "./ColorPalette";
import FontSelector from "./FontSelector";
import "../styles/setting.css";

const Setting: React.FC = () => {
  return (
    <div className="setting-container">
      <ColorPalette />
      <FontSelector />
    </div>
  );
};

export default Setting;
