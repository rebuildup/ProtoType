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

        // 既存のCanvasをクリーンアップ
        popupRef.current.querySelector("canvas")?.remove();

        // PIXI.Applicationの初期化
        app = new PIXI.Application();
        await app.init({
          width: 720 * 2,
          height: 600 * 2,
          backgroundColor: settings.colorTheme.colors.MainBG,
          autoStart: true,
          resizeTo: popupRef.current,
        });

        if (!isMounted || !popupRef.current) return;

        appRef.current = app;
        popupRef.current.appendChild(app.canvas);
        function extractFontName(fontFamily: string) {
          const match = fontFamily.match(/["']([^"']+)["']/);
          return match ? match[1] : fontFamily;
        }
        const fixedFont = extractFontName(settings.fontTheme.fontFamily);
        setProp("FontFamily", fixedFont);
        setProp("KeyLayout", settings.gameData.keylayout);
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
