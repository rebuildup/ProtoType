import { saveToCache, loadFromCache } from "../SiteInterface";

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbx727jT1TLHJmBc4ds0vi8-EQzZR27wPzlbk1hYEY_fx-hwu3GvoRYffwlToKVL5D-i/exec";

export async function fetchTexts(): Promise<any> {
  let data_Cache: string[] = loadFromCache<typeof data_Cache>("api_texts", [
    "no_text",
  ]);
  if (data_Cache[0] == "no_text") {
    const response = await fetch(
      WEB_APP_URL +
        "?sheetName=texts&startRow=1&startCol=1&endRow=250&endCol=50"
    );
    console.log(response);
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
