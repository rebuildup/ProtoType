type RomajiMap = { [key: string]: string[] };

// 拡張したローマ字変換マップ
const ROMAJI_MAP: RomajiMap = {
  あ: ["a"],
  い: ["i"],
  う: ["u"],
  え: ["e"],
  お: ["o"],
  か: ["ka", "ca"],
  き: ["ki"],
  く: ["ku", "cu"],
  け: ["ke"],
  こ: ["ko", "co"],
  さ: ["sa"],
  し: ["shi", "si"],
  す: ["su"],
  せ: ["se"],
  そ: ["so"],
  た: ["ta"],
  ち: ["chi", "ti"],
  つ: ["tsu", "tu"],
  て: ["te"],
  と: ["to"],
  な: ["na"],
  に: ["ni"],
  ぬ: ["nu"],
  ね: ["ne"],
  の: ["no"],
  は: ["ha"],
  ひ: ["hi"],
  ふ: ["fu", "hu"],
  へ: ["he"],
  ほ: ["ho"],
  ま: ["ma"],
  み: ["mi"],
  む: ["mu"],
  め: ["me"],
  も: ["mo"],
  や: ["ya"],
  ゆ: ["yu"],
  よ: ["yo"],
  ら: ["ra"],
  り: ["ri"],
  る: ["ru"],
  れ: ["re"],
  ろ: ["ro"],
  わ: ["wa"],
  を: ["wo"],
  ん: ["n", "nn"],
  が: ["ga"],
  ぎ: ["gi"],
  ぐ: ["gu"],
  げ: ["ge"],
  ご: ["go"],
  ざ: ["za"],
  じ: ["ji", "zi"],
  ず: ["zu"],
  ぜ: ["ze"],
  ぞ: ["zo"],
  だ: ["da"],
  ぢ: ["ji", "di"],
  づ: ["zu", "du"],
  で: ["de"],
  ど: ["do"],
  ば: ["ba"],
  び: ["bi"],
  ぶ: ["bu"],
  べ: ["be"],
  ぼ: ["bo"],
  ぱ: ["pa"],
  ぴ: ["pi"],
  ぷ: ["pu"],
  ぺ: ["pe"],
  ぽ: ["po"],

  // 拗音
  ゃ: ["xya"],
  ゅ: ["xyu"],
  ょ: ["xyo"],
  きゃ: ["kya"],
  きゅ: ["kyu"],
  きょ: ["kyo"],
  しゃ: ["sha", "sya"],
  しゅ: ["shu", "syu"],
  しょ: ["sho", "syo"],
  ちゃ: ["cha", "tya"],
  ちゅ: ["chu", "tyu"],
  ちょ: ["cho", "tyo"],
  にゃ: ["nya"],
  にゅ: ["nyu"],
  にょ: ["nyo"],
  ひゃ: ["hya"],
  ひゅ: ["hyu"],
  ひょ: ["hyo"],
  みゃ: ["mya"],
  みゅ: ["myu"],
  みょ: ["myo"],
  りゃ: ["rya"],
  りゅ: ["ryu"],
  りょ: ["ryo"],
  ぎゃ: ["gya"],
  ぎゅ: ["gyu"],
  ぎょ: ["gyo"],
  じゃ: ["ja", "zya"],
  じゅ: ["ju", "zyu"],
  じょ: ["jo", "zyo"],
  びゃ: ["bya"],
  びゅ: ["byu"],
  びょ: ["byo"],
  ぴゃ: ["pya"],
  ぴゅ: ["pyu"],
  ぴょ: ["pyo"],

  // 特殊音節
  ふぁ: ["fa"],
  ふぃ: ["fi"],
  ふぇ: ["fe"],
  ふぉ: ["fo"],
  つぁ: ["tsa"],
  つぃ: ["tsi"],
  つぇ: ["tse"],
  つぉ: ["tso"],
  てぃ: ["ti"],
  でぃ: ["di"],
  てゅ: ["tyu"],
  でゅ: ["dyu"],
  っ: [""],
};

const SMALL_TSU = "っ";

