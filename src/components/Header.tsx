import React from "react";
import CurrentTime from "./CurrentTime.tsx";
import "../styles/header.css";

// Header.tsx
const Header: React.FC = () => {
  // "Haeder" → "Header" に修正
  return (
    <div className="header">
      <h1 className="title">
        {" "}
        {/* "Title" → "title" に修正 */}
        Proto<span>T</span>ype
      </h1>
      <CurrentTime />
    </div>
  );
};

export default Header;
