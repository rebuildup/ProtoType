export function getLatestKey(): Promise<{ code: string; shift: boolean }> {
  return new Promise((resolve) => {
    const handler = (event: KeyboardEvent) => {
      window.removeEventListener("keydown", handler);
      resolve({
        code: event.code,
        shift: event.shiftKey,
      });
    };
    window.addEventListener("keydown", handler);
  });
}
export function keyCodeToText(code: string, shift: boolean): string {
  // Handle letter keys
  if (code.startsWith("Key")) {
    const letter = code.slice(3);
    return shift ? letter : letter.toLowerCase();
  }

  // Handle digit keys
  if (code.startsWith("Digit")) {
    const digit = code.slice(5);
    const shiftMap: { [key: string]: string } = {
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
    };
    return shift ? shiftMap[digit] : digit;
  }

  // Handle numpad keys
  if (code.startsWith("Numpad")) {
    const numpadChar = code.slice(6);
    switch (numpadChar) {
      case "Add":
        return "+";
      case "Subtract":
        return "-";
      case "Multiply":
        return "*";
      case "Divide":
        return "/";
      case "Decimal":
        return ".";
      default:
        return numpadChar;
    }
  }

  // Handle special characters
  const specialKeyMap: { [key: string]: { normal: string; shifted: string } } =
    {
      Minus: { normal: "-", shifted: "_" },
      Equal: { normal: "=", shifted: "+" },
      BracketLeft: { normal: "[", shifted: "{" },
      BracketRight: { normal: "]", shifted: "}" },
      Backslash: { normal: "\\", shifted: "|" },
      Semicolon: { normal: ";", shifted: ":" },
      Quote: { normal: "'", shifted: '"' },
      Comma: { normal: ",", shifted: "<" },
      Period: { normal: ".", shifted: ">" },
      Slash: { normal: "/", shifted: "?" },
      Backquote: { normal: "`", shifted: "~" },
      Space: { normal: " ", shifted: " " },
    };

  if (code in specialKeyMap) {
    return shift ? specialKeyMap[code].shifted : specialKeyMap[code].normal;
  }

  // Return empty string for special keys or unhandled cases
  return "";
}
/*
// Usage example with the getLatestKey function:
async function handleKeyPress() {
  const { code, shift } = await getLatestKey();
  const text = keyCodeToText(code, shift);
  console.log(`Key pressed: ${text}`);
}
*/
