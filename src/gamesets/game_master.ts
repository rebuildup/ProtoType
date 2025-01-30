// game_master.ts
import * as PIXI from "pixi.js";
import { getProp } from "../gamesets/gameConfig";
type MoveState = {
  text: PIXI.Text;
  speed: number;
  direction: number;
  moveRange: { minX: number; maxX: number };
};

export function initializeGame(app: PIXI.Application) {
  const textStyle = new PIXI.TextStyle({
    fontFamily: getProp("FontFamily"),
    fontSize: 48,
    fill: 0xffffff,
    dropShadow: {
      color: 0x000000,
      blur: 4,
      distance: 2,
    },
  });

  const text = new PIXI.Text("Moving Text!", textStyle);

  const moveState: MoveState = {
    text,
    speed: 5,
    direction: 1,
    moveRange: {
      minX: 100,
      maxX: app.screen.width - 100,
    },
  };

  text.anchor.set(0.5);
  text.position.set(moveState.moveRange.minX, app.screen.height / 2);

  app.stage.addChild(text);

  app.ticker.add((ticker: PIXI.Ticker) => {
    const { text, speed, direction, moveRange } = moveState;
    const delta = ticker.deltaTime;

    text.x += speed * delta * direction;

    if (text.x >= moveRange.maxX || text.x <= moveRange.minX) {
      moveState.direction *= -1;
    }
  });

  text.eventMode = "static";
  text.cursor = "pointer";

  text.on("pointerdown", () => {
    text.tint = Math.random() * 0xffffff;
  });
}
