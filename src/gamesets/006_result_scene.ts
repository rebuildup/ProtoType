import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);
import { gameData } from "./002_gameConfig";
import { replaceHash } from "./001_game_master";
import { settings } from "../SiteInterface";
import { BG_grid } from "./018_grid";
import {
  savecache_localranking,
  insertLocalRanking,
  RankingPlayer,
  insertOnlineRanking,
} from "./020_cacheControl";
import { getLatestKey } from "./009_keyinput";
import { playMiss } from "./012_soundplay";
import { saveToCache } from "./020_cacheControl";
import { postPlayData } from "./010_APIget";

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
  return new Promise<void>(async (resolve) => {
    if (!app.stage) {
      app.stage = new PIXI.Container();
    }
    app.stage.removeChildren();
    BG_grid(app);
    gameData.played_cnt++;
    saveToCache("played_cnt_GM", gameData.played_cnt);
    gameData.total_keyhit += gameData.total_hit_cnt;
    saveToCache("total_keyhit_GM", gameData.total_keyhit);
    if (!gameData.IsLoggedin) {
      gameData.current_Player_id++;
    }

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
      player_accracy: (1 - gameData.Miss / gameData.total_hit_cnt) * 100,
      player_avg_kpm:
        ((gameData.total_hit_cnt - gameData.Miss) /
          ((gameData.EndTime - gameData.StartTime) / 1000)) *
        60,
      player_max_kpm: gameData.MaxKPM,
    };
    let ur_rank_ind = insertLocalRanking(newPlayer);
    if (gameData.IsLoggedin) {
      ur_rank_ind = insertOnlineRanking(newPlayer);
    }
    savecache_localranking();
    if (gameData.IsLoggedin) {
      postPlayData(
        gameData.current_Player_id,
        gameData.current_Player_name,
        ((gameData.total_hit_cnt - gameData.Miss) /
          ((gameData.EndTime - gameData.StartTime) / 1000)) *
          60 *
          (1 - gameData.Miss / gameData.total_hit_cnt) *
          (1 - gameData.Miss / gameData.total_hit_cnt) *
          (1 - gameData.Miss / gameData.total_hit_cnt) *
          100 +
          gameData.score_extra,
        (1 - gameData.Miss / gameData.total_hit_cnt) * 100,
        ((gameData.total_hit_cnt - gameData.Miss) /
          ((gameData.EndTime - gameData.StartTime) / 1000)) *
          60,
        gameData.MaxKPM
      );
    }

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
        gameData.IsLoggedin
          ? padNumber(i + 1) + "   " + gameData.onlineRanking[i].player_name
          : padNumber(i + 1) + "   " + gameData.localRanking[i].player_name,
        150,
        70 * i + 200,
        35,
        align_opt.left
      );
      createText(
        app,
        gameData.IsLoggedin
          ? String(gameData.onlineRanking[i].player_score.toFixed(0))
          : String(gameData.localRanking[i].player_score.toFixed(0)),
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
        fontSize: 32,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_replay.x = app.screen.width - select_replay.width - 130;
    select_replay.y = app.screen.height - select_replay.height / 2 - 190;
    select_replay.interactive = true;
    select_replay.on("pointerdown", async () => {
      retry();
    });
    app.stage.addChild(select_replay);

    const select_select = new PIXI.Text({
      text: "ゲーム選択に戻る",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 32,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    select_select.x = app.screen.width - select_select.width - 130;
    select_select.y = app.screen.height - select_select.height / 2 - 120;
    select_select.interactive = true;
    select_select.on("pointerdown", async () => {
      over();
    });
    function retry() {
      currentKeyController?.abort();
      if (gameData.IsLoggedin) {
        gameData.CurrentSceneName = "game_scene";
      } else {
        gameData.CurrentSceneName = "register_scene";
      }

      resolve();
    }
    function over() {
      currentKeyController?.abort();
      gameData.CurrentSceneName = "game_select";
      resolve();
    }
    app.stage.addChild(select_select);
    const selectDotAcc = new PIXI.Graphics();
    selectDotAcc.circle(0, 0, 8);
    selectDotAcc.x = app.screen.width - 110;
    selectDotAcc.y = app.screen.height - 190;
    selectDotAcc.fill(replaceHash(settings.colorTheme.colors.MainAccent));
    selectDotAcc.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainAccent),
    });
    app.stage.addChild(selectDotAcc);
    gsap.fromTo(
      selectDotAcc,
      { alpha: 0 },
      { alpha: 1, duration: 2, ease: "power3.out" }
    );
    function dot_anim(y: number) {
      gsap.to(selectDotAcc, {
        y: y,
        duration: 0.5,
        ease: "power4.out",
      });
    }
    let currentKeyController: AbortController | null = null;
    let select = 0;
    while (gameData.CurrentSceneName === "result_scene") {
      currentKeyController = new AbortController();
      try {
        const keyCode = await getLatestKey(currentKeyController.signal);
        if (
          [
            "ArrowDown",
            "ArrowRight",
            "ShiftRight",
            "ArrowUp",
            "ArrowLeft",
            "ShiftLeft",
          ].includes(keyCode.code)
        ) {
          playMiss(0.3);
          select = select == 0 ? 1 : 0;
          switch (select) {
            case 0:
              dot_anim(app.screen.height - 190);
              break;
            case 1:
              dot_anim(app.screen.height - 120);
              break;
            default:
              dot_anim(app.screen.height - 190);
              break;
          }
        } else if (["Escape"].includes(keyCode.code)) {
          retry();
        } else if (["Enter", "Space"].includes(keyCode.code)) {
          switch (select) {
            case 0:
              retry();
              break;
            case 1:
              over();
              break;
            default:
              over();
              break;
          }
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          break;
        } else {
          console.error(error);
        }
      }
    }
  });
}
