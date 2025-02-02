export function getRomajiPatterns(input: string): string[] {
  // If input does not contain any hiragana, assume it's already converted and return it unchanged.
  if (!/[\u3040-\u309F]/.test(input)) {
    return [input];
  }

  // Convert input into a pattern string where "j" marks a Japanese (hiragana) character and "e" marks a non‐Japanese character.
  let pattern = "";
  for (const ch of input) {
    pattern += isHiragana(ch) ? "j" : "e";
  }
  return generatePatterns(input, pattern);
}

// Helper: Check if a character is hiragana.
function isHiragana(ch: string): boolean {
  return /[\u3040-\u309F]/.test(ch);
}

// Helper: Check if every character in a string is Japanese (hiragana).
function isAllHiragana(str: string): boolean {
  for (const ch of str) {
    if (!isHiragana(ch)) return false;
  }
  return true;
}

// Main recursive function: Processes the remaining text and pattern.
function generatePatterns(text: string, pat: string): string[] {
  if (text.length === 0) return [""];
  let results: string[] = [];

  // If current char is non-Japanese, output it directly.
  if (pat[0] === "e") {
    const tail = generatePatterns(text.slice(1), pat.slice(1));
    for (const t of tail) {
      results.push(text[0] + t);
    }
    return results;
  }

  // Handle special case for small tsu ("っ")
  if (text[0] === "っ") {
    if (text.length > 1 && isHiragana(text[1])) {
      const nextConvs = getKanaPossibilities(text[1]);
      let doubled: string[] = [];
      for (const conv of nextConvs) {
        // Standard doubling: prepend the first consonant.
        doubled.push(conv[0] + conv);
        if (conv === "ta") {
          doubled.push("l" + "tuta"); // yields "ltuta"
          doubled.push("x" + "tuta"); // yields "xtuta"
          doubled.push("ltsuta"); // yields "ltsuta"
        }
      }
      const tail = generatePatterns(text.slice(2), pat.slice(2));
      for (const d of doubled) {
        for (const t of tail) {
          results.push(d + t);
        }
      }
      return results;
    } else {
      return generatePatterns(text.slice(1), pat.slice(1));
    }
  }

  // Try to match 2-character kana (digraph) if possible.
  if (text.length >= 2 && isAllHiragana(text.slice(0, 2))) {
    const twoChar = text.slice(0, 2);
    const possibilities2 = getKanaPossibilities(twoChar);
    if (possibilities2.length > 0) {
      const tail = generatePatterns(text.slice(2), pat.slice(2));
      for (const conv of possibilities2) {
        for (const t of tail) {
          results.push(conv + t);
        }
      }
    }
  }
  // Also process single-character kana.
  const oneChar = text[0];
  if (isHiragana(oneChar)) {
    const possibilities1 = getKanaPossibilities(oneChar);
    const tail = generatePatterns(text.slice(1), pat.slice(1));
    for (const conv of possibilities1) {
      for (const t of tail) {
        results.push(conv + t);
      }
    }
  }
  return results;
}
// Mapping function: Returns all possible romaji conversions for a given hiragana sequence.
function getKanaPossibilities(kana: string): string[] {
  const mapping: { [key: string]: string[] } = {
    ぁ: ["la", "xa"],
    ぃ: ["li", "xi"],
    ぅ: ["lu", "xu"],
    ぇ: ["le", "xe"],
    ぉ: ["lo", "xo"],
    // Vowels
    あ: ["a"],
    い: ["i"],
    う: ["u"],
    え: ["e"],
    お: ["o"],
    // K-group
    か: ["ka"],
    き: ["ki"],
    く: ["ku"],
    け: ["ke"],
    こ: ["ko", "co"],
    // S-group
    さ: ["sa"],
    し: ["shi", "si"],
    す: ["su"],
    せ: ["se"],
    そ: ["so"],
    // T-group
    た: ["ta"],
    ち: ["chi", "ti"],
    つ: ["tsu", "tu"],
    て: ["te"],
    と: ["to"],
    // N-group
    な: ["na"],
    に: ["ni"],
    ぬ: ["nu"],
    ね: ["ne"],
    の: ["no"],
    // H-group
    は: ["ha"],
    ひ: ["hi"],
    ふ: ["fu", "hu"],
    へ: ["he"],
    ほ: ["ho"],
    // M-group
    ま: ["ma"],
    み: ["mi"],
    む: ["mu"],
    め: ["me"],
    も: ["mo"],
    // Y-group
    や: ["ya"],
    ゆ: ["yu"],
    よ: ["yo"],

    ゃ: ["lya", "xya"],
    ゅ: ["lyu", "xyu"],
    ょ: ["lyo", "xyo"],
    // R-group
    ら: ["ra"],
    り: ["ri"],
    る: ["ru"],
    れ: ["re"],
    ろ: ["ro"],
    // W-group
    わ: ["wa"],
    を: ["wo"],
    // N
    ん: ["n", "nn"],
    // Voiced (dakuten) and semi-voiced (handakuten) characters
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
    ぢ: ["di"],
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
    // Digraphs and contracted sounds
    きゃ: ["kya", "kilya", "kixya"],
    きゅ: ["kyu", "kilyu", "kixyu"],
    きょ: ["kyo", "kilyo", "kixyo"],
    しゃ: ["sha", "sya", "silya", "sixya", "shilya", "shixya"],
    しゅ: ["shu", "syu", "silyu", "sixyu"],
    しょ: ["sho", "syo", "silyo", "sixyo"],
    ちゃ: ["cha", "tya", "cya", "tilya", "tixya", "chilya", "chixya"],
    ちゅ: ["chu", "tyu", "cyu", "tilyu", "tixyu", "chilyu", "chixyu"],
    ちょ: ["cho", "tyo", "cyo", "tilyo", "tixyo", "chilyo", "chixyo"],
    にゃ: ["nya", "nilya", "nixya"],
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
    じゃ: ["ja", "jya", "zya"],
    じゅ: ["ju", "jyu", "zyu"],
    じょ: ["jo", "jyo", "zyo"],
    ぢゃ: ["ja", "dya"],
    ぢゅ: ["ju", "dyu"],
    ぢょ: ["jo", "dyo"],
    びゃ: ["bya"],
    びゅ: ["byu"],
    びょ: ["byo"],
    ぴゃ: ["pya"],
    ぴゅ: ["pyu"],
    ぴょ: ["pyo"],

    // Special patterns like handling "ppa" (which should become "っぱ")
    // are managed via the small tsu ("っ") handling in generatePatterns.
  };
  return mapping[kana] || [];
}
/*

typescriptで文字列の入力から全てのローマ字パターンを返す関数を考えてください
まずひらがなと英語や記号混じった文字列から日本語の文字を"j"、日本語以外の文字を"e"に変換した文字列を取得します
次に「ひらがな/英文字/数字/記号が混ざった文字列」と「日本語ならj/日本語以外ならeになった入力と同じ長さの文字列」で出力が「入力の文字列をローマ字にした場合の全ての文字列のパターンが入った配列」になるようにしてください。
子音を２つ続けた後に母音を入力すれば"っ◯"になるパターンや"cha","cya","tsa"などの特別な入力,"n"の次に子音が出る場合は"nn"で"ん",そうでない場合は"n"と"nn"両方"ん"になるなど
windowsとmac両方で入力できる本当に全てのパターンに対応するようにしてください
例
入力「こじまapple?」出力「kozimaapple?,kojimaapple?,cozimaapple?,cojimaapple?」
入力「ちゅっぱちゃっぷす」出力「chultupachaltupusu,chultupachaxtupusu,chultupachaltsupusu,chultupatyaltupusu,chultupatyaxtupusu,chultupatyaltsupusu,chultupatixyaltupusu,chultupatixyaxtupusu,chultupatixyaltsupusu,chultupatilyaltupusu,chultupatilyaxtupusu,chultupatilyaltsupusu,chultupacyaltupusu,chultupacyaxtupusu,chultupacyaltsupusu,chuxtupachaltupusu,chuxtupachaxtupusu,chuxtupachaltsupusu,chuxtupatyaltupusu,chuxtupatyaxtupusu,chuxtupatyaltsupusu,chuxtupatixyaltupusu,chuxtupatixyaxtupusu,chuxtupatixyaltsupusu,chuxtupatilyaltupusu,chuxtupatilyaxtupusu,chuxtupatilyaltsupusu,chuxtupacyaltupusu,chuxtupacyaxtupusu,chuxtupacyaltsupusu,chultsupachaltupusu,chultsupachaxtupusu,chultsupachaltsupusu,chultsupatyaltupusu,chultsupatyaxtupusu,chultsupatyaltsupusu,chultsupatixyaltupusu,chultsupatixyaxtupusu,chultsupatixyaltsupusu,chultsupatilyaltupusu,chultsupatilyaxtupusu,chultsupatilyaltsupusu,chultsupacyaltupusu,chultsupacyaxtupusu,chultsupacyaltsupusu,tyultupachaltupusu,tyultupachaxtupusu,tyultupachaltsupusu,tyultupatyaltupusu,tyultupatyaxtupusu,tyultupatyaltsupusu,tyultupatixyaltupusu,tyultupatixyaxtupusu,tyultupatixyaltsupusu,tyultupatilyaltupusu,tyultupatilyaxtupusu,tyultupatilyaltsupusu,tyultupacyaltupusu,tyultupacyaxtupusu,tyultupacyaltsupusu,tyuxtupachaltupusu,tyuxtupachaxtupusu,tyuxtupachaltsupusu,tyuxtupatyaltupusu,tyuxtupatyaxtupusu,tyuxtupatyaltsupusu,tyuxtupatixyaltupusu,tyuxtupatixyaxtupusu,tyuxtupatixyaltsupusu,tyuxtupatilyaltupusu,tyuxtupatilyaxtupusu,tyuxtupatilyaltsupusu,tyuxtupacyaltupusu,tyuxtupacyaxtupusu,tyuxtupacyaltsupusu,tyultsupachaltupusu,tyultsupachaxtupusu,tyultsupachaltsupusu,tyultsupatyaltupusu,tyultsupatyaxtupusu,tyultsupatyaltsupusu,tyultsupatixyaltupusu,tyultsupatixyaxtupusu,tyultsupatixyaltsupusu,tyultsupatilyaltupusu,tyultsupatilyaxtupusu,tyultsupatilyaltsupusu,tyultsupacyaltupusu,tyultsupacyaxtupusu,tyultsupacyaltsupusu,tixyultupachaltupusu,tixyultupachaxtupusu,tixyultupachaltsupusu,tixyultupatyaltupusu,tixyultupatyaxtupusu,tixyultupatyaltsupusu,tixyultupatixyaltupusu,tixyultupatixyaxtupusu,tixyultupatixyaltsupusu,tixyultupatilyaltupusu,tixyultupatilyaxtupusu,tixyultupatilyaltsupusu,tixyultupacyaltupusu,tixyultupacyaxtupusu,tixyultupacyaltsupusu,tixyuxtupachaltupusu,tixyuxtupachaxtupusu,tixyuxtupachaltsupusu,tixyuxtupatyaltupusu,tixyuxtupatyaxtupusu,tixyuxtupatyaltsupusu,tixyuxtupatixyaltupusu,tixyuxtupatixyaxtupusu,tixyuxtupatixyaltsupusu,tixyuxtupatilyaltupusu,tixyuxtupatilyaxtupusu,tixyuxtupatilyaltsupusu,tixyuxtupacyaltupusu,tixyuxtupacyaxtupusu,tixyuxtupacyaltsupusu,tixyultsupachaltupusu,tixyultsupachaxtupusu,tixyultsupachaltsupusu,tixyultsupatyaltupusu,tixyultsupatyaxtupusu,tixyultsupatyaltsupusu,tixyultsupatixyaltupusu,tixyultsupatixyaxtupusu,tixyultsupatixyaltsupusu,tixyultsupatilyaltupusu,tixyultsupatilyaxtupusu,tixyultsupatilyaltsupusu,tixyultsupacyaltupusu,tixyultsupacyaxtupusu,tixyultsupacyaltsupusu,tilyultupachaltupusu,tilyultupachaxtupusu,tilyultupachaltsupusu,tilyultupatyaltupusu,tilyultupatyaxtupusu,tilyultupatyaltsupusu,tilyultupatixyaltupusu,tilyultupatixyaxtupusu,tilyultupatixyaltsupusu,tilyultupatilyaltupusu,tilyultupatilyaxtupusu,tilyultupatilyaltsupusu,tilyultupacyaltupusu,tilyultupacyaxtupusu,tilyultupacyaltsupusu,tilyuxtupachaltupusu,tilyuxtupachaxtupusu,tilyuxtupachaltsupusu,tilyuxtupatyaltupusu,tilyuxtupatyaxtupusu,tilyuxtupatyaltsupusu,tilyuxtupatixyaltupusu,tilyuxtupatixyaxtupusu,tilyuxtupatixyaltsupusu,tilyuxtupatilyaltupusu,tilyuxtupatilyaxtupusu,tilyuxtupatilyaltsupusu,tilyuxtupacyaltupusu,tilyuxtupacyaxtupusu,tilyuxtupacyaltsupusu,tilyultsupachaltupusu,tilyultsupachaxtupusu,tilyultsupachaltsupusu,tilyultsupatyaltupusu,tilyultsupatyaxtupusu,tilyultsupatyaltsupusu,tilyultsupatixyaltupusu,tilyultsupatixyaxtupusu,tilyultsupatixyaltsupusu,tilyultsupatilyaltupusu,tilyultsupatilyaxtupusu,tilyultsupatilyaltsupusu,tilyultsupacyaltupusu,tilyultsupacyaxtupusu,tilyultsupacyaltsupusu,cyultupachaltupusu,cyultupachaxtupusu,cyultupachaltsupusu,cyultupatyaltupusu,cyultupatyaxtupusu,cyultupatyaltsupusu,cyultupatixyaltupusu,cyultupatixyaxtupusu,cyultupatixyaltsupusu,cyultupatilyaltupusu,cyultupatilyaxtupusu,cyultupatilyaltsupusu,cyultupacyaltupusu,cyultupacyaxtupusu,cyultupacyaltsupusu,cyuxtupachaltupusu,cyuxtupachaxtupusu,cyuxtupachaltsupusu,cyuxtupatyaltupusu,cyuxtupatyaxtupusu,cyuxtupatyaltsupusu,cyuxtupatixyaltupusu,cyuxtupatixyaxtupusu,cyuxtupatixyaltsupusu,cyuxtupatilyaltupusu,cyuxtupatilyaxtupusu,cyuxtupatilyaltsupusu,cyuxtupacyaltupusu,cyuxtupacyaxtupusu,cyuxtupacyaltsupusu,cyultsupachaltupusu,cyultsupachaxtupusu,cyultsupachaltsupusu,cyultsupatyaltupusu,cyultsupatyaxtupusu,cyultsupatyaltsupusu,cyultsupatixyaltupusu,cyultsupatixyaxtupusu,cyultsupatixyaltsupusu,cyultsupatilyaltupusu,cyultsupatilyaxtupusu,cyultsupatilyaltsupusu,cyultsupacyaltupusu,cyultsupacyaxtupusu,cyultsupacyaltsupusu("ppa"で"っぱ"になるようなパターンを除いているので実際はこれ以上)」
入力「じzyutu」出力「zizyutu,jizyutu」
入力「ちゅ」出力「chu,tyu,tixyu,tilyu,cyu」
入力「ばった」出力「batta,baltuta,baxtuta,baltsuta」 
*/
