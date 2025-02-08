export function getLatestKey(): Promise<string> {
  return new Promise((resolve) => {
    const handler = (event: KeyboardEvent) => {
      window.removeEventListener("keydown", handler);
      resolve(event.code);
    };
    window.addEventListener("keydown", handler);
  });
}
