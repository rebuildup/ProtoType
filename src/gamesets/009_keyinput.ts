//import { settings } from "../SiteInterface";
//import { keyLayouts } from "../components/012_KeyLayout";
//import { gameData } from "./002_gameConfig";
export function getLatestKey(): Promise<{ code: string; shift: boolean }> {
  return new Promise((resolve) => {
    const handler = (event: KeyboardEvent) => {
      window.removeEventListener("keydown", handler);
      //console.log(event.code);
      resolve({
        code: event.code,
        shift: event.shiftKey,
      });
    };
    window.addEventListener("keydown", handler);
  });
}
export function keyCodeToText(code: string, shift: boolean): string {
  //let imported_layout = {};
  let output = "";
  /*
  for (let i = 0; i < keyLayouts.length; i++) {
    if (settings.keyLayout == keyLayouts[i].name)
      imported_layout = keyLayouts[i];
  }
*/
  switch (code) {
    case "Digit1":
      output = shift ? "!" : "1";
      break;
    case "Digit2":
      output = shift ? '"' : "2";
      break;
    case "Digit3":
      output = shift ? "#" : "3";
      break;
    case "Digit4":
      output = shift ? "$" : "4";
      break;
    case "Digit5":
      output = shift ? "%" : "5";
      break;
    case "Digit6":
      output = shift ? "&" : "6";
      break;
    case "Digit7":
      output = shift ? "'" : "7";
      break;
    case "Digit8":
      output = shift ? "(" : "8";
      break;
    case "Digit9":
      output = shift ? ")" : "9";
      break;
    case "Digit0":
      output = shift ? "" : "0";
      break;
    case "KeyA":
      output = shift ? "A" : "a";
      break;
    case "KeyB":
      output = shift ? "B" : "b";
      break;
    case "KeyC":
      output = shift ? "C" : "c";
      break;
    case "KeyD":
      output = shift ? "D" : "d";
      break;
    case "KeyE":
      output = shift ? "E" : "e";
      break;
    case "KeyF":
      output = shift ? "F" : "f";
      break;
    case "KeyG":
      output = shift ? "G" : "g";
      break;
    case "KeyH":
      output = shift ? "H" : "h";
      break;
    case "KeyI":
      output = shift ? "I" : "i";
      break;
    case "KeyJ":
      output = shift ? "J" : "j";
      break;
    case "KeyK":
      output = shift ? "K" : "k";
      break;
    case "KeyL":
      output = shift ? "L" : "l";
      break;
    case "KeyM":
      output = shift ? "M" : "m";
      break;
    case "KeyN":
      output = shift ? "N" : "n";
      break;
    case "KeyO":
      output = shift ? "O" : "o";
      break;
    case "KeyP":
      output = shift ? "P" : "p";
      break;
    case "KeyQ":
      output = shift ? "Q" : "q";
      break;
    case "KeyR":
      output = shift ? "R" : "r";
      break;
    case "KeyS":
      output = shift ? "S" : "s";
      break;
    case "KeyT":
      output = shift ? "T" : "t";
      break;
    case "KeyU":
      output = shift ? "U" : "u";
      break;
    case "KeyV":
      output = shift ? "V" : "v";
      break;
    case "KeyW":
      output = shift ? "W" : "w";
      break;
    case "KeyX":
      output = shift ? "X" : "x";
      break;
    case "KeyY":
      output = shift ? "Y" : "y";
      break;
    case "KeyZ":
      output = shift ? "Z" : "z";
      break;
    case "Comma":
      output = shift ? "*" : ":";
      break;
    case "Period":
      output = shift ? ">" : ".";
      break;
    case "Semicolon":
      output = shift ? "+" : ";";
      break;
    case "Quote":
      output = shift ? "*" : ":";
      break;
    case "BracketLeft":
      output = shift ? "`" : "@";
      break;
    case "BracketRight":
      output = shift ? "{" : "[";
      break;
    case "Backquote":
      output = "`";
      break;
    case "Backslash":
      output = shift ? "}" : "]";
      break;
    case "Slash":
      output = shift ? "?" : "/";
      break;
    case "Minus":
      output = shift ? "=" : "-";
      break;
    case "Equal":
      output = shift ? "~" : "^";
      break;
    case "IntlYen":
      output = shift ? "|" : "\\";
      break;
    case "IntlRo":
      output = shift ? "_" : "\\";
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
/*
// Usage example with the getLatestKey function:
async function handleKeyPress() {
  const { code, shift } = await getLatestKey();
  const text = keyCodeToText(code, shift);
  console.log(`Key pressed: ${text}`);
}
*/
