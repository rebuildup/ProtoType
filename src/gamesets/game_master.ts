// game_master.ts
import * as PIXI from "pixi.js";

type MoveState = {
  text: PIXI.Text;
  speed: number;
  direction: number;
  moveRange: { minX: number; maxX: number };
};

export function initializeGame(app: PIXI.Application) {
  // テキストスタイル設定
  const textStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xffffff,
    fontWeight: "bold",
    dropShadow: {
      color: 0x000000,
      blur: 4,
      distance: 2,
    },
  });

  // テキストオブジェクトの作成
  const text = new PIXI.Text("Moving Text!", textStyle);

  // アニメーション状態の初期化
  const moveState: MoveState = {
    text,
    speed: 5, // 移動速度（ピクセル/フレーム）
    direction: 1, // 移動方向（1:右へ、-1:左へ）
    moveRange: {
      minX: 100,
      maxX: app.screen.width - 100,
    },
  };

  // 初期位置設定（左端）
  text.anchor.set(0.5);
  text.position.set(moveState.moveRange.minX, app.screen.height / 2);

  app.stage.addChild(text);

  // アニメーションループ
  app.ticker.add((ticker: PIXI.Ticker) => {
    const { text, speed, direction, moveRange } = moveState;
    const delta = ticker.deltaTime;

    // X座標の更新
    text.x += speed * delta * direction;

    // 方向反転チェック
    if (text.x >= moveRange.maxX || text.x <= moveRange.minX) {
      moveState.direction *= -1;
    }
  });

  // クリックで色変更
  text.eventMode = "static";
  text.cursor = "pointer";

  text.on("pointerdown", () => {
    text.tint = Math.random() * 0xffffff;
  });
}
