const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwYvF1tGnTf4dz2_eSeiQVmN7LxgE84n0yPoWEjhxQxC4CWuaS461kFGbHiRESACv8/exec";

// シート "texts" のデータを取得する（GET リクエスト）
export async function fetchTexts(): Promise<any> {
  const response = await fetch(WEB_APP_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  // 返ってくる JSON をパース
  const data = await response.json();
  return data;
}

// シート "play_datas" にデータを書き込む（POST リクエスト）
export async function postPlayData(text: string, number: number): Promise<any> {
  const params = new URLSearchParams();
  params.append("text", text);
  params.append("number", number.toString());

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
/*
// 利用例
(async () => {
  // GET で "texts" のデータを取得
  try {
    const textsData = await fetchTexts();
    console.log("Texts data:", textsData);
  } catch (error) {
    console.error(error);
  }

  // POST で "play_datas" にデータを書き込む
  try {
    const result = await postPlayData("sample text", 123);
    console.log("Post result:", result);
  } catch (error) {
    console.error(error);
  }
})();
*/
