import * as PIXI from "pixi.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);
import { replaceHash } from "./001_game_master";
import { gameData } from "./002_gameConfig";
import { Keyboard, keybord_size, scale } from "./011_keybord";

import { settings } from "../SiteInterface";

import { getLatestKey, keyCodeToText } from "./009_keyinput";

import {
  getNextKeysOptimized,
  getRomanizedTextFromTendency,
} from "./008_generate_pattern";
import { GlowFilter } from "pixi-filters";

import { BG_grid } from "./018_grid";

import { GM_start } from "./014_mogura";

const anim_max_width = 100;
export async function game_scene(app: PIXI.Application): Promise<void> {
  return new Promise(async (resolve) => {
    app.stage.removeChildren();

    app.stage.sortableChildren = true;

    const BG_plane = new PIXI.Graphics();
    app.stage.addChild(BG_plane);
    BG_plane.rect(0, 0, app.screen.width, app.screen.height).fill(
      replaceHash(settings.colorTheme.colors.MainBG)
    );
    //console.log(gameData.KeyLayout);
    //console.log(settings.keyLayout);
    const grid = BG_grid(app);

    const glowFilter = new GlowFilter({
      distance: 28, // Glow distance
      outerStrength: 10, // Outer glow strength
      innerStrength: 0, // Inner glow strength
      color: 0xffffff, // Glow color
      quality: 0.01,
      alpha: 0.02, // Glow quality
    });

    const win_pos = { x: app.screen.width / 2, y: app.screen.height / 2 };

    let keybord_flag = true;
    gameData.current_Issue = 0;
    switch (gameData.GameMode) {
      case "nomal":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 210;
        gameData.Issues_num = 15;
        break;
      case "focus":
        keybord_flag = false;
        gameData.Issues_num = 15;
        win_pos.y = app.screen.height / 2 - 100;
        break;
      case "exact":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 210;
        break;
      case "long":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 210;
        break;
      case "number":
        keybord_flag = true;
        win_pos.y = app.screen.height / 2 - 210;
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
    sentetce_text.filters = glowFilter;
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
    alphabet_text.alpha = 0.6;

    app.stage.addChild(alphabet_text);
    const alphabet_current_text = new PIXI.Text({
      text: "",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 25,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    alphabet_current_text.x = win_pos.x - alphabet_current_text.width / 2;
    alphabet_current_text.y = win_pos.y - alphabet_current_text.height / 2 + 40;
    alphabet_current_text.filters = glowFilter;
    app.stage.addChild(alphabet_current_text);

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
    next_text.filters = glowFilter;
    app.stage.addChild(next_text);

    const score_text = new PIXI.Text({
      text: "",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 25,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    score_text.x = win_pos.x - score_text.width / 2;
    score_text.y = win_pos.y - score_text.height / 2 - 200;
    score_text.filters = glowFilter;
    app.stage.addChild(score_text);

    const combo_text = new PIXI.Text({
      text: "",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "center",
      },
    });
    combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
    combo_text.y = win_pos.y - combo_text.height / 2;
    combo_text.filters = glowFilter;
    app.stage.addChild(combo_text);

    const kpm_text = new PIXI.Text({
      text: "",
      style: {
        fontFamily: gameData.FontFamily,
        fontSize: 40,
        fill: replaceHash(settings.colorTheme.colors.MainColor),
        align: "right",
      },
    });
    kpm_text.x = win_pos.x - kpm_text.width + (keybord_size.width * scale) / 2;
    kpm_text.y = win_pos.y - kpm_text.height / 2;
    kpm_text.filters = glowFilter;
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
    accuracyLine.filters = glowFilter;
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
    progressLine.filters = glowFilter;
    app.stage.addChild(progressLine);
    const progressDot = new PIXI.Graphics();

    progressDot.circle(0, win_pos.y + 250, 8);
    progressDot.x = win_pos.x - (keybord_size.width * scale) / 2;
    progressDot.fill(replaceHash(settings.colorTheme.colors.MainBG));
    progressDot.stroke({
      width: 4,
      color: replaceHash(settings.colorTheme.colors.MainColor),
    });
    progressDot.filters = glowFilter;
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

    const frame_left = new PIXI.Graphics();
    app.stage.addChild(frame_left);
    frame_left
      .rect(0, 0, anim_max_width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    frame_left.x = -anim_max_width;
    frame_left.filters = glowFilter;

    const frame_right = new PIXI.Graphics();
    app.stage.addChild(frame_right);
    frame_right
      .rect(0, 0, anim_max_width, app.screen.height)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    frame_right.x = app.screen.width;
    frame_right.filters = glowFilter;

    const frame_top = new PIXI.Graphics();
    app.stage.addChild(frame_top);
    frame_top
      .rect(0, 0, app.screen.width, anim_max_width)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    frame_top.y = -anim_max_width;
    frame_top.filters = glowFilter;

    const frame_bottom = new PIXI.Graphics();
    app.stage.addChild(frame_bottom);
    frame_bottom
      .rect(0, 0, app.screen.width, anim_max_width)
      .fill(replaceHash(settings.colorTheme.colors.MainAccent));
    frame_bottom.y = app.screen.height;
    frame_bottom.filters = glowFilter;

    function frame_anim(kpm: number) {
      let ratio = 0;
      if (kpm != -1) {
        ratio = kpm / 10;
      }
      let offset = anim_max_width * ratio;
      let rect_alphas = kpm < 10 ? 0.4 : 0.8;
      frame_left.alpha = rect_alphas;
      frame_right.alpha = rect_alphas;
      frame_top.alpha = rect_alphas;
      frame_bottom.alpha = rect_alphas;

      gsap.fromTo(
        frame_left,
        { x: offset - anim_max_width, y: offset },
        {
          x: -anim_max_width,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }
      );
      gsap.fromTo(
        frame_right,
        { x: app.screen.width - offset, y: -offset },
        {
          x: app.screen.width,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }
      );
      gsap.fromTo(
        frame_top,
        { x: -offset, y: offset - anim_max_width },
        {
          x: 0,
          y: -anim_max_width,
          duration: 1,
          ease: "power2.out",
        }
      );
      gsap.fromTo(
        frame_bottom,
        { x: offset, y: app.screen.height - offset },
        {
          x: 0,
          y: app.screen.height,
          duration: 1,
          ease: "power2.out",
        }
      );
    }

    let keyTimestamps: number[] = [];

    function recordKey(): void {
      const now: number = Date.now();
      keyTimestamps.push(now);
      if (keyTimestamps.length > gameData.instant_key_n) {
        keyTimestamps.shift();
      }
    }

    function getTypingSpeed(): number {
      if (keyTimestamps.length < gameData.instant_key_n) {
        return -1;
      }
      let totalDelta = 0;
      for (let i = 0; i < gameData.instant_key_n - 1; i++) {
        totalDelta += keyTimestamps[i + 1] - keyTimestamps[i];
      }
      const avgDelta: number = totalDelta / (gameData.instant_key_n - 1);

      if (avgDelta === 0) {
        return Infinity;
      }

      return 1000 / avgDelta;
    }

    gameData.IsStarted = false;
    load_text.x = win_pos.x - load_text.width / 2;
    load_text.y = win_pos.y - load_text.height / 2 - 300;
    gameData.combo_cnt = 0;
    gameData.total_hit_cnt = 0;
    gameData.Miss = 0;
    gameData.game_failure = false;
    app.stage.addChild(load_text);
    gameData.current_inputed = "";
    gameData.score_extra = 0;
    gameData.Score = 0;
    gameData.MaxScore = 0;
    gameData.MaxKPM = 0;

    setTimeout(async () => {
      await makeIssues(3, 6, gameData.Issues_num);
      setTimeout(() => {
        app.stage.removeChild(load_text);
      }, 100);
      while (gameData.CurrentSceneName == "game_scene") {
        try {
          const keyCode = await getLatestKey();

          if (gameData.IsStarted) {
            if (keyCode.code === "Escape") {
              gameData.CurrentSceneName = "reload_game";
              gameData.EndTime = Date.now();
              resolve();
            }
            let collectkeys = getNextKeysOptimized(
              gameData.Issues[gameData.current_Issue].romaji,
              gameData.current_inputed
            );
            //console.log(collectkeys);
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
                //console.log("miss");
                //console.log(keyCode);
                playMiss();
                filterflash(app);
                gameData.Miss++;
                gameData.combo_cnt = 0;
                gameData.total_hit_cnt++;
                console.log(collectkeys);
                console.log(keyCode.code);
              } else {
                //console.log("collect");
                //console.log(keyCode);
                playCollect();
                frame_anim(getTypingSpeed());
                gameData.combo_cnt++;
                if (gameData.combo_cnt > gameData.max_combo)
                  gameData.max_combo = gameData.combo_cnt;
                gameData.total_hit_cnt++;
                recordKey();
                if (
                  isFibonacci(gameData.combo_cnt) &&
                  gameData.combo_cnt > 20
                ) {
                  gameData.score_extra += gameData.combo_cnt * 10;
                }
                let tmp_kpm =
                  ((gameData.total_hit_cnt - gameData.Miss) /
                    ((Date.now() - gameData.StartTime) / 1000)) *
                  60;
                gameData.Score =
                  tmp_kpm *
                    (1 - gameData.Miss / gameData.total_hit_cnt) *
                    (1 - gameData.Miss / gameData.total_hit_cnt) *
                    (1 - gameData.Miss / gameData.total_hit_cnt) *
                    100 +
                  gameData.score_extra;
                if (gameData.Score > gameData.MaxScore)
                  gameData.MaxScore = gameData.Score;
                if (tmp_kpm > gameData.MaxKPM) gameData.MaxKPM = tmp_kpm;
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
                gameData.EndTime = Date.now();
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
            alphabet_current_text.text = gameData.current_inputed;
            alphabet_current_text.x = win_pos.x - alphabet_text.width / 2;
            next_text.x = win_pos.x - next_text.width / 2;
            progressDot.x =
              (keybord_size.width / gameData.Issues_num) *
                scale *
                gameData.current_Issue +
              (app.screen.width - keybord_size.width * scale) / 2;
            if (gameData.combo_cnt == 0) {
              combo_text.text = "";
            } else {
              combo_text.text = gameData.combo_cnt;
            }

            combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;

            //console.log(gameData.Miss / gameData.total_hit_cnt);
            if (gameData.total_hit_cnt > 5) {
              accuracyLine.clear();
              accuracyLine.moveTo(
                win_pos.x -
                  ((keybord_size.width * scale) / 2) *
                    (1 - gameData.Miss / gameData.total_hit_cnt),
                win_pos.y - 250
              );
              accuracyLine.lineTo(
                win_pos.x +
                  ((keybord_size.width * scale) / 2) *
                    (1 - gameData.Miss / gameData.total_hit_cnt),
                win_pos.y - 250
              );
              accuracyLine.stroke({
                width: 4,
                color: replaceHash(settings.colorTheme.colors.MainColor),
                alpha: 1,
              });
            }
            score_text.text = gameData.Score.toFixed(0);
            score_text.x = win_pos.x - score_text.width / 2;
            if (getTypingSpeed() == -1) {
              kpm_text.text = "";
            } else {
              kpm_text.text = getTypingSpeed().toFixed(2);
            }

            kpm_text.x =
              win_pos.x - kpm_text.width + (keybord_size.width * scale) / 2;
          } else {
            if (keyCode.code === "Escape") {
              gameData.CurrentSceneName = "game_select";
              gameData.EndTime = Date.now();
              resolve();
            }
            if (keyCode.code === "Space") {
              await GM_start(app);
              gameData.IsStarted = true;
              gameData.StartTime = Date.now();
              if (gameData.current_Issue >= gameData.Issues_num) {
                gameData.CurrentSceneName = "result_scene";
                resolve();
              }
              if (gameData.current_Issue + 1 >= gameData.Issues_num) {
                next_text.text = "";
              } else {
                next_text.text =
                  gameData.Issues[gameData.current_Issue + 1].text;
              }
              sentetce_text.text = gameData.Issues[gameData.current_Issue].text;
              sentetce_text.x = win_pos.x - sentetce_text.width / 2;

              alphabet_text.text = getRomanizedTextFromTendency(
                gameData.Conversion,
                gameData.Issues[gameData.current_Issue].romaji,
                gameData.current_inputed
              );
              alphabet_text.x = win_pos.x - alphabet_text.width / 2;
              alphabet_current_text.text = gameData.current_inputed;
              alphabet_current_text.x =
                win_pos.x - alphabet_current_text.width / 2;
              next_text.x = win_pos.x - next_text.width / 2;
              progressDot.x =
                (keybord_size.width / gameData.Issues_num) *
                  scale *
                  gameData.current_Issue +
                (app.screen.width - keybord_size.width * scale) / 2;
              combo_text.text = "";
              combo_text.x = win_pos.x - (keybord_size.width * scale) / 2;
              accuracyLine.clear();
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
              kpm_text.text = "";
              kpm_text.x =
                win_pos.x - kpm_text.width + (keybord_size.width * scale) / 2;
              score_text.text = "";
              score_text.x = win_pos.x - score_text.width / 2;
              frame_anim(9);
              grid_anim(grid);
            }
          }
        } catch (error) {
          gameData.CurrentSceneName = "error_scene";
          gameData.EndTime = Date.now();
          resolve();
        }
      }
    }, 100);
  });
}

function grid_anim(grid: PIXI.Graphics) {
  gsap.fromTo(
    grid,
    { alpha: 2 },
    {
      alpha: 1,
      duration: 4,
      ease: "power1.out",
    }
  );
}

import { Issue } from "./002_gameConfig";
import { playCollect, playMiss } from "./012_soundplay";
async function makeIssues(
  FromLen: number,
  ToLen: number,
  N: number
): Promise<void> {
  return new Promise<void>(async (resolve) => {
    let Issues: Issue[] = [];
    for (let i = 0; i < N + 1; i++) {
      // Choose a random group index between FromLen and ToLen - 1
      const groupIndex =
        FromLen - 1 + Math.floor(Math.random() * (ToLen - FromLen + 1));
      const groupArray = gameData.textsData[groupIndex];
      // Choose a random issue within the group
      const issueIndex = Math.floor(Math.random() * groupArray.length);
      const new_Issue: Issue = groupArray[issueIndex];
      Issues.push(new_Issue);
    }
    gameData.Issues = Issues;
    console.log(gameData.Issues);
    resolve();
  });
}

/*
const example = [
  { text: "レンタルひらがな「ぬ」", hiragana: "れんたるひらがな[ぬ]" },
  { text: "青眼の白龍", hiragana: "ぶる-あいずほわいとどらごん" },
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
*/

function isPerfectSquare(x: number): boolean {
  // Calculate the integer square root and check if its square equals x
  const s = Math.floor(Math.sqrt(x));
  return s * s === x;
}

function isFibonacci(n: number): boolean {
  // Negative numbers are not Fibonacci numbers
  if (n < 0) return false;
  // Check if one of (5*n*n + 4) or (5*n*n - 4) is a perfect square
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}
import { ColorMatrixFilter } from "pixi.js";
function filterflash(app: PIXI.Application) {
  const colorMatrix = new ColorMatrixFilter();
  colorMatrix.negative(true); // Enable negative effect

  // Retrieve the always-on GlowFilter from gameData and add the negative filter on top
  app.stage.filters = [colorMatrix];

  // After 200ms, remove the negative effect while keeping the glow filter active
  setTimeout(() => {
    app.stage.filters = [];
  }, 200);
}
