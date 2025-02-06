import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import "../styles/webglPopup.css";
import { settings } from "../SiteInterface";
import { initializeGame } from "../gamesets/game_master";
import { setProp } from "../gamesets/gameConfig";

interface WebGLPopupProps {
  onClose: () => void;
}

const WebGLPopup: React.FC<WebGLPopupProps> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    let isMounted = true;
    let app: PIXI.Application | null = null;

    const initApp = async () => {
      try {
        if (!popupRef.current) return;
        // Remove any existing canvas element
        popupRef.current.querySelector("canvas")?.remove();

        // Create a canvas element manually
        const canvas = document.createElement("canvas");

        // Initialize PIXI.Application without options
        app = new PIXI.Application();
        // Use init() with provided canvas element via the view option
        app.init({
          view: canvas,
          width: 720,
          height: 600,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          backgroundColor: settings.colorTheme.colors.MainBG,
          autoStart: true,
          resizeTo: popupRef.current,
        });

        if (!isMounted || !popupRef.current) return;

        // Ensure renderer resolution is set correctly
        if (app.renderer) {
          app.renderer.resolution = window.devicePixelRatio || 1;
        }
        appRef.current = app;
        // Append the created canvas element
        popupRef.current.appendChild(canvas);

        const extractFontName = (fontFamily: string) => {
          const match = fontFamily.match(/["']([^"']+)["']/);
          return match ? match[1] : fontFamily;
        };
        const fixedFont = extractFontName(settings.fontTheme.fontFamily);
        setProp("FontFamily", fixedFont);
        setProp("KeyLayout", settings.keyLayout);
        initializeGame(app);
      } catch (error) {
        console.error("PixiJS initialization failed:", error);
        app?.destroy(true);
      }
    };

    initApp();

    return () => {
      isMounted = false;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div className="webgl-popup" ref={popupRef}>
      <div className="webGL-BG" onClick={onClose} />
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