// 文字列を可能な全ての分割パターンで分割
function getAllPossibleSplits(hiragana: string): string[][] {
  const memo = new Map<number, string[][]>();

  function helper(start: number): string[][] {
    if (start >= hiragana.length) return [[]];
    if (memo.has(start)) return memo.get(start)!;

    const results: string[][] = [];

    // 3文字、2文字、1文字の順で試す
    for (let len = 3; len >= 1; len--) {
      const end = start + len;
      if (end > hiragana.length) continue;

      const current = hiragana.slice(start, end);
      if (ROMAJI_MAP[current] || current === SMALL_TSU) {
        const remaining = helper(end);
        for (const split of remaining) {
          results.push([current, ...split]);
        }
      }
    }

    memo.set(start, results);
    return results;
  }

  return helper(0);
}

// 促音処理を考慮してローマ字変換
function processSmallTsu(splits: string[][]): string[][] {
  return splits.map((split) => {
    const processed: string[] = [];
    for (let i = 0; i < split.length; i++) {
      const current = split[i];
      if (current === SMALL_TSU && i + 1 < split.length) {
        const next = split[i + 1];
        const options = ROMAJI_MAP[next] || [next];
        const consonants = options.map((opt) => {
          const firstConsonant = opt.match(/^([^aeiou]*)/i)?.[0] || "";
          return firstConsonant.repeat(2);
        });
        processed.push(...consonants);
        i++; // 次の文字をスキップ
      } else {
        processed.push(current);
      }
    }
    return processed;
  });
}

// 全ての組み合わせを生成
function generateAllCombinations(parts: string[][]): string[] {
  return parts.reduce<string[]>(
    (acc, current) =>
      acc.length === 0
        ? current
        : acc.flatMap((a) => current.map((c) => a + c)),
    []
  );
}

function getRomajiCombinations(hiragana: string): string[] {
  const splits = getAllPossibleSplits(hiragana);
  const processedSplits = processSmallTsu(splits);

  const allCombinations = new Set<string>();

  for (const split of processedSplits) {
    const partsOptions = split.map((part) =>
      part === SMALL_TSU ? [""] : ROMAJI_MAP[part] || [part]
    );

    generateAllCombinations(partsOptions).forEach((c) =>
      allCombinations.add(c)
    );
  }

  return Array.from(allCombinations);
}

