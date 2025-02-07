export function getLatestKey(): Promise<string> {
  return new Promise((resolve) => {
    const handler = (event: KeyboardEvent) => {
      window.removeEventListener("keydown", handler);
      resolve(event.code);
    };
    window.addEventListener("keydown", handler);
  });
}
/*
async function keyLogger() {
  while (true) {
    const keyCode = await getLatestKey();
    console.log(`Pressed: ${keyCode}`);

    if (keyCode === "Escape") {
      console.log("終了します");
      break;
    }
  }
}
keyLogger();
*/
