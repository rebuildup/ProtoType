import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import "../styles/webglPopup.css";
import { settings } from "../SiteInterface.ts";

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
        // 既存のキャンバスを削除
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

        // キャンバスを追加
        popupRef.current.appendChild(app.canvas);

        // テキストオブジェクトの作成と追加
        const text = new PIXI.Text({
          text: settings.colorTheme.name,
          style: new PIXI.TextStyle({
            fontFamily: settings.fontTheme.fontFamily,
            fontSize: 48,
            fill: settings.colorTheme.colors.MainColor,
            align: "center",
          }),
        });
        text.anchor.set(0.5);
        text.x = app.screen.width / 2;
        text.y = app.screen.height / 2;
        app.stage.addChild(text);

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
