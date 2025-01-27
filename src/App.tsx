import React, { useState } from "react";
import Home from "./components/Home.tsx";
import WebGLPopup from "./components/WebGLPopup.tsx";
import Header from "./components/Header.tsx";
import "./index.css";

const App: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Header />
      <Home onOpenPopup={handleOpenPopup} />
      {showPopup && <WebGLPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default App;
