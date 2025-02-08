import React from "react";
import "../styles/004_game.css";

interface HomeProps {
  onOpenPopup: () => void;
}

const Game: React.FC<HomeProps> = ({ onOpenPopup }) => {
  return (
    <div className="home-container">
      <button onClick={onOpenPopup} className="openbtn">
        Game Start
      </button>
    </div>
  );
};

export default Game;
