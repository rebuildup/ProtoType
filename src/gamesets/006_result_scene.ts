import * as PIXI from "pixi.js";
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";
import { BG_grid } from "./018_grid";
import {
  savecache_localranking,
  insertLocalRanking,
  RankingPlayer,
} from "./020_cacheControl";

function createText(
  app: PIXI.Application,
  text_t: string = "",
  x: number = 0,
  y: number = 0,
  f_size: number = 38,
  option: number = 0
) {
  for (let i = 0; i < 100; i++) {
    if (
      ((gameData.total_hit_cnt - gameData.Miss) /
        ((gameData.EndTime - gameData.StartTime) / 1000)) *
        60 *
        (1 - gameData.Miss / gameData.total_hit_cnt) *
        (1 - gameData.Miss / gameData.total_hit_cnt) *
        (1 - gameData.Miss / gameData.total_hit_cnt) *
        100 +
        gameData.score_extra >
      gameData.localRanking[i].player_score
    ) {
    }
  }
  const output = new PIXI.Text({
    text: text_t,
    style: {
      fontFamily: gameData.FontFamily,
      fontSize: f_size,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  switch (option) {
    case 0: //center
      output.x = x - output.width / 2;
      output.y = y - output.height / 2;
      break;
    case 1: //left
      output.x = x;
      output.y = y - output.height / 2;
      break;
    case 2: //right
      output.x = x - output.width;
      output.y = y - output.height / 2;
      break;
  }

  app.stage.addChild(output);
  return output;
}
function padNumber(num: number) {
  return num < 10 ? "0" + num : num.toString();
}

export function result_scene(app: PIXI.Application): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!app.stage) {
      app.stage = new PIXI.Container();
    }
    app.stage.removeChildren();
    BG_grid(app);
    const newPlayer: RankingPlayer = {
      player_id: gameData.current_Player_id,
      player_name: gameData.current_Player_name,
      player_score:
        ((gameData.total_hit_cnt - gameData.Miss) /
          ((gameData.EndTime - gameData.StartTime) / 1000)) *
          60 *
          (1 - gameData.Miss / gameData.total_hit_cnt) *
          (1 - gameData.Miss / gameData.total_hit_cnt) *
          (1 - gameData.Miss / gameData.total_hit_cnt) *
          100 +
        gameData.score_extra,
    };
    const ur_rank_ind = insertLocalRanking(newPlayer);
    savecache_localranking();
    const align_opt = { center: 0, left: 1, right: 2 };

    createText(
      app,
      gameData.IsLoggedin ? "オンラインランキング" : "ローカルランキング",
      410,
      100,
      38,
      align_opt.center
    );
    for (let i = 0; i < 10; i++) {
      createText(
        app,
        padNumber(i + 1) + "     " + gameData.localRanking[i].player_name,
        150,
        70 * i + 200,
        35,
        align_opt.left
      );
      createText(
        app,
        String(gameData.localRanking[i].player_score.toFixed(0)),
        620,
        70 * i + 200,
        35,
        align_opt.right
      );
    }
    const Ur_rank_line = new PIXI.Graphics();
    Ur_rank_line.lineTo(500, -50).stroke({
      width: 2,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    Ur_rank_line.x = 150;
    Ur_rank_line.y = 930;
    app.stage.addChild(Ur_rank_line);
    createText(
      app,
      "Your Rank",
      150,
      app.screen.height - 200,
      38,
      align_opt.left
    );
    createText(
      app,
      ur_rank_ind == -1 ? "ランク外" : padNumber(ur_rank_ind + 1),
      620,
      app.screen.height - 200,
      38,
      align_opt.right
    );

    createText(
      app,
      "プレイ結果",
      app.screen.width - 380,
      100,
      38,
      align_opt.center
    );

    const result_margin = 70;
    const result_t_f_s = 32;
    const result_n_f_s = 30;
    const result_t_p_x = app.screen.width - 650;
    const result_n_p_x = app.screen.width - 120;
    const result_t_p_y = 200;
    createText(
      app,
      "スコア",
      result_t_p_x,
      result_t_p_y,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(
        (
          ((gameData.total_hit_cnt - gameData.Miss) /
            ((gameData.EndTime - gameData.StartTime) / 1000)) *
            60 *
            (1 - gameData.Miss / gameData.total_hit_cnt) *
            (1 - gameData.Miss / gameData.total_hit_cnt) *
            (1 - gameData.Miss / gameData.total_hit_cnt) *
            100 +
          gameData.score_extra
        ).toFixed(0)
      ),
      result_n_p_x,
      result_t_p_y,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "総タイプ",
      result_t_p_x,
      result_t_p_y + result_margin,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(gameData.total_hit_cnt.toFixed(0)),
      result_n_p_x,
      result_t_p_y + result_margin,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "正確性(%)",
      result_t_p_x,
      result_t_p_y + result_margin * 2,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(((1 - gameData.Miss / gameData.total_hit_cnt) * 100).toFixed(1)) +
        "%",
      result_n_p_x,
      result_t_p_y + result_margin * 2,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "ミス入力数",
      result_t_p_x,
      result_t_p_y + result_margin * 3,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(gameData.Miss),
      result_n_p_x,
      result_t_p_y + result_margin * 3,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "最大コンボ",
      result_t_p_x,
      result_t_p_y + result_margin * 4,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(gameData.max_combo),
      result_n_p_x,
      result_t_p_y + result_margin * 4,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "入力時間",
      result_t_p_x,
      result_t_p_y + result_margin * 5,
      result_t_f_s,
      align_opt.left
    );

    let time_text_t = "";
    if ((gameData.EndTime - gameData.StartTime) / 1000 > 60) {
      time_text_t +=
        String(
          ((gameData.EndTime - gameData.StartTime) / 1000 / 60).toFixed(0)
        ) + "分";
    }
    time_text_t +=
      String(
        (((gameData.EndTime - gameData.StartTime) / 1000) % 60).toFixed(0)
      ) + "秒";
    createText(
      app,
      time_text_t,
      result_n_p_x,
      result_t_p_y + result_margin * 5,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "平均kpm",
      result_t_p_x,
      result_t_p_y + result_margin * 6,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(
        (
          ((gameData.total_hit_cnt - gameData.Miss) /
            ((gameData.EndTime - gameData.StartTime) / 1000)) *
          60
        ).toFixed(0)
      ),
      result_n_p_x,
      result_t_p_y + result_margin * 6,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "最大kpm",
      result_t_p_x,
      result_t_p_y + result_margin * 7,
      result_t_f_s,
      align_opt.left
    );
    createText(
      app,
      String(gameData.MaxKPM.toFixed(0)),
      result_n_p_x,
      result_t_p_y + result_margin * 7,
      result_n_f_s,
      align_opt.right
    );
    createText(
      app,
      "ミスキー",
      result_t_p_x,
      result_t_p_y + result_margin * 8,
      result_t_f_s,
      align_opt.left
    );
    console.log(gameData.missKeys);
    let misskey_text_out = "無し";
    if (gameData.missKeys.length > 0) {
      misskey_text_out = gameData.missKeys[0];
    }
    for (
      let misskey = 1;
      misskey < (gameData.missKeys.length >= 5 ? 5 : gameData.missKeys.length);
      misskey++
    ) {
      misskey_text_out += " , ";
      misskey_text_out += gameData.missKeys[misskey];
    }
    createText(
      app,
      misskey_text_out,
      result_n_p_x,
      result_t_p_y + result_margin * 8,
      result_n_f_s,
      align_opt.right
    );

    const select_replay = new PIXI.Text({
      text: "リトライ",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 38,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_replay.x = app.screen.width - select_replay.width - 100;
    select_replay.y = app.screen.height - select_replay.height / 2 - 190;
    select_replay.interactive = true;
    select_replay.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_scene";
      resolve();
    });
    app.stage.addChild(select_replay);

    const select_select = new PIXI.Text({
      text: "ゲーム選択に戻る",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 38,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = app.screen.width - select_select.width - 100;
    select_select.y = app.screen.height - select_select.height / 2 - 120;
    select_select.interactive = true;
    select_select.on("pointerdown", async () => {
      gameData.CurrentSceneName = "game_select";
      resolve();
    });
    app.stage.addChild(select_select);
  });
}
/*
 const combo_text = new PIXI.Text({
      text: "30",
      style: {
        fontFamily: getProp("FontFamily"),
        fontSize: 100,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
    combo_text.y = win_pos.y - combo_text.height / 2;
    app.stage.addChild(combo_text);



*/
