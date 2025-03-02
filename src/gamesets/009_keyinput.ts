import { settings } from "../SiteInterface";
import { keyLayouts } from "../components/012_KeyLayout";
import { gameData } from "./002_gameConfig";
export function getLatestKey(
  signal: AbortSignal
): Promise<{ code: string; shift: boolean }> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const handler = (event: KeyboardEvent) => {
      window.removeEventListener("keydown", handler);
      signal.removeEventListener("abort", abortHandler);
      event.preventDefault();
      resolve({
        code: event.code,
        shift: event.shiftKey,
      });
    };
    const abortHandler = () => {
      window.removeEventListener("keydown", handler);
      reject(new DOMException("Aborted", "AbortError"));
    };
    window.addEventListener("keydown", handler);
    signal.addEventListener("abort", abortHandler);
  });
}
export function keyCodeToText(code: string, shift: boolean): string {
  const root_layout = keyLayouts.find(
    (layout) => layout.name === settings.keyLayout
  ) as KeyboardLayout;
  const play_layout = keyLayouts.find(
    (layout) => layout.name === gameData.KeyLayout
  ) as KeyboardLayout;
  let output = "";
  switch (code) {
    case "Digit1":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "1") as string)
        : (mapKey(root_layout, play_layout, "1") as string);
      break;
    case "Digit2":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "2") as string)
        : (mapKey(root_layout, play_layout, "2") as string);
      break;
    case "Digit3":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "3") as string)
        : (mapKey(root_layout, play_layout, "3") as string);
      break;
    case "Digit4":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "4") as string)
        : (mapKey(root_layout, play_layout, "4") as string);
      break;
    case "Digit5":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "5") as string)
        : (mapKey(root_layout, play_layout, "5") as string);
      break;
    case "Digit6":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "6") as string)
        : (mapKey(root_layout, play_layout, "6") as string);
      break;
    case "Digit7":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "7") as string)
        : (mapKey(root_layout, play_layout, "7") as string);
      break;
    case "Digit8":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "8") as string)
        : (mapKey(root_layout, play_layout, "8") as string);
      break;
    case "Digit9":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "9") as string)
        : (mapKey(root_layout, play_layout, "9") as string);
      break;
    case "Digit0":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "0") as string)
        : (mapKey(root_layout, play_layout, "0") as string);
      break;
    case "KeyA":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "a") as string)
        : (mapKey(root_layout, play_layout, "a") as string);
      break;
    case "KeyB":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "b") as string)
        : (mapKey(root_layout, play_layout, "b") as string);
      break;
    case "KeyC":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "c") as string)
        : (mapKey(root_layout, play_layout, "c") as string);
      break;
    case "KeyD":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "d") as string)
        : (mapKey(root_layout, play_layout, "d") as string);
      break;
    case "KeyE":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "e") as string)
        : (mapKey(root_layout, play_layout, "e") as string);
      break;
    case "KeyF":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "f") as string)
        : (mapKey(root_layout, play_layout, "f") as string);
      break;
    case "KeyG":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "g") as string)
        : (mapKey(root_layout, play_layout, "g") as string);
      break;
    case "KeyH":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "h") as string)
        : (mapKey(root_layout, play_layout, "h") as string);
      break;
    case "KeyI":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "i") as string)
        : (mapKey(root_layout, play_layout, "i") as string);
      break;
    case "KeyJ":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "j") as string)
        : (mapKey(root_layout, play_layout, "j") as string);
      break;
    case "KeyK":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "k") as string)
        : (mapKey(root_layout, play_layout, "k") as string);
      break;
    case "KeyL":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "l") as string)
        : (mapKey(root_layout, play_layout, "l") as string);
      break;
    case "KeyM":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "m") as string)
        : (mapKey(root_layout, play_layout, "m") as string);
      break;
    case "KeyN":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "n") as string)
        : (mapKey(root_layout, play_layout, "n") as string);
      break;
    case "KeyO":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "o") as string)
        : (mapKey(root_layout, play_layout, "o") as string);
      break;
    case "KeyP":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "p") as string)
        : (mapKey(root_layout, play_layout, "p") as string);
      break;
    case "KeyQ":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "q") as string)
        : (mapKey(root_layout, play_layout, "q") as string);
      break;
    case "KeyR":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "r") as string)
        : (mapKey(root_layout, play_layout, "r") as string);
      break;
    case "KeyS":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "s") as string)
        : (mapKey(root_layout, play_layout, "s") as string);
      break;
    case "KeyT":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "t") as string)
        : (mapKey(root_layout, play_layout, "t") as string);
      break;
    case "KeyU":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "u") as string)
        : (mapKey(root_layout, play_layout, "u") as string);
      break;
    case "KeyV":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "v") as string)
        : (mapKey(root_layout, play_layout, "v") as string);
      break;
    case "KeyW":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "w") as string)
        : (mapKey(root_layout, play_layout, "w") as string);
      break;
    case "KeyX":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "x") as string)
        : (mapKey(root_layout, play_layout, "x") as string);
      break;
    case "KeyY":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "y") as string)
        : (mapKey(root_layout, play_layout, "y") as string);
      break;
    case "KeyZ":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "z") as string)
        : (mapKey(root_layout, play_layout, "z") as string);
      break;
    case "Comma":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, ",") as string)
        : (mapKey(root_layout, play_layout, ",") as string);
      break;
    case "Period":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, ".") as string)
        : (mapKey(root_layout, play_layout, ".") as string);
      break;
    case "Semicolon":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, ";") as string)
        : (mapKey(root_layout, play_layout, ";") as string);
      break;
    case "Quote":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, ":") as string)
        : (mapKey(root_layout, play_layout, ":") as string);
      break;
    case "BracketLeft":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "@") as string)
        : (mapKey(root_layout, play_layout, "@") as string);
      break;
    case "BracketRight":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "[") as string)
        : (mapKey(root_layout, play_layout, "[") as string);
      break;
    case "Backquote":
      output = mapKey(root_layout, play_layout, "`") as string;
      break;
    case "Backslash":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "]") as string)
        : (mapKey(root_layout, play_layout, "]") as string);
      break;
    case "Slash":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "/") as string)
        : (mapKey(root_layout, play_layout, "/") as string);
      break;
    case "Minus":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "-") as string)
        : (mapKey(root_layout, play_layout, "-") as string);
      break;
    case "Equal":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "^") as string)
        : (mapKey(root_layout, play_layout, "^") as string);
      break;
    case "IntlYen":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "\\") as string, false)
        : (mapKey(root_layout, play_layout, "\\") as string);
      break;
    case "IntlRo":
      output = shift
        ? shift_get(mapKey(root_layout, play_layout, "\\") as string, true)
        : (mapKey(root_layout, play_layout, "\\") as string);
      break;
    case "Space":
      output = " ";
      break;
    case "Numpad0":
      output = "0";
      break;
    case "Numpad1":
      output = "1";
      break;
    case "Numpad2":
      output = "2";
      break;
    case "Numpad3":
      output = "3";
      break;
    case "Numpad4":
      output = "4";
      break;
    case "Numpad5":
      output = "5";
      break;
    case "Numpad6":
      output = "6";
      break;
    case "Numpad7":
      output = "7";
      break;
    case "Numpad8":
      output = "8";
      break;
    case "Numpad9":
      output = "9";
      break;
    case "NumpadComma":
      output = ".";
      break;
    case "NumpadDivide":
      output = "/";
      break;
    case "NumpadMultply":
      output = "*";
      break;
    case "NumpadSubtract":
      output = "-";
      break;
    case "NumpadAdd":
      output = "+";
      break;
    default:
      output = "";
      break;
  }
  return output;
}
function shift_get(input_char: string, backs: boolean = true) {
  switch (input_char) {
    case "1":
      return "!";
      break;
    case "2":
      return '"';
      break;
    case "3":
      return "#";
      break;
    case "4":
      return "$";
      break;
    case "5":
      return "%";
      break;
    case "6":
      return "&";
      break;
    case "7":
      return "'";
      break;
    case "8":
      return "(";
      break;
    case "9":
      return ")";
      break;
    case "0":
      return "";
      break;
    case "a":
      return "A";
      break;
    case "b":
      return "B";
      break;
    case "c":
      return "C";
      break;
    case "d":
      return "D";
      break;
    case "e":
      return "E";
      break;
    case "f":
      return "F";
      break;
    case "g":
      return "G";
      break;
    case "h":
      return "H";
      break;
    case "i":
      return "I";
      break;
    case "j":
      return "J";
      break;
    case "k":
      return "K";
      break;
    case "l":
      return "L";
      break;
    case "m":
      return "M";
      break;
    case "n":
      return "N";
      break;
    case "o":
      return "O";
      break;
    case "p":
      return "P";
      break;
    case "q":
      return "Q";
      break;
    case "r":
      return "R";
      break;
    case "s":
      return "S";
      break;
    case "t":
      return "T";
      break;
    case "u":
      return "U";
      break;
    case "v":
      return "V";
      break;
    case "w":
      return "W";
      break;
    case "x":
      return "X";
      break;
    case "y":
      return "Y";
      break;
    case "z":
      return "Z";
      break;
    case ",":
      return "<";
      break;
    case ".":
      return ">";
      break;
    case ";":
      return "+";
      break;
    case ":":
      return "*";
      break;
    case "@":
      return "`";
      break;
    case "[":
      return "{";
      break;
    case "]":
      return "}";
      break;
    case "/":
      return "?";
      break;
    case "-":
      return "=";
      break;
    case "^":
      return "~";
      break;
    case "\\":
      return backs ? "_" : "|";
      break;
    default:
      return "";
      break;
  }
}
interface KeyboardLayout {
  name: string;
  layout: string[][];
}
function mapKey(
  source: KeyboardLayout,
  target: KeyboardLayout,
  key: string
): string | undefined {
  for (let rowIndex = 0; rowIndex < source.layout.length; rowIndex++) {
    const row = source.layout[rowIndex];
    const colIndex = row.findIndex(
      (item) => item.toLowerCase() === key.toLowerCase()
    );
    if (colIndex !== -1) {
      if (
        target.layout[rowIndex] &&
        target.layout[rowIndex][colIndex] !== undefined
      ) {
        let mappedKey = target.layout[rowIndex][colIndex];
        if (key === key.toLowerCase() && /^[A-Z]$/.test(mappedKey)) {
          mappedKey = mappedKey.toLowerCase();
        }
        return mappedKey;
      }
    }
  }
  return undefined;
}

