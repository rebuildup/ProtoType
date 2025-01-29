import * as PIXI from "pixi.js";

export class GameMaster {
  private app: PIXI.Application;
  private text: PIXI.Text | undefined; // 修正: undefined で初期化

  constructor(app: PIXI.Application) {
    this.app = app;
    this.init();
  }

  private init() {
    // Create a text object
    this.text = new PIXI.Text("Hello, PIXI.js!", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: 0x000000,
      align: "center",
    });

    // Position the text at the center of the screen
    this.text.x = this.app.screen.width / 2;
    this.text.y = this.app.screen.height / 2;
    this.text.anchor.set(0.5);

    // Add text to the stage
    this.app.stage.addChild(this.text);
  }
}

// Export a function to initialize GameMaster
export const initializeGame = (app: PIXI.Application) => {
  return new GameMaster(app);
};
