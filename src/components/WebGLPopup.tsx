import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import "../styles/webglPopup.css";

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
          backgroundColor: 0x000000,
          autoStart: false,
        });

        if (!isMounted || !popupRef.current) return;

        // キャンバスを追加
        popupRef.current.appendChild(app.canvas);

        // テキストオブジェクトの作成と追加
        const text = new PIXI.Text({
          text: "Hello, WebGL!",
          style: new PIXI.TextStyle({
            fontFamily: "ShipporiGothicB2-OTF-Bold",
            fontSize: 48,
            fill: 0xffffff,
            align: "center",
          }),
        });
        text.anchor.set(0.5);
        text.x = app.screen.width / 2;
        text.y = app.screen.height / 2;
        app.stage.addChild(text);

        // レンダリングループの開始
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
      // アニメーションフレームのキャンセル
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // キャンバス要素の明示的削除
      if (popupRef.current) {
        const canvas = popupRef.current.querySelector("canvas");
        if (canvas) canvas.remove();
      }
      // アプリケーションの破棄
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
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        Close
      </button>
    </div>
  );
};

export default WebGLPopup;