import { light_key } from "./011_keybord";
import * as PIXI from "pixi.js";
export function light_key_from_code(app: PIXI.Application, code: string) {
  let index = 0;
  const root_layout = keyLayouts.find(
    (layout) => layout.name === settings.keyLayout
  ) as KeyboardLayout;
  const play_layout = keyLayouts.find(
    (layout) => layout.name === "QWERTY"
  ) as KeyboardLayout;
  let output = "";
  switch (code) {
    case "Digit1":
      output = mapKey(root_layout, play_layout, "1") as string;
      break;
    case "Digit2":
      output = mapKey(root_layout, play_layout, "2") as string;
      break;
    case "Digit3":
      output = mapKey(root_layout, play_layout, "3") as string;
      break;
    case "Digit4":
      output = mapKey(root_layout, play_layout, "4") as string;
      break;
    case "Digit5":
      output = mapKey(root_layout, play_layout, "5") as string;
      break;
    case "Digit6":
      output = mapKey(root_layout, play_layout, "6") as string;
      break;
    case "Digit7":
      output = mapKey(root_layout, play_layout, "7") as string;
      break;
    case "Digit8":
      output = mapKey(root_layout, play_layout, "8") as string;
      break;
    case "Digit9":
      output = mapKey(root_layout, play_layout, "9") as string;
      break;
    case "Digit0":
      output = mapKey(root_layout, play_layout, "0") as string;
      break;
    case "KeyA":
      output = mapKey(root_layout, play_layout, "a") as string;
      break;
    case "KeyB":
      output = mapKey(root_layout, play_layout, "b") as string;
      break;
    case "KeyC":
      output = mapKey(root_layout, play_layout, "c") as string;
      break;
    case "KeyD":
      output = mapKey(root_layout, play_layout, "d") as string;
      break;
    case "KeyE":
      output = mapKey(root_layout, play_layout, "e") as string;
      break;
    case "KeyF":
      output = mapKey(root_layout, play_layout, "f") as string;
      break;
    case "KeyG":
      output = mapKey(root_layout, play_layout, "g") as string;
      break;
    case "KeyH":
      output = mapKey(root_layout, play_layout, "h") as string;
      break;
    case "KeyI":
      output = mapKey(root_layout, play_layout, "i") as string;
      break;
    case "KeyJ":
      output = mapKey(root_layout, play_layout, "j") as string;
      break;
    case "KeyK":
      output = mapKey(root_layout, play_layout, "k") as string;
      break;
    case "KeyL":
      output = mapKey(root_layout, play_layout, "l") as string;
      break;
    case "KeyM":
      output = mapKey(root_layout, play_layout, "m") as string;
      break;
    case "KeyN":
      output = mapKey(root_layout, play_layout, "n") as string;
      break;
    case "KeyO":
      output = mapKey(root_layout, play_layout, "o") as string;
      break;
    case "KeyP":
      output = mapKey(root_layout, play_layout, "p") as string;
      break;
    case "KeyQ":
      output = mapKey(root_layout, play_layout, "q") as string;
      break;
    case "KeyR":
      output = mapKey(root_layout, play_layout, "r") as string;
      break;
    case "KeyS":
      output = mapKey(root_layout, play_layout, "s") as string;
      break;
    case "KeyT":
      output = mapKey(root_layout, play_layout, "t") as string;
      break;
    case "KeyU":
      output = mapKey(root_layout, play_layout, "u") as string;
      break;
    case "KeyV":
      output = mapKey(root_layout, play_layout, "v") as string;
      break;
    case "KeyW":
      output = mapKey(root_layout, play_layout, "w") as string;
      break;
    case "KeyX":
      output = mapKey(root_layout, play_layout, "x") as string;
      break;
    case "KeyY":
      output = mapKey(root_layout, play_layout, "y") as string;
      break;
    case "KeyZ":
      output = mapKey(root_layout, play_layout, "z") as string;
      break;
    case "Comma":
      output = mapKey(root_layout, play_layout, ",") as string;
      break;
    case "Period":
      output = mapKey(root_layout, play_layout, ".") as string;
      break;
    case "Semicolon":
      output = mapKey(root_layout, play_layout, ";") as string;
      break;
    case "Quote":
      output = mapKey(root_layout, play_layout, ":") as string;
      break;
    case "BracketLeft":
      output = mapKey(root_layout, play_layout, "@") as string;
      break;
    case "BracketRight":
      output = mapKey(root_layout, play_layout, "[") as string;
      break;
    case "Backquote":
      output = mapKey(root_layout, play_layout, "`") as string;
      break;
    case "Backslash":
      output = mapKey(root_layout, play_layout, "]") as string;
      break;
    case "Slash":
      output = mapKey(root_layout, play_layout, "/") as string;
      break;
    case "Minus":
      output = mapKey(root_layout, play_layout, "-") as string;
      break;
    case "Equal":
      output = mapKey(root_layout, play_layout, "^") as string;
      break;
    case "IntlYen":
      output = mapKey(root_layout, play_layout, "\\") as string;
      break;
    case "IntlRo":
      output = mapKey(root_layout, play_layout, "\\") as string;
      break;
    case "Space":
      output = " ";
      break;
    case "Numpad0":
      output = "0";
      break;
    case "Numpad1":
      output = "1";
      break;
    case "Numpad2":
      output = "2";
      break;
    case "Numpad3":
      output = "3";
      break;
    case "Numpad4":
      output = "4";
      break;
    case "Numpad5":
      output = "5";
      break;
    case "Numpad6":
      output = "6";
      break;
    case "Numpad7":
      output = "7";
      break;
    case "Numpad8":
      output = "8";
      break;
    case "Numpad9":
      output = "9";
      break;
    case "NumpadComma":
      output = ".";
      break;
    case "NumpadDivide":
      output = "/";
      break;
    case "NumpadMultply":
      output = "*";
      break;
    case "NumpadSubtract":
      output = "-";
      break;
    case "NumpadAdd":
      output = "+";
      break;
    default:
      output = "";
      break;
  }
  switch (output) {
    case "1":
      index = 1;
      break;
    case "2":
      index = 2;
      break;
    case "3":
      index = 3;
      break;
    case "4":
      index = 4;
      break;
    case "5":
      index = 5;
      break;
    case "6":
      index = 6;
      break;
    case "7":
      index = 7;
      break;
    case "8":
      index = 8;
      break;
    case "9":
      index = 9;
      break;
    case "0":
      index = 10;
      break;
    case "a":
      index = 30;
      break;
    case "b":
      index = 48;
      break;
    case "c":
      index = 46;
      break;
    case "d":
      index = 32;
      break;
    case "e":
      index = 18;
      break;
    case "f":
      index = 33;
      break;
    case "g":
      index = 34;
      break;
    case "h":
      index = 35;
      break;
    case "i":
      index = 23;
      break;
    case "j":
      index = 36;
      break;
    case "k":
      index = 37;
      break;
    case "l":
      index = 38;
      break;
    case "m":
      index = 50;
      break;
    case "n":
      index = 49;
      break;
    case "o":
      index = 24;
      break;
    case "p":
      index = 25;
      break;
    case "q":
      index = 16;
      break;
    case "r":
      index = 19;
      break;
    case "s":
      index = 31;
      break;
    case "t":
      index = 20;
      break;
    case "u":
      index = 22;
      break;
    case "v":
      index = 47;
      break;
    case "w":
      index = 17;
      break;
    case "x":
      index = 45;
      break;
    case "y":
      index = 21;
      break;
    case "z":
      index = 44;
      break;
    case ",":
      index = 51;
      break;
    case ".":
      index = 52;
      break;
    case ";":
      index = 39;
      break;
    case ":":
      index = 40;
      break;
    case "@":
      index = 26;
      break;
    case "[":
      index = 27;
      break;
    case "`":
      index = 15;
      break;
    case "]":
      index = 41;
      break;
    case "/":
      index = 53;
      break;
    case "-":
      index = 11;
      break;
    case "^":
      index = 12;
      break;
    case "\\":
      if (code == "IntlYen") index = 13;
      else index = 54;

      break;
    case " ":
      index = 60;
      break;
    default:
      index = 28;
      break;
  }
  light_key(app, index);
}

