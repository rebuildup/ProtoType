import React from "react";
import CurrentTime from "./013_CurrentTime.tsx";
import "../styles/002_header.css";

// Header.tsx
const Header: React.FC = () => {
  return (
    <div className="header">
      <h1 className="title">
        {" "}
        Proto<span>T</span>ype
      </h1>
      <CurrentTime />
    </div>
  );
};

export default Header;
