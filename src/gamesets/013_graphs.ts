import * as PIXI from "pixi.js";
import { settings } from "../SiteInterface";
import { replaceHash } from "./001_game_master";
import { gameData } from "./002_gameConfig";

export function score_graph(app: PIXI.Application, container: PIXI.Container) {
  const graph_no_loggedin = new PIXI.Text({
    text: "グラフ未実装ヤバいです",
    style: {
      fontFamily: gameData.FontFamily,
      fontSize: 30,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  graph_no_loggedin.x = app.screen.width / 2 - graph_no_loggedin.width / 2;
  graph_no_loggedin.y = app.screen.height / 2 - graph_no_loggedin.height / 2;
  container.addChild(graph_no_loggedin);
}