import { update_Acc_key } from "./011_keybord";

export function acc_key_from_code(
  app: PIXI.Application,
  code: string,
  set: boolean
) {
  let index = 0;
  const root_layout = keyLayouts.find(
    (layout) => layout.name === gameData.KeyLayout
  ) as KeyboardLayout;
  const play_layout = keyLayouts.find(
    (layout) => layout.name === "QWERTY"
  ) as KeyboardLayout;
  let output = "";
  switch (code) {
    case "1":
      output = mapKey(root_layout, play_layout, "1") as string;
      break;
    case "!":
      output = mapKey(root_layout, play_layout, "1") as string;
      break;
    case "2":
      output = mapKey(root_layout, play_layout, "2") as string;
      break;
    case '"':
      output = mapKey(root_layout, play_layout, "2") as string;
      break;
    case "3":
      output = mapKey(root_layout, play_layout, "3") as string;
      break;
    case "#":
      output = mapKey(root_layout, play_layout, "3") as string;
      break;
    case "4":
      output = mapKey(root_layout, play_layout, "4") as string;
      break;
    case "$":
      output = mapKey(root_layout, play_layout, "4") as string;
      break;
    case "5":
      output = mapKey(root_layout, play_layout, "5") as string;
      break;
    case "%":
      output = mapKey(root_layout, play_layout, "5") as string;
      break;
    case "6":
      output = mapKey(root_layout, play_layout, "6") as string;
      break;
    case "&":
      output = mapKey(root_layout, play_layout, "6") as string;
      break;
    case "7":
      output = mapKey(root_layout, play_layout, "7") as string;
      break;
    case "'":
      output = mapKey(root_layout, play_layout, "7") as string;
      break;
    case "8":
      output = mapKey(root_layout, play_layout, "8") as string;
      break;
    case "(":
      output = mapKey(root_layout, play_layout, "8") as string;
      break;
    case "9":
      output = mapKey(root_layout, play_layout, "9") as string;
      break;
    case ")":
      output = mapKey(root_layout, play_layout, "9") as string;
      break;
    case "0":
      output = mapKey(root_layout, play_layout, "0") as string;
      break;
    case "a":
      output = mapKey(root_layout, play_layout, "a") as string;
      break;
    case "A":
      output = mapKey(root_layout, play_layout, "a") as string;
      break;
    case "b":
      output = mapKey(root_layout, play_layout, "b") as string;
      break;
    case "B":
      output = mapKey(root_layout, play_layout, "b") as string;
      break;
    case "c":
      output = mapKey(root_layout, play_layout, "c") as string;
      break;
    case "C":
      output = mapKey(root_layout, play_layout, "c") as string;
      break;
    case "D":
      output = mapKey(root_layout, play_layout, "d") as string;
      break;
    case "d":
      output = mapKey(root_layout, play_layout, "d") as string;
      break;
    case "e":
      output = mapKey(root_layout, play_layout, "e") as string;
      break;
    case "E":
      output = mapKey(root_layout, play_layout, "e") as string;
      break;
    case "f":
      output = mapKey(root_layout, play_layout, "f") as string;
      break;
    case "F":
      output = mapKey(root_layout, play_layout, "f") as string;
      break;
    case "g":
      output = mapKey(root_layout, play_layout, "g") as string;
      break;
    case "G":
      output = mapKey(root_layout, play_layout, "g") as string;
      break;
    case "h":
      output = mapKey(root_layout, play_layout, "h") as string;
      break;
    case "H":
      output = mapKey(root_layout, play_layout, "h") as string;
      break;
    case "i":
      output = mapKey(root_layout, play_layout, "i") as string;
      break;
    case "I":
      output = mapKey(root_layout, play_layout, "i") as string;
      break;
    case "j":
      output = mapKey(root_layout, play_layout, "j") as string;
      break;
    case "J":
      output = mapKey(root_layout, play_layout, "j") as string;
      break;
    case "k":
      output = mapKey(root_layout, play_layout, "k") as string;
      break;
    case "K":
      output = mapKey(root_layout, play_layout, "k") as string;
      break;
    case "l":
      output = mapKey(root_layout, play_layout, "l") as string;
      break;
    case "L":
      output = mapKey(root_layout, play_layout, "l") as string;
      break;
    case "m":
      output = mapKey(root_layout, play_layout, "m") as string;
      break;
    case "M":
      output = mapKey(root_layout, play_layout, "m") as string;
      break;
    case "n":
      output = mapKey(root_layout, play_layout, "n") as string;
      break;
    case "N":
      output = mapKey(root_layout, play_layout, "n") as string;
      break;
    case "o":
      output = mapKey(root_layout, play_layout, "o") as string;
      break;
    case "O":
      output = mapKey(root_layout, play_layout, "o") as string;
      break;
    case "p":
      output = mapKey(root_layout, play_layout, "p") as string;
      break;
    case "P":
      output = mapKey(root_layout, play_layout, "p") as string;
      break;
    case "q":
      output = mapKey(root_layout, play_layout, "q") as string;
      break;
    case "Q":
      output = mapKey(root_layout, play_layout, "q") as string;
      break;
    case "r":
      output = mapKey(root_layout, play_layout, "r") as string;
      break;
    case "R":
      output = mapKey(root_layout, play_layout, "r") as string;
      break;
    case "s":
      output = mapKey(root_layout, play_layout, "s") as string;
      break;
    case "S":
      output = mapKey(root_layout, play_layout, "s") as string;
      break;
    case "t":
      output = mapKey(root_layout, play_layout, "t") as string;
      break;
    case "T":
      output = mapKey(root_layout, play_layout, "t") as string;
      break;
    case "u":
      output = mapKey(root_layout, play_layout, "u") as string;
      break;
    case "U":
      output = mapKey(root_layout, play_layout, "u") as string;
      break;
    case "v":
      output = mapKey(root_layout, play_layout, "v") as string;
      break;
    case "V":
      output = mapKey(root_layout, play_layout, "v") as string;
      break;
    case "w":
      output = mapKey(root_layout, play_layout, "w") as string;
      break;
    case "W":
      output = mapKey(root_layout, play_layout, "w") as string;
      break;
    case "x":
      output = mapKey(root_layout, play_layout, "x") as string;
      break;
    case "X":
      output = mapKey(root_layout, play_layout, "x") as string;
      break;
    case "y":
      output = mapKey(root_layout, play_layout, "y") as string;
      break;
    case "Y":
      output = mapKey(root_layout, play_layout, "y") as string;
      break;
    case "z":
      output = mapKey(root_layout, play_layout, "z") as string;
      break;
    case "Z":
      output = mapKey(root_layout, play_layout, "z") as string;
      break;
    case ",":
      output = mapKey(root_layout, play_layout, ",") as string;
      break;
    case "<":
      output = mapKey(root_layout, play_layout, ",") as string;
      break;
    case ".":
      output = mapKey(root_layout, play_layout, ".") as string;
      break;
    case ">":
      output = mapKey(root_layout, play_layout, ".") as string;
      break;
    case ";":
      output = mapKey(root_layout, play_layout, ";") as string;
      break;
    case "+":
      output = mapKey(root_layout, play_layout, ";") as string;
      break;
    case ":":
      output = mapKey(root_layout, play_layout, ":") as string;
      break;
    case "*":
      output = mapKey(root_layout, play_layout, ":") as string;
      break;
    case "@":
      output = mapKey(root_layout, play_layout, "@") as string;
      break;
    case "`":
      output = mapKey(root_layout, play_layout, "@") as string;
      break;
    case "[":
      output = mapKey(root_layout, play_layout, "[") as string;
      break;
    case "{":
      output = mapKey(root_layout, play_layout, "[") as string;
      break;
    case "]":
      output = mapKey(root_layout, play_layout, "]") as string;
      break;
    case "}":
      output = mapKey(root_layout, play_layout, "]") as string;
      break;
    case "/":
      output = mapKey(root_layout, play_layout, "/") as string;
      break;
    case "-":
      output = mapKey(root_layout, play_layout, "-") as string;
      break;
    case "^":
      output = mapKey(root_layout, play_layout, "^") as string;
      break;
    case "|":
      output = mapKey(root_layout, play_layout, "\\") as string;
      break;
    case "_":
      output = mapKey(root_layout, play_layout, "\\") as string;
      break;
    case " ":
      output = " ";
      break;
    default:
      output = code;
      break;
  }
  switch (output) {
    case "1":
      index = 1;
      break;
    case "2":
      index = 2;
      break;
    case "3":
      index = 3;
      break;
    case "4":
      index = 4;
      break;
    case "5":
      index = 5;
      break;
    case "6":
      index = 6;
      break;
    case "7":
      index = 7;
      break;
    case "8":
      index = 8;
      break;
    case "9":
      index = 9;
      break;
    case "0":
      index = 10;
      break;
    case "a":
      index = 30;
      break;
    case "b":
      index = 48;
      break;
    case "c":
      index = 46;
      break;
    case "d":
      index = 32;
      break;
    case "e":
      index = 18;
      break;
    case "f":
      index = 33;
      break;
    case "g":
      index = 34;
      break;
    case "h":
      index = 35;
      break;
    case "i":
      index = 23;
      break;
    case "j":
      index = 36;
      break;
    case "k":
      index = 37;
      break;
    case "l":
      index = 38;
      break;
    case "m":
      index = 50;
      break;
    case "n":
      index = 49;
      break;
    case "o":
      index = 24;
      break;
    case "p":
      index = 25;
      break;
    case "q":
      index = 16;
      break;
    case "r":
      index = 19;
      break;
    case "s":
      index = 31;
      break;
    case "t":
      index = 20;
      break;
    case "u":
      index = 22;
      break;
    case "v":
      index = 47;
      break;
    case "w":
      index = 17;
      break;
    case "x":
      index = 45;
      break;
    case "y":
      index = 21;
      break;
    case "z":
      index = 44;
      break;
    case ",":
      index = 51;
      break;
    case ".":
      index = 52;
      break;
    case ";":
      index = 39;
      break;
    case ":":
      index = 40;
      break;
    case "@":
      index = 26;
      break;
    case "[":
      index = 27;
      break;
    case "`":
      index = 15;
      break;
    case "]":
      index = 41;
      break;
    case "/":
      index = 53;
      break;
    case "-":
      index = 11;
      break;
    case "^":
      index = 12;
      break;
    case "?":
      index = 53;
      break;
    case "\\":
      if (code == "IntlYen") index = 13;
      else index = 54;

      break;
    case " ":
      index = 60;
      break;
    default:
      index = 28;
      break;
  }
  if (set) {
    if (!gameData.acc_keys.includes(index)) {
      gameData.acc_keys.push(index);
    }
  } else {
    if (gameData.acc_keys.includes(index)) {
      gameData.acc_keys = gameData.acc_keys.filter((key) => key !== index);
    }
  }
  update_Acc_key(app);
}

export function isNomalKey(code: string) {
  let output = false;
  const Nomalkeys = [
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "KeyA",
    "KeyB",
    "KeyC",
    "KeyD",
    "KeyE",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyM",
    "KeyN",
    "KeyO",
    "KeyP",
    "KeyQ",
    "KeyR",
    "KeyS",
    "KeyT",
    "KeyU",
    "KeyV",
    "KeyW",
    "KeyX",
    "KeyY",
    "KeyZ",
    "Comma",
    "Period",
    "Semicolon",
    "Quote",
    "BracketLeft",
    "BracketRight",
    "Backquote",
    "Backslash",
    "Slash",
    "Minus",
    "Equal",
    "IntlYen",
    "IntlRo",
    "Space",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "NumpadComma",
    "NumpadDivide",
    "NumpadMultply",
    "NumpadSubtract",
    "NumpadAdd",
  ];
  for (let i = 0; i < Nomalkeys.length; i++) {
    if (code == Nomalkeys[i]) output = true;
  }
  return output;
}
