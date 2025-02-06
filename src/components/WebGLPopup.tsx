import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../styles/webglPopup.css";
import { settings } from "../SiteInterface";
import { initializeGame } from "../gamesets/game_master";
import { setProp } from "../gamesets/gameConfig";

interface WebGLPopupProps {
  onClose: () => void;
}

const WebGLPopup: React.FC<WebGLPopupProps> = ({ onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  let animationFrameId: number;

  useEffect(() => {
    let isMounted = true;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;

    const initApp = async () => {
      try {
        if (!popupRef.current) return;

        // Remove existing canvas if present
        popupRef.current.querySelector("canvas")?.remove();

        // Create three.js renderer with antialiasing for smoother visuals
        renderer = new THREE.WebGLRenderer({ antialias: true });
        const width = 720 * 2;
        const height = 600 * 2;
        renderer.setSize(width, height);
        renderer.setClearColor(settings.colorTheme.colors.MainBG);
        popupRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create a scene
        scene = new THREE.Scene();

        // Setup an orthographic camera for 2D rendering
        camera = new THREE.OrthographicCamera(
          -width / 2,
          width / 2,
          height / 2,
          -height / 2,
          0.1,
          1000
        );
        camera.position.z = 10;

        // Extract font name from fontFamily string
        function extractFontName(fontFamily: string) {
          const match = fontFamily.match(/["']([^"']+)["']/);
          return match ? match[1] : fontFamily;
        }
        const fixedFont = extractFontName(settings.fontTheme.fontFamily);
        setProp("FontFamily", fixedFont);
        setProp("KeyLayout", settings.keyLayout);

        // Initialize game with three.js context (renderer, scene, camera)
        initializeGame({ renderer, scene, camera });

        // Animation loop for rendering
        const animate = () => {
          if (!isMounted) return;
          animationFrameId = requestAnimationFrame(animate);
          // Use non-null assertion operator to assure TS that renderer is not null
          renderer!.render(scene, camera);
        };
        animate();
      } catch (error) {
        console.error("three.js initialization failed:", error);
        if (renderer) {
          renderer.dispose();
        }
      }
    };

    initApp();

    return () => {
      isMounted = false;
      if (rendererRef.current) {
        cancelAnimationFrame(animationFrameId);
        rendererRef.current.dispose();
        rendererRef.current = null;
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
