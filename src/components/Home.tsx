import React from "react";
import "../styles/home.css";

interface HomeProps {
  onOpenPopup: () => void;
}

const Home: React.FC<HomeProps> = ({ onOpenPopup }) => {
  return (
    <div className="home-container">
      <button onClick={onOpenPopup}>Open WebGL Popup</button>
    </div>
  );
};

export default Home;
