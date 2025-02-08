import React from "react";
import ColorPalette from "./010_ColorPalette";
import FontSelector from "./011_FontSelector";
import KeyLayoutSelector from "./012_KeyLayout";
import "../styles/007_setting.css";

const Setting: React.FC = () => {
  return (
    <div className="setting-container">
      <ColorPalette />
      <FontSelector />
      <KeyLayoutSelector />
    </div>
  );
};

export default Setting;
