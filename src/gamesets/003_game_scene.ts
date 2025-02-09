import * as PIXI from "pixi.js";
import { replaceHash } from "./001_game_master";
import { gameData } from "./002_gameConfig";
import { Keyboard, keybord_size, scale } from "./011_keybord";

import { settings } from "../SiteInterface";

import { getLatestKey, keyCodeToText } from "./009_keyinput";

import {
  getNextKeysOptimized,
  getRomanizedTextFromTendency,
} from "./008_generate_pattern";

export async function game_scene(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    app.stage.removeChildren();

    console.log(gameData.KeyLayout);
    console.log(settings.keyLayout);

    const win_pos = { x: app.screen.width / 2, y: app.screen.height / 2 };

    let keybord_flag = true;

    switch (gameData.GameMode) {
      case "nomal":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 200;

        gameData.Issues_num = 15;
        gameData.current_Issue = 0;
        break;
      case "focus":
        keybord_flag = false;
        gameData.Issues_num = 15;
        gameData.current_Issue = 0;
        break;
      case "exact":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 200;
        break;
      case "long":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 200;
        break;
      default:
        console.log("gamemode nothing");
        resolve();
        break;
    }

    const sentetce_text = new PIXI.Text({
      text: "スペースキーでスタート",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });

    sentetce_text.x = win_pos.x - sentetce_text.width / 2;
    sentetce_text.y = win_pos.y - sentetce_text.height / 2 - 2;
    app.stage.addChild(sentetce_text);
    const alphabet_text = new PIXI.Text({
      text: "space to start",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 25,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    alphabet_text.x = win_pos.x - alphabet_text.width / 2;
    alphabet_text.y = win_pos.y - alphabet_text.height / 2 + 40;
    app.stage.addChild(alphabet_text);
    const next_text = new PIXI.Text({
      text: "",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 25,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    next_text.x = win_pos.x - next_text.width / 2;
    next_text.y = win_pos.y - next_text.height / 2 + 150;
    app.stage.addChild(next_text);

    const score_text = new PIXI.Text({
      text: "30000",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 25,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    score_text.x = win_pos.x - score_text.width / 2;
    score_text.y = win_pos.y - score_text.height / 2 - 200;
    app.stage.addChild(score_text);

    const combo_text = new PIXI.Text({
      text: "0",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
    combo_text.y = win_pos.y - combo_text.height / 2;
    app.stage.addChild(combo_text);

    const kpm_text = new PIXI.Text({
      text: "5.2",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "right",
      },
    });
    kpm_text.x = win_pos.x - kpm_text.width + (keybord_size.width * scale) / 2;
    kpm_text.y = win_pos.y - kpm_text.height / 2;
    app.stage.addChild(kpm_text);

    const accuracyLine = new PIXI.Graphics();
    accuracyLine.moveTo(
      win_pos.x - (keybord_size.width * scale) / 2,
      win_pos.y - 250
    );
    accuracyLine.lineTo(
      win_pos.x + (keybord_size.width * scale) / 2,
      win_pos.y - 250
    );
    accuracyLine.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      alpha: 1,
    });
    app.stage.addChild(accuracyLine);
    const progressLine = new PIXI.Graphics();
    progressLine.moveTo(
      win_pos.x - (keybord_size.width * scale) / 2,
      win_pos.y + 250
    );
    progressLine.lineTo(
      win_pos.x + (keybord_size.width * scale) / 2,
      win_pos.y + 250
    );
    progressLine.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
      alpha: 1,
    });
    app.stage.addChild(progressLine);
    const progressDot = new PIXI.Graphics();

    progressDot.circle(0, win_pos.y + 250, 8);
    progressDot.x = win_pos.x - (keybord_size.width * scale) / 2;
    progressDot.fill(replaceHash(settings.colorTheme.colors.MainBG));
    progressDot.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    app.stage.addChild(progressDot);

    if (keybord_flag) {
      Keyboard(app);
    }
    const load_text = new PIXI.Text({
      text: "問題を取得中",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 25,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    gameData.IsStarted = false;
    load_text.x = win_pos.x - load_text.width / 2;
    load_text.y = win_pos.y - load_text.height / 2 - 300;
    gameData.combo_cnt = 0;
    app.stage.addChild(load_text);
    gameData.current_inputed = "";
    setTimeout(async () => {
      await makeIssues();
      setTimeout(() => {
        app.stage.removeChild(load_text);
      }, 100);
      while (gameData.CurrentSceneName == "game_scene") {
        const keyCode = await getLatestKey();
        console.log(keyCode);
        if (gameData.IsStarted) {
          if (keyCode.code === "Escape") {
            gameData.CurrentSceneName = "reload_game";
            resolve();
          }
          let collectkeys = getNextKeysOptimized(
            gameData.Issues[gameData.current_Issue].romaji,
            gameData.current_inputed
          );
          if (keyCodeToText(keyCode.code, keyCode.shift) != "") {
            let Ismiss = true;
            for (let i = 0; i < collectkeys.length; i++) {
              if (
                keyCodeToText(keyCode.code, keyCode.shift) ==
                collectkeys[i].letter
              ) {
                Ismiss = false;
                gameData.current_inputed =
                  gameData.current_inputed +
                  keyCodeToText(keyCode.code, keyCode.shift);
                const tendency = gameData.Conversion.find(
                  (t) => t.key === collectkeys[i].flag.configKey
                );
                if (tendency) {
                  tendency.tendency = String(collectkeys[i].flag.origin);
                }
                break;
              }
            }
            if (Ismiss) {
              playMiss();
              gameData.Miss++;
              gameData.combo_cnt = 0;
            } else {
              playCollect();
              gameData.combo_cnt++;
              if (gameData.combo_cnt > gameData.max_combo)
                gameData.max_combo = gameData.combo_cnt;
            }
          }

          if (
            getNextKeysOptimized(
              gameData.Issues[gameData.current_Issue].romaji,
              gameData.current_inputed
            ).length == 0
          ) {
            gameData.current_Issue++;
            gameData.current_inputed = "";

            if (gameData.current_Issue >= gameData.Issues_num) {
              gameData.CurrentSceneName = "result_scene";
              resolve();
            }
          }
          if (gameData.current_Issue + 1 >= gameData.Issues_num) {
            next_text.text = "";
          } else {
            next_text.text = gameData.Issues[gameData.current_Issue + 1].text;
          }
          sentetce_text.text = gameData.Issues[gameData.current_Issue].text;
          sentetce_text.x = win_pos.x - sentetce_text.width / 2;

          alphabet_text.text = getRomanizedTextFromTendency(
            gameData.Conversion,
            gameData.Issues[gameData.current_Issue].romaji,
            gameData.current_inputed
          );
          alphabet_text.x = win_pos.x - alphabet_text.width / 2;
          next_text.x = win_pos.x - next_text.width / 2;
          progressDot.x =
            (keybord_size.width / gameData.Issues_num) *
              scale *
              gameData.current_Issue +
            (app.screen.width - keybord_size.width * scale) / 2;
          combo_text.text = gameData.combo_cnt;
          combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
        } else {
          if (keyCode.code === "Space") {
            gameData.IsStarted = true;

            if (gameData.current_Issue >= gameData.Issues_num) {
              gameData.CurrentSceneName = "result_scene";
              resolve();
            }
            if (gameData.current_Issue + 1 >= gameData.Issues_num) {
              next_text.text = "";
            } else {
              next_text.text = gameData.Issues[gameData.current_Issue + 1].text;
            }
            sentetce_text.text = gameData.Issues[gameData.current_Issue].text;
            sentetce_text.x = win_pos.x - sentetce_text.width / 2;

            alphabet_text.text = getRomanizedTextFromTendency(
              gameData.Conversion,
              gameData.Issues[gameData.current_Issue].romaji,
              gameData.current_inputed
            );
            alphabet_text.x = win_pos.x - alphabet_text.width / 2;
            next_text.x = win_pos.x - next_text.width / 2;
            progressDot.x =
              (keybord_size.width / gameData.Issues_num) *
                scale *
                gameData.current_Issue +
              (app.screen.width - keybord_size.width * scale) / 2;
            combo_text.text = gameData.combo_cnt;
            combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
          }
        }
      }
    }, 100);
  });
}

import { Issue } from "./002_gameConfig";
import { playCollect, playMiss } from "./012_soundplay";
async function makeIssues(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    let Issues: Issue[] = [];

    for (let i = 0; i < gameData.Issues_num + 1; i++) {
      let new_Issue: Issue = {
        text: example[i].text,
        romaji: example[i].hiragana,
      };

      Issues.push(new_Issue);
    }
    gameData.Issues = Issues;

    resolve();
  });
}

const example = [
  { text: "レンタルひらがな「ぬ」", hiragana: "れんたるひらがな[ぬ]" },
  { text: "嘘だよーん", hiragana: "うそだよ-ん" },
  {
    text: "ゴッホより普通にラッセンが好き",
    hiragana: "ごっほよりふつうにらっせんがすき",
  },
  { text: "ああそれいいよね みちお", hiragana: "ああそれいいよね みちお" },
  {
    text: "3回見たら死ぬ絵みたいな顔",
    hiragana: "3かいみたらしぬえみたいなかお",
  },
  {
    text: "ロイター通信じゃないですぅ",
    hiragana: "ろいた-つうしんじゃないですぅ",
  },
  { text: "そんなことって...", hiragana: "そんなことって..." },
  { text: "𰻞𰻞麺", hiragana: "びゃんびゃんめん" },
  { text: "踊る方のバレーボール", hiragana: "おどるほうのばれ-ぼ-る" },
  {
    text: "テキスト長いと処理落ちする",
    hiragana: "てきすとながいとしょりおちする",
  },
  {
    text: "まるでミシシッピアカミミガメ",
    hiragana: "まるでみししっぴあかみみがめ",
  },
  { text: "ポリネシアンルーレット", hiragana: "ぽりねしあんる-れっと" },
  { text: "I my me mine", hiragana: "I my me mine" },
  { text: "もしかして ムッソリーニ", hiragana: "もしかして むっそり-に" },
  { text: "Xをフォローしといてね", hiragana: "Xをふぉろ-しといてね" },
  { text: "青眼の白龍", hiragana: "ぶるーあいずほわいとどらごん" },
];
