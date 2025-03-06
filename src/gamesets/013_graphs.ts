import * as PIXI from "pixi.js";
import { settings } from "../SiteInterface";
import { replaceHash } from "./001_game_master";
import { gameData } from "./002_gameConfig";
import { RankingPlayer } from "./020_cacheControl";

export function score_graph(app: PIXI.Application, container: PIXI.Container) {
  const sortedStructs: RankingPlayer[] = gameData.localRanking
    .slice()
    .sort((a, b) => a.player_play_date - b.player_play_date);
  // console.log(sortedStructs);
  const G = new PIXI.Graphics();
  G.rect(0, 0, 800, 600).fill(
    replaceHash(settings.colorTheme.colors.SecondAccent)
  );
  G.x = app.screen.width / 2 - G.width / 2;
  G.y = app.screen.height / 2 - G.height / 2;
  container.addChild(G);
  const data_length =
    sortedStructs
      .map((player) => player.player_score)
      .filter((score) => score !== 0).length > 100
      ? 100
      : sortedStructs
          .map((player) => player.player_score)
          .filter((score) => score !== 0).length;
  for (let i = 0; i < data_length; i++) {
    const score_point = new PIXI.Graphics();
    score_point
      .circle(0, 0, 4)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    score_point.x =
      (i - data_length / 2) * (800 / data_length) + app.screen.width / 2;
    score_point.y =
      app.screen.height / 2 -
      sortedStructs[data_length - i - 1].player_score / 10;
    container.addChild(score_point);
    const acc_point = new PIXI.Graphics();
    acc_point
      .circle(0, 0, 4)
      .fill(replaceHash(settings.colorTheme.colors.MainColor));
    acc_point.x =
      (i - data_length / 2) * (800 / data_length) + app.screen.width / 2;
    acc_point.y =
      app.screen.height / 2 -
      300 * (sortedStructs[data_length - i - 1].player_accracy / 100 - 0.5);
    container.addChild(acc_point);
  }
}
