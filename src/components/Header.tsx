import React from "react";
import CurrentTime from "./CurrentTime.tsx";
import "../styles/header.css";

const Haeder: React.FC = ({}) => {
  return (
    <div className="header">
      <h1 className="Title">
        Proto<span>T</span>ype
      </h1>
      <CurrentTime />
    </div>
  );
};

export default Haeder;
