// game_master.ts
import * as PIXI from "pixi.js";
import { getProp } from "../gamesets/gameConfig";
import { Keyboard } from "../gamesets/keybord";
import { settings } from "../SiteInterface";

import useSound from "use-sound";

import Sound from "../assets/SE/collect.wav";

export function initializeGame(app: PIXI.Application) {
  const sentetce_text = new PIXI.Text({
    text: "構想は練った...後は作るだけ",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  sentetce_text.x = app.screen.width / 2 - sentetce_text.width / 2;
  sentetce_text.y = 150;
  app.stage.addChild(sentetce_text);
  const alphabet_text = new PIXI.Text({
    text: "kousouhanetta...atohatukurudake",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  alphabet_text.x = app.screen.width / 2 - alphabet_text.width / 2;
  alphabet_text.y = 180;
  app.stage.addChild(alphabet_text);
  const next_text = new PIXI.Text({
    text: "昨年はゲーム部門1位でした",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 16,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  next_text.x = app.screen.width / 2 - next_text.width / 2;
  next_text.y = 230;
  app.stage.addChild(next_text);

  const score_text = new PIXI.Text({
    text: "30000",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  score_text.x = app.screen.width / 2 - score_text.width / 2;
  score_text.y = 10;
  app.stage.addChild(score_text);

  const combo_text = new PIXI.Text({
    text: "30",
    style: {
      fontFamily: getProp("FontFamily"),
      fontSize: 24,
      fill: replaceHash(settings.colorTheme.colors.MainColor),
      align: "center",
    },
  });
  combo_text.x = app.screen.width / 2 - combo_text.width / 2;
  combo_text.y = 300;
  app.stage.addChild(combo_text);

  const accuracyLine = new PIXI.Graphics();
  accuracyLine.moveTo(50, 50);
  accuracyLine.lineTo(app.screen.width - 50, 50);
  accuracyLine.stroke({
    width: 2,
    color: replaceHash(settings.colorTheme.colors.MainColor),
    alpha: 1,
  });
  app.stage.addChild(accuracyLine);
  const progressLine = new PIXI.Graphics();
  progressLine.moveTo(50, 280);
  progressLine.lineTo(app.screen.width - 50, 280);
  progressLine.stroke({
    width: 2,
    color: replaceHash(settings.colorTheme.colors.MainColor),
    alpha: 1,
  });
  app.stage.addChild(progressLine);
  const progressDot = new PIXI.Graphics();

  progressDot.circle(100, 280, 1);
  progressDot.stroke({
    width: 8,
    color: replaceHash(settings.colorTheme.colors.MainColor),
  });
  app.stage.addChild(progressDot);
  Keyboard(app);
  playAudio(Sound);
  keyInputLoop();
}
export function replaceHash(color: string): string {
  if (typeof color !== "string") return "";
  return color.startsWith("#") ? color.replace("#", "0x") : color;
}

function playAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);

    // When the audio can be played, start playing it and resolve the promise immediately
    audio.oncanplaythrough = () => {
      audio
        .play()
        .then(() => {
          // Resolve immediately after starting playback so overlapping is possible
          resolve();
        })
        .catch(reject);
    };

    audio.onerror = () => reject(new Error("Failed to load audio"));
  });
}
const keyQueue: string[] = [];

// Persistent keydown listener to capture key presses
window.addEventListener("keydown", (event: KeyboardEvent) => {
  // Prevent default behavior for specific special keys
  if (["Control", "Tab", "Shift", "Alt", "Meta"].includes(event.key)) {
    event.preventDefault();
  }
  // Only push non-repeated keydown events into the queue
  if (!event.repeat) {
    keyQueue.push(event.key);
  }
});

// Function that returns a Promise resolving with the next key input (from keydown)
function waitForKeyInput(): Promise<string> {
  return new Promise((resolve) => {
    // Poll the keyQueue every 10ms for a new input
    const interval = setInterval(() => {
      if (keyQueue.length > 0) {
        clearInterval(interval);
        resolve(keyQueue.shift()!);
      }
    }, 500);
  });
}

// Asynchronous loop to continuously process key inputs
async function keyInputLoop(): Promise<void> {
  while (true) {
    const key = await waitForKeyInput();
    console.log(key);
    playAudio(Sound);
    // Additional processing for the key input can be done here
  }
}

// Start the key input loop
