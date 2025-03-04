import { saveToCache, loadFromCache } from "../SiteInterface";

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwS5vEMAG21Vc83jLPV8GOEm2JYEVVl3DVROXKOvJaGv3E1kkbLxFtRcNzUo64ipuvV/exec";

export async function fetchTexts(): Promise<any> {
  let data_Cache: string[] = loadFromCache<typeof data_Cache>("api_texts", [
    "no_text",
  ]);
  if (data_Cache[0] == "no_text") {
    const response = await fetch(WEB_APP_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    saveToCache("api_texts", data);
    return data;
  } else {
    return data_Cache;
  }
}
export async function postPlayData(
  playerId: string | number,
  playerName: string,
  score: number,
  accuracy: number,
  avgKpm: number,
  maxKpm: number
): Promise<any> {
  const params = new URLSearchParams();
  // パラメータ名を正確に指定する
  params.append("playerId", playerId.toString());
  params.append("playerName", playerName);
  params.append("score", score.toString());
  params.append("accuracy", accuracy.toString());
  params.append("avgKpm", avgKpm.toString());
  params.append("maxKpm", maxKpm.toString());

  const response = await fetch(WEB_APP_URL, {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
}
//postPlayData(id,name,score,accuracy,avgkpm,maxkpm)
