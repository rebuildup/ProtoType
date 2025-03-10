// SquareEffect.ts - 中心から拡大する45度回転した正方形エフェクト
import gsap from "gsap";
import { settings } from "../SiteInterface";

// 正方形エフェクトのクラス
class SquareEffectManager {
  private squareElements: {
    background: HTMLDivElement; // 太い線のバックグラウンド正方形（MainColor）
    foreground: HTMLDivElement; // 細い線のフォアグラウンド正方形（MainAccent）
  };

  private isInitialized = false;

  constructor() {
    // 初期化時に要素を作成
    this.squareElements = {
      background: document.createElement("div"),
      foreground: document.createElement("div"),
    };
  }

  // 正方形エフェクトの初期化
  initialize(): boolean {
    if (this.isInitialized) {
      return true;
    }

    try {
      // テーマカラーを取得
      const mainColor = settings.colorTheme.colors.MainColor;
      const accentColor = settings.colorTheme.colors.MainAccent;

      // 背景正方形（MainColor - 太めの線）
      this.squareElements.background.id = "square-effect-background";
      this.squareElements.background.style.position = "fixed";
      this.squareElements.background.style.top = "50%";
      this.squareElements.background.style.left = "50%";
      this.squareElements.background.style.width = "50px";
      this.squareElements.background.style.height = "50px";
      this.squareElements.background.style.boxSizing = "border-box";
      this.squareElements.background.style.border = `4px solid ${mainColor}`;
      this.squareElements.background.style.transform =
        "translate(-50%, -50%) rotate(45deg)";
      this.squareElements.background.style.opacity = "0";
      this.squareElements.background.style.pointerEvents = "none";
      this.squareElements.background.style.zIndex = "1"; // キャンバスの後ろ

      // 前景正方形（MainAccent - 細めの線）
      this.squareElements.foreground.id = "square-effect-foreground";
      this.squareElements.foreground.style.position = "fixed";
      this.squareElements.foreground.style.top = "50%";
      this.squareElements.foreground.style.left = "50%";
      this.squareElements.foreground.style.width = "50px";
      this.squareElements.foreground.style.height = "50px";
      this.squareElements.foreground.style.boxSizing = "border-box";
      this.squareElements.foreground.style.border = `2px solid ${accentColor}`;
      this.squareElements.foreground.style.transform =
        "translate(-50%, -50%) rotate(45deg)";
      this.squareElements.foreground.style.opacity = "0";
      this.squareElements.foreground.style.pointerEvents = "none";
      this.squareElements.foreground.style.zIndex = "9999"; // キャンバスの手前

      // DOMに追加
      if (document.body) {
        document.body.appendChild(this.squareElements.background);
        document.body.appendChild(this.squareElements.foreground);
      } else {
        return false;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  // 正方形エフェクトの実行
  triggerEffect(): void {
    if (!this.isInitialized) {
      const success = this.initialize();
      if (!success) {
        return;
      }
    }

    // 画面サイズを取得
    const viewportWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const viewportHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    // 対角線の長さを計算（ピタゴラスの定理）
    const maxSize =
      Math.sqrt(
        viewportWidth * viewportWidth + viewportHeight * viewportHeight
      ) * 1.5;

    try {
      // 背景正方形のアニメーション（少し遅れて開始、ゆっくり拡大）
      gsap.fromTo(
        this.squareElements.background,
        {
          width: "0px",
          height: "0px",
          opacity: 0.8,
        },
        {
          width: `${maxSize}px`,
          height: `${maxSize}px`,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.1,
        }
      );

      // 前景正方形のアニメーション（先に開始、速く拡大）
      gsap.fromTo(
        this.squareElements.foreground,
        {
          width: "0px",
          height: "0px",
          opacity: 0.9,
        },
        {
          width: `${maxSize}px`,
          height: `${maxSize}px`,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        }
      );
    } catch (error) {
      // エラー処理（サイレント）
    }
  }
}

// シングルトンインスタンス
const squareEffectManager = new SquareEffectManager();

// ゲームから呼び出せる簡単な関数
export function triggerSquareEffect(): void {
  squareEffectManager.triggerEffect();
}

// 初期化のヘルプ関数
export function initializeSquareEffect(): boolean {
  return squareEffectManager.initialize();
}