// 統合処理関数
export function generateRomanji(input: string, flags: string): string[] {
  const [japaneseParts] = splitByFlag(input, flags);
  let results: string[] = [""];

  for (const part of japaneseParts) {
    if (!part) continue;
    const combinations = getRomajiCombinations(part);
    results = results.flatMap((r) => combinations.map((c) => r + c));
  }

  return results;
}
function splitByFlag(input: string, flags: string): string[][] {
  const japaneseParts: string[] = [];
  let currentJapanesePart = "";

  for (let i = 0; i < input.length; i++) {
    if (flags[i] === "j") {
      currentJapanesePart += input[i];
    } else {
      if (currentJapanesePart) {
        japaneseParts.push(currentJapanesePart);
        currentJapanesePart = "";
      }
      japaneseParts.push(input[i]); // Treat non-japanese characters as individual parts.  Alternatively, could group consecutive 'e' chars too if needed.
    }
  }
  if (currentJapanesePart) {
    japaneseParts.push(currentJapanesePart);
  }
  return [japaneseParts]; // Return as array of arrays to match original generateRomanji structure.
}
// 使用例
console.log(generateRomanji("じゃ", "jj"));
// 出力: ['ja', 'zya', 'jixya', 'zixya']
//例えば入力が「こじまapple?,jjjeeeeee」だった場合は「kozimaapple?,kojimaapple?,cozimaapple?,cojimaapple?」の入った配列を返すような動作です
//じゃ 「zya,ja,zixya,jixya」
/*

typescriptで文字列の入力から全てのローマ字パターンを返す関数を考えてください
まずひらがなと英語や記号混じった文字列から日本語の文字を"j"、日本語以外の文字を"e"に変換した文字列を取得します
次に「ひらがな/英文字/数字/記号が混ざった文字列」と「日本語ならj/日本語以外ならeになった入力と同じ長さの文字列」で出力が「入力の文字列をローマ字にした場合の全ての文字列のパターンが入った配列」になるようにしてください。
子音を２つ続けた後に母音を入力すれば"っ◯"になるパターンや"cha","cya","tsa"などの特別な入力など
windowsとmac両方で入力できる本当に全てのパターンに対応するようにしてください
例
入力「こじまapple?」出力「kozimaapple?,kojimaapple?,cozimaapple?,cojimaapple?」
入力「ちゅっぱちゃっぷす」出力「chultupachaltupusu,chultupachaxtupusu,chultupachaltsupusu,chultupatyaltupusu,chultupatyaxtupusu,chultupatyaltsupusu,chultupatixyaltupusu,chultupatixyaxtupusu,chultupatixyaltsupusu,chultupatilyaltupusu,chultupatilyaxtupusu,chultupatilyaltsupusu,chultupacyaltupusu,chultupacyaxtupusu,chultupacyaltsupusu,chuxtupachaltupusu,chuxtupachaxtupusu,chuxtupachaltsupusu,chuxtupatyaltupusu,chuxtupatyaxtupusu,chuxtupatyaltsupusu,chuxtupatixyaltupusu,chuxtupatixyaxtupusu,chuxtupatixyaltsupusu,chuxtupatilyaltupusu,chuxtupatilyaxtupusu,chuxtupatilyaltsupusu,chuxtupacyaltupusu,chuxtupacyaxtupusu,chuxtupacyaltsupusu,chultsupachaltupusu,chultsupachaxtupusu,chultsupachaltsupusu,chultsupatyaltupusu,chultsupatyaxtupusu,chultsupatyaltsupusu,chultsupatixyaltupusu,chultsupatixyaxtupusu,chultsupatixyaltsupusu,chultsupatilyaltupusu,chultsupatilyaxtupusu,chultsupatilyaltsupusu,chultsupacyaltupusu,chultsupacyaxtupusu,chultsupacyaltsupusu,tyultupachaltupusu,tyultupachaxtupusu,tyultupachaltsupusu,tyultupatyaltupusu,tyultupatyaxtupusu,tyultupatyaltsupusu,tyultupatixyaltupusu,tyultupatixyaxtupusu,tyultupatixyaltsupusu,tyultupatilyaltupusu,tyultupatilyaxtupusu,tyultupatilyaltsupusu,tyultupacyaltupusu,tyultupacyaxtupusu,tyultupacyaltsupusu,tyuxtupachaltupusu,tyuxtupachaxtupusu,tyuxtupachaltsupusu,tyuxtupatyaltupusu,tyuxtupatyaxtupusu,tyuxtupatyaltsupusu,tyuxtupatixyaltupusu,tyuxtupatixyaxtupusu,tyuxtupatixyaltsupusu,tyuxtupatilyaltupusu,tyuxtupatilyaxtupusu,tyuxtupatilyaltsupusu,tyuxtupacyaltupusu,tyuxtupacyaxtupusu,tyuxtupacyaltsupusu,tyultsupachaltupusu,tyultsupachaxtupusu,tyultsupachaltsupusu,tyultsupatyaltupusu,tyultsupatyaxtupusu,tyultsupatyaltsupusu,tyultsupatixyaltupusu,tyultsupatixyaxtupusu,tyultsupatixyaltsupusu,tyultsupatilyaltupusu,tyultsupatilyaxtupusu,tyultsupatilyaltsupusu,tyultsupacyaltupusu,tyultsupacyaxtupusu,tyultsupacyaltsupusu,tixyultupachaltupusu,tixyultupachaxtupusu,tixyultupachaltsupusu,tixyultupatyaltupusu,tixyultupatyaxtupusu,tixyultupatyaltsupusu,tixyultupatixyaltupusu,tixyultupatixyaxtupusu,tixyultupatixyaltsupusu,tixyultupatilyaltupusu,tixyultupatilyaxtupusu,tixyultupatilyaltsupusu,tixyultupacyaltupusu,tixyultupacyaxtupusu,tixyultupacyaltsupusu,tixyuxtupachaltupusu,tixyuxtupachaxtupusu,tixyuxtupachaltsupusu,tixyuxtupatyaltupusu,tixyuxtupatyaxtupusu,tixyuxtupatyaltsupusu,tixyuxtupatixyaltupusu,tixyuxtupatixyaxtupusu,tixyuxtupatixyaltsupusu,tixyuxtupatilyaltupusu,tixyuxtupatilyaxtupusu,tixyuxtupatilyaltsupusu,tixyuxtupacyaltupusu,tixyuxtupacyaxtupusu,tixyuxtupacyaltsupusu,tixyultsupachaltupusu,tixyultsupachaxtupusu,tixyultsupachaltsupusu,tixyultsupatyaltupusu,tixyultsupatyaxtupusu,tixyultsupatyaltsupusu,tixyultsupatixyaltupusu,tixyultsupatixyaxtupusu,tixyultsupatixyaltsupusu,tixyultsupatilyaltupusu,tixyultsupatilyaxtupusu,tixyultsupatilyaltsupusu,tixyultsupacyaltupusu,tixyultsupacyaxtupusu,tixyultsupacyaltsupusu,tilyultupachaltupusu,tilyultupachaxtupusu,tilyultupachaltsupusu,tilyultupatyaltupusu,tilyultupatyaxtupusu,tilyultupatyaltsupusu,tilyultupatixyaltupusu,tilyultupatixyaxtupusu,tilyultupatixyaltsupusu,tilyultupatilyaltupusu,tilyultupatilyaxtupusu,tilyultupatilyaltsupusu,tilyultupacyaltupusu,tilyultupacyaxtupusu,tilyultupacyaltsupusu,tilyuxtupachaltupusu,tilyuxtupachaxtupusu,tilyuxtupachaltsupusu,tilyuxtupatyaltupusu,tilyuxtupatyaxtupusu,tilyuxtupatyaltsupusu,tilyuxtupatixyaltupusu,tilyuxtupatixyaxtupusu,tilyuxtupatixyaltsupusu,tilyuxtupatilyaltupusu,tilyuxtupatilyaxtupusu,tilyuxtupatilyaltsupusu,tilyuxtupacyaltupusu,tilyuxtupacyaxtupusu,tilyuxtupacyaltsupusu,tilyultsupachaltupusu,tilyultsupachaxtupusu,tilyultsupachaltsupusu,tilyultsupatyaltupusu,tilyultsupatyaxtupusu,tilyultsupatyaltsupusu,tilyultsupatixyaltupusu,tilyultsupatixyaxtupusu,tilyultsupatixyaltsupusu,tilyultsupatilyaltupusu,tilyultsupatilyaxtupusu,tilyultsupatilyaltsupusu,tilyultsupacyaltupusu,tilyultsupacyaxtupusu,tilyultsupacyaltsupusu,cyultupachaltupusu,cyultupachaxtupusu,cyultupachaltsupusu,cyultupatyaltupusu,cyultupatyaxtupusu,cyultupatyaltsupusu,cyultupatixyaltupusu,cyultupatixyaxtupusu,cyultupatixyaltsupusu,cyultupatilyaltupusu,cyultupatilyaxtupusu,cyultupatilyaltsupusu,cyultupacyaltupusu,cyultupacyaxtupusu,cyultupacyaltsupusu,cyuxtupachaltupusu,cyuxtupachaxtupusu,cyuxtupachaltsupusu,cyuxtupatyaltupusu,cyuxtupatyaxtupusu,cyuxtupatyaltsupusu,cyuxtupatixyaltupusu,cyuxtupatixyaxtupusu,cyuxtupatixyaltsupusu,cyuxtupatilyaltupusu,cyuxtupatilyaxtupusu,cyuxtupatilyaltsupusu,cyuxtupacyaltupusu,cyuxtupacyaxtupusu,cyuxtupacyaltsupusu,cyultsupachaltupusu,cyultsupachaxtupusu,cyultsupachaltsupusu,cyultsupatyaltupusu,cyultsupatyaxtupusu,cyultsupatyaltsupusu,cyultsupatixyaltupusu,cyultsupatixyaxtupusu,cyultsupatixyaltsupusu,cyultsupatilyaltupusu,cyultsupatilyaxtupusu,cyultsupatilyaltsupusu,cyultsupacyaltupusu,cyultsupacyaxtupusu,cyultsupacyaltsupusu("ppa"で"っぱ"になるようなパターンを除いているので実際はこれ以上)」
入力「じzyutu」出力「zizyutu,jizyutu」
入力「ちゅ」出力「chu,tyu,tixyu,tilyu,cyu」
入力「ばった」出力「batta,baltuta,baxtuta,baltsuta」 
*/
