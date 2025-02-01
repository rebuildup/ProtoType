import collect_Sound from "../assets/SE/collect.wav";
import miss_Sound from "../assets/SE/miss.wav";

export function playAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);

    audio.oncanplaythrough = () => {
      audio
        .play()
        .then(() => {
          resolve();
        })
        .catch(reject);
    };

    audio.onerror = () => reject(new Error("Failed to load audio"));
  });
}
export function playCollect() {
  playAudio(collect_Sound);
}

export function playMiss() {
  playAudio(miss_Sound);
}
