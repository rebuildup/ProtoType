import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import "../styles/webglPopup.css";
import { settings } from "../SiteInterface.ts";
import { initializeGame } from "../gamesets/game_master.ts";

interface WebGLPopupProps {
  onClose: () => void;
}

const WebGLPopup: React.FC<WebGLPopupProps> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const animationFrameRef = useRef<number>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      try {
        if (popupRef.current) {
          const existingCanvas = popupRef.current.querySelector("canvas");
          if (existingCanvas) {
            existingCanvas.remove();
          }
        }

        const app = new PIXI.Application();
        appRef.current = app;

        await app.init({
          width: 720 * 2,
          height: 600 * 2,
          backgroundColor: settings.colorTheme.colors.MainBG,
          autoStart: false,
        });

        if (!isMounted || !popupRef.current) return;

        popupRef.current.appendChild(app.canvas);

        // Initialize the game logic
        initializeGame(app);

        const animate = () => {
          app.render();
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        setIsInitialized(true);
      } catch (error) {
        if (isMounted) console.error("PixiJS initialization failed:", error);
      }
    };

    initApp();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (popupRef.current) {
        const canvas = popupRef.current.querySelector("canvas");
        if (canvas) canvas.remove();
      }
      if (appRef.current && isInitialized) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [isInitialized]);

  return (
    <div className="webgl-popup" ref={popupRef}>
      <button
        onClick={onClose}
        style={{ position: "absolute", top: "-60px", right: "-20px" }}
      >
        Close
      </button>
    </div>
  );
};

export default WebGLPopup;
