export function getNextKeysOptimized(
  readingText: string,
  currentInput: string
): NextKeyInfo[] {
  // Cache for memoization keyed by "index_matched"
  const cache = new Map<string, NextKeyInfo[]>();

  // Check if a character is Hiragana
  function isHiragana(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096;
  }

  // Check if a character is a consonant (i.e. not a vowel)
  function isConsonant(char: string): boolean {
    return !"aiueo".includes(char.toLowerCase());
  }

  // Check if there is a next character in the remaining string
  function hasNextHiraganas(remaining: string): boolean {
    return remaining.length > 1;
  }

  // Check if the next conversion can start with an 'n'
  function isNextStartWithN(remaining: string): boolean {
    const next = remaining.slice(1);
    if (!next) return false;
    const matchKeyConfigs = KEY_CONFIGS.filter((config) =>
      next.startsWith(config.key)
    );
    return matchKeyConfigs.some((config) =>
      config.origins.some((origin) => origin.startsWith("n"))
    );
  }

  // Check if the next conversion starts with a consonant
  function isNextStartWithConsonant(remaining: string): boolean {
    const next = remaining.slice(1);
    if (!next) return false;
    const matchKeyConfigs = KEY_CONFIGS.filter((config) =>
      next.startsWith(config.key)
    );
    return matchKeyConfigs.some((config) =>
      config.origins.some((origin) => isConsonant(origin.charAt(0)))
    );
  }

  // Recursive function to determine next possible letters with conversion flag info
  function nextLetters(index: number, matched: number): NextKeyInfo[] {
    const cacheKey = `${index}_${matched}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;
    const results: NextKeyInfo[] = [];

    if (index >= readingText.length) {
      cache.set(cacheKey, results);
      return results;
    }

    const currentChar = readingText[index];

    // Handle small tsu ('っ') to output a doubled consonant candidate
    if (currentChar === "っ") {
      if (index + 1 < readingText.length) {
        const nextCandidates = nextLetters(index + 1, matched);
        for (const cand of nextCandidates) {
          if (cand.letter && isConsonant(cand.letter.charAt(0))) {
            results.push({
              letter: cand.letter.charAt(0),
              flag: { type: "direct", consumed: 1 },
            });
          }
        }
      }
      cache.set(cacheKey, results);
      return results;
    }

    // Handle 'ん' to output a single "n" when allowed by context
    if (currentChar === "ん") {
      const remaining = readingText.slice(index);
      if (hasNextHiraganas(remaining)) {
        if (
          !isNextStartWithN(remaining) &&
          !isNextStartWithConsonant(remaining)
        ) {
          results.push({
            letter: "n",
            flag: { type: "direct", consumed: 1 },
          });
        }
      } else {
        results.push({
          letter: "n",
          flag: { type: "direct", consumed: 1 },
        });
      }
      cache.set(cacheKey, results);
      return results;
    }

    // Process non-hiragana characters directly
    if (!isHiragana(currentChar)) {
      const candidate = currentChar;
      const remainingInput = currentInput.substring(matched);
      if (remainingInput === "") {
        results.push({
          letter: candidate,
          flag: { type: "direct", consumed: candidate.length },
        });
      }
      if (remainingInput.startsWith(candidate)) {
        if (remainingInput.length === candidate.length) {
          const rec = nextLetters(index + 1, matched + candidate.length);
          results.push(...rec);
        }
      }
      cache.set(cacheKey, results);
      return results;
    }

    // Process Hiragana characters via KEY_CONFIGS
    for (const config of KEY_CONFIGS) {
      if (readingText.startsWith(config.key, index)) {
        const newIndex = index + config.key.length;
        for (const origin of config.origins) {
          const remaining = currentInput.substring(matched);
          if (remaining.length > origin.length) {
            if (origin === remaining.substring(0, origin.length)) {
              const rec = nextLetters(newIndex, matched + origin.length);
              results.push(...rec);
            }
          } else {
            if (origin.startsWith(remaining)) {
              if (origin.length > remaining.length) {
                // Output the next roman letter candidate with conversion flag info
                const nextChar = origin.charAt(remaining.length);
                results.push({
                  letter: nextChar,
                  flag: {
                    type: "keyConfig",
                    configKey: config.key,
                    origin: origin,
                    consumed: remaining.length + 1,
                  },
                });
              } else {
                // Full match; proceed recursively
                const rec = nextLetters(newIndex, matched + origin.length);
                results.push(...rec);
              }
            }
          }
        }
      }
    }

    cache.set(cacheKey, results);
    return results;
  }

  return nextLetters(0, 0);
}

export function getRomanizedTextFromTendency(
  tendencies: ConversionTendencies,
  readingText: string,
  currentInput: string
): string {
  // Utility: ひらがなかどうかを判定する
  function isHiragana(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096;
  }
  // Utility: 文字が子音かどうかを判定（※ここでは例として母音以外を子音とする）
  function isConsonant(char: string): boolean {
    return !"aiueo".includes(char.toLowerCase());
  }

  let fullRomanized = "";
  let index = 0;
  // 複数文字のキーを優先するため、傾向をキー長の降順にソート
  const sortedTendencies = tendencies
    .slice()
    .sort((a, b) => b.key.length - a.key.length);

  while (index < readingText.length) {
    // 「っ」を検出した場合、次の変換候補の先頭文字（子音）を重ねる
    if (readingText[index] === "っ") {
      // 参照: addNextChild 内の isAllowDuplicateFirstLetter の考え方
      if (index + 1 < readingText.length) {
        // 次の位置から、該当する変換傾向を探す
        const nextTendency = sortedTendencies.find((tendency) =>
          readingText.startsWith(tendency.key, index + 1)
        );
        if (nextTendency && nextTendency.tendency.length > 0) {
          const firstChar = nextTendency.tendency.charAt(0);
          // 子音ならばその文字を出力（重ねる）
          if (isConsonant(firstChar)) {
            fullRomanized += firstChar;
          }
        }
      }
      index++; // 「っ」を消費して次へ
      continue;
    }

    let matched = false;
    // 非ひらがな文字はそのまま出力
    if (!isHiragana(readingText[index])) {
      fullRomanized += readingText[index];
      index++;
      continue;
    }
    // 傾向リストから、該当するキー（複合キーも含む）を探す
    for (const tendency of sortedTendencies) {
      if (readingText.startsWith(tendency.key, index)) {
        fullRomanized += tendency.tendency;
        index += tendency.key.length;
        matched = true;
        break;
      }
    }
    // 該当する傾向が見つからなければ、その文字をそのまま出力
    if (!matched) {
      fullRomanized += readingText[index];
      index++;
    }
  }
  if (!fullRomanized.startsWith(currentInput)) {
    throw new Error("入力済みのテキストと変換結果が一致しません。");
  }
  return fullRomanized;
}

export interface ConversionTendency {
  key: string; // 変換対象のひらがな（例："ち"）
  tendency: string; // デフォルトとして使用するローマ字（例："ti"）
}
export type ConversionTendencies = ConversionTendency[];
export type ConversionFlag = {
  type: "direct" | "keyConfig"; // 'direct' for literal chars, 'keyConfig' for conversion via KEY_CONFIGS
  configKey?: string; // Hiragana key from KEY_CONFIGS (e.g. "ち")
  origin?: string; // The chosen origin string (e.g. "ti" or "chi")
  consumed?: number; // Number of characters from currentInput consumed in this conversion step
};

export type NextKeyInfo = {
  letter: string;
  flag: ConversionFlag;
};

export async function TextToRomaji(input: string): Promise<string[]> {
  const roman = await hiraganaToRomans(input);
  return extractAllPatterns(roman);
}

export const hiraganaToRomans = async (hiraganas: string): Promise<Roman> => {
  const startRoman = new Roman("");
  await addNextChild(hiraganas, startRoman);
  return startRoman;
};

const addNextChild = async (
  remainingHiraganas: string,
  parentRoman: Roman,
  duplicateFirstLetter?: true
): Promise<void> => {
  if (!remainingHiraganas) {
    return;
  }
  const firstChar = remainingHiraganas[0];

  if (!isHiragana(firstChar)) {
    const nextRoman = new Roman(firstChar);
    parentRoman.addChild(nextRoman);
    const nextHiraganas = remainingHiraganas.slice(1);
    await addNextChild(nextHiraganas, nextRoman);
    return;
  }

  if (isAllowDuplicateFirstLetter(remainingHiraganas)) {
    const nextHiraganas = remainingHiraganas.slice(1);
    await addNextChild(nextHiraganas, parentRoman, true);
  }

  if (isAllowOneNInput(remainingHiraganas)) {
    const nextRoman = new Roman("n");
    parentRoman.addChild(nextRoman);
    const nextHiraganas = remainingHiraganas.slice(1);
    await addNextChild(nextHiraganas, nextRoman);
  }

  const matchKeyConfigs = KEY_CONFIGS.filter((keyConfig) =>
    remainingHiraganas.startsWith(keyConfig.key)
  );

  await Promise.all(
    matchKeyConfigs.map(async (matchKeyConfig) => {
      await Promise.all(
        matchKeyConfig.origins.map(async (origin) => {
          const nextRoman = duplicateFirstLetter
            ? new Roman(origin[0] + origin)
            : new Roman(origin);
          parentRoman.addChild(nextRoman);
          const nextHiraganas = remainingHiraganas.slice(
            matchKeyConfig.key.length
          );
          await addNextChild(nextHiraganas, nextRoman);
        })
      );
    })
  );
};

const isAllowDuplicateFirstLetter = (remainingHiraganas: string): boolean => {
  return (
    remainingHiraganas.startsWith("っ") &&
    !isNextStartWithN(remainingHiraganas) &&
    hasNextHiraganas(remainingHiraganas) &&
    !isNextStartWithConsonant(remainingHiraganas)
  );
};

const isAllowOneNInput = (remainingHiraganas: string): boolean => {
  if (!remainingHiraganas.startsWith("ん")) {
    return false;
  }

  return (
    remainingHiraganas.startsWith("ん") &&
    !isNextStartWithN(remainingHiraganas) &&
    hasNextHiraganas(remainingHiraganas) &&
    !isNextStartWithConsonant(remainingHiraganas)
  );
};

const hasNextHiraganas = (remainingHiraganas: string): boolean => {
  const nextHiraganas = remainingHiraganas.slice(1);
  return !!nextHiraganas;
};

const isNextStartWithN = (remainingHiraganas: string): boolean => {
  const nextHiraganas = remainingHiraganas.slice(1);
  if (!nextHiraganas) return false;

  const matchKeyConfigs = KEY_CONFIGS.filter((keyConfig) =>
    nextHiraganas.startsWith(keyConfig.key)
  );
  return matchKeyConfigs.some((matchKeyConfig) =>
    matchKeyConfig.origins.some((origin) => origin.startsWith("n"))
  );
};

const isNextStartWithConsonant = (remainingHiraganas: string): boolean => {
  const nextHiraganas = remainingHiraganas.slice(1);
  if (!nextHiraganas) return false;
  const matchKeyConfigs = KEY_CONFIGS.filter((keyConfig) =>
    nextHiraganas.startsWith(keyConfig.key)
  );
  return matchKeyConfigs.some((matchKeyConfig) =>
    matchKeyConfig.origins.some((origin) => isConsonant(origin[0]))
  );
};

const isConsonant = (char: string): boolean => {
  return ["a", "i", "u", "e", "o", "y"].includes(char);
};

const isHiragana = (char: string): boolean => {
  const charCode = char.charCodeAt(0);
  return charCode >= 0x3041 && charCode <= 0x3096;
};

export class Roman {
  roma: string;
  children: Roman[] = [];
  parent: Roman | undefined;

  constructor(roma: string) {
    this.roma = roma;
  }

  addChild(roman: Roman): void {
    this.children.push(roman);
    roman.parent = this;
  }
}

export const findConfig = (
  configs: KeyConfigs,
  key: string
): KeyConfig | undefined => {
  return configs.find((config) => config.key === key);
};

export const KEY_CONFIGS: KeyConfigs = [
  {
    key: "あ",
    origins: ["a"],
  },
  {
    key: "い",
    origins: ["i", "yi"],
  },
  {
    key: "う",
    origins: ["u", "wu", "whu"],
  },
  {
    key: "え",
    origins: ["e"],
  },
  {
    key: "お",
    origins: ["o"],
  },
  {
    key: "か",
    origins: ["ka", "ca"],
  },
  {
    key: "き",
    origins: ["ki"],
  },
  {
    key: "く",
    origins: ["ku", "cu", "qu"],
  },
  {
    key: "け",
    origins: ["ke"],
  },
  {
    key: "こ",
    origins: ["ko", "co"],
  },
  {
    key: "さ",
    origins: ["sa"],
  },
  {
    key: "し",
    origins: ["si", "ci", "shi"],
  },
  {
    key: "す",
    origins: ["su"],
  },
  {
    key: "せ",
    origins: ["se", "ce"],
  },
  {
    key: "そ",
    origins: ["so"],
  },
  {
    key: "た",
    origins: ["ta"],
  },
  {
    key: "ち",
    origins: ["ti", "chi"],
  },
  {
    key: "つ",
    origins: ["tu", "tsu"],
  },
  {
    key: "て",
    origins: ["te"],
  },
  {
    key: "と",
    origins: ["to"],
  },
  {
    key: "な",
    origins: ["na"],
  },
  {
    key: "に",
    origins: ["ni"],
  },
  {
    key: "ぬ",
    origins: ["nu"],
  },
  {
    key: "ね",
    origins: ["ne"],
  },
  {
    key: "の",
    origins: ["no"],
  },
  {
    key: "は",
    origins: ["ha"],
  },
  {
    key: "ひ",
    origins: ["hi"],
  },
  {
    key: "ふ",
    origins: ["fu", "hu"],
  },
  {
    key: "へ",
    origins: ["he"],
  },
  {
    key: "ほ",
    origins: ["ho"],
  },
  {
    key: "ま",
    origins: ["ma"],
  },
  {
    key: "み",
    origins: ["mi"],
  },
  {
    key: "む",
    origins: ["mu"],
  },
  {
    key: "め",
    origins: ["me"],
  },
  {
    key: "も",
    origins: ["mo"],
  },
  {
    key: "や",
    origins: ["ya"],
  },
  {
    key: "ゆ",
    origins: ["yu"],
  },
  {
    key: "よ",
    origins: ["yo"],
  },
  {
    key: "ら",
    origins: ["ra"],
  },
  {
    key: "り",
    origins: ["ri"],
  },
  {
    key: "る",
    origins: ["ru"],
  },
  {
    key: "れ",
    origins: ["re"],
  },
  {
    key: "ろ",
    origins: ["ro"],
  },
  {
    key: "わ",
    origins: ["wa"],
  },
  {
    key: "を",
    origins: ["wo"],
  },
  {
    key: "ん",
    origins: ["nn", "n'", "xn"],
  },
  {
    key: "が",
    origins: ["ga"],
  },
  {
    key: "ぎ",
    origins: ["gi"],
  },
  {
    key: "ぐ",
    origins: ["gu"],
  },
  {
    key: "げ",
    origins: ["ge"],
  },
  {
    key: "ご",
    origins: ["go"],
  },
  {
    key: "ざ",
    origins: ["za"],
  },
  {
    key: "じ",
    origins: ["zi", "ji"],
  },
  {
    key: "ず",
    origins: ["zu"],
  },
  {
    key: "ぜ",
    origins: ["ze"],
  },
  {
    key: "ぞ",
    origins: ["zo"],
  },
  {
    key: "だ",
    origins: ["da"],
  },
  {
    key: "ぢ",
    origins: ["di"],
  },
  {
    key: "づ",
    origins: ["du"],
  },
  {
    key: "で",
    origins: ["de"],
  },
  {
    key: "ど",
    origins: ["do"],
  },
  {
    key: "ば",
    origins: ["ba"],
  },
  {
    key: "び",
    origins: ["bi"],
  },
  {
    key: "ぶ",
    origins: ["bu"],
  },
  {
    key: "べ",
    origins: ["be"],
  },
  {
    key: "ぼ",
    origins: ["bo"],
  },
  {
    key: "ぱ",
    origins: ["pa"],
  },
  {
    key: "ぴ",
    origins: ["pi"],
  },
  {
    key: "ぷ",
    origins: ["pu"],
  },
  {
    key: "ぺ",
    origins: ["pe"],
  },
  {
    key: "ぽ",
    origins: ["po"],
  },
  {
    key: "ぁ",
    origins: ["la", "xa"],
  },
  {
    key: "ぃ",
    origins: ["li", "xi"],
  },
  {
    key: "ぅ",
    origins: ["lu", "xu"],
  },
  {
    key: "ぇ",
    origins: ["le", "xe"],
  },
  {
    key: "ぉ",
    origins: ["lo", "xo"],
  },
  {
    key: "ゃ",
    origins: ["lya", "xya"],
  },
  {
    key: "ゅ",
    origins: ["lyu", "xyu"],
  },
  {
    key: "ょ",
    origins: ["lyo", "xyo"],
  },
  {
    key: "ヵ",
    origins: ["lka", "xka"],
  },
  {
    key: "ヶ",
    origins: ["lke", "xke"],
  },
  {
    key: "ゎ",
    origins: ["lwa", "xwa"],
  },
  {
    key: "っ",
    origins: ["ltu", "xtu", "ltsu", "xtsu"],
  },
  {
    key: "ゔ",
    origins: ["vu"],
  },
  {
    key: "ー",
    origins: ["-"],
  },
  {
    key: "？",
    origins: ["?"],
  },
  {
    key: "！",
    origins: ["!"],
  },
  {
    key: "、",
    origins: [",", "、"],
  },
  {
    key: "。",
    origins: [".", "。"],
  },
  {
    key: "うぁ",
    origins: ["wha"],
  },
  {
    key: "うぃ",
    origins: ["whi", "wi"],
  },
  {
    key: "うぇ",
    origins: ["whe", "we"],
  },
  {
    key: "うぉ",
    origins: ["who"],
  },
  {
    key: "うぉ",
    origins: ["who"],
  },
  {
    key: "いぇ",
    origins: ["ye"],
  },
  {
    key: "きゃ",
    origins: ["kya"],
  },
  {
    key: "きぃ",
    origins: ["kyi"],
  },
  {
    key: "きゅ",
    origins: ["kyu"],
  },
  {
    key: "きぇ",
    origins: ["kye"],
  },
  {
    key: "きょ",
    origins: ["kyo"],
  },
  {
    key: "くゃ",
    origins: ["qya"],
  },
  {
    key: "くゅ",
    origins: ["qyu"],
  },
  {
    key: "くょ",
    origins: ["qyo"],
  },
  {
    key: "くぁ",
    origins: ["qwa", "qa", "kwa"],
  },
  {
    key: "くぃ",
    origins: ["qwi", "qi", "qyi"],
  },
  {
    key: "くぅ",
    origins: ["qwu"],
  },
  {
    key: "くぇ",
    origins: ["qwe", "qe", "qye"],
  },
  {
    key: "くぉ",
    origins: ["qwo", "qo"],
  },
  {
    key: "ぐぁ",
    origins: ["gwa"],
  },
  {
    key: "ぐぃ",
    origins: ["gwi"],
  },
  {
    key: "ぐぅ",
    origins: ["gwu"],
  },
  {
    key: "ぐぇ",
    origins: ["gwe"],
  },
  {
    key: "くぉ",
    origins: ["gwo"],
  },
  {
    key: "しゃ",
    origins: ["sya", "sha"],
  },
  {
    key: "しぃ",
    origins: ["syi"],
  },
  {
    key: "しゅ",
    origins: ["syu", "shu"],
  },
  {
    key: "しぇ",
    origins: ["sye", "she"],
  },
  {
    key: "しょ",
    origins: ["syo", "sho"],
  },
  {
    key: "すぁ",
    origins: ["swa"],
  },
  {
    key: "すぃ",
    origins: ["swi"],
  },
  {
    key: "すぅ",
    origins: ["swu"],
  },
  {
    key: "すぇ",
    origins: ["swe"],
  },
  {
    key: "すぉ",
    origins: ["swo"],
  },
  {
    key: "ちゃ",
    origins: ["tya", "cya", "cha"],
  },
  {
    key: "ちぃ",
    origins: ["tyi", "cyi"],
  },
  {
    key: "ちゅ",
    origins: ["tyu", "cyu", "chu"],
  },
  {
    key: "ちぇ",
    origins: ["tye", "cye", "che"],
  },
  {
    key: "ちょ",
    origins: ["tyo", "cyo", "cho"],
  },
  {
    key: "つぁ",
    origins: ["tsa"],
  },
  {
    key: "つぃ",
    origins: ["tsi"],
  },
  {
    key: "つぇ",
    origins: ["tse"],
  },
  {
    key: "つぉ",
    origins: ["tso"],
  },
  {
    key: "てぁ",
    origins: ["tha"],
  },
  {
    key: "てぃ",
    origins: ["thi"],
  },
  {
    key: "てゅ",
    origins: ["thu"],
  },
  {
    key: "てぇ",
    origins: ["the"],
  },
  {
    key: "てょ",
    origins: ["tho"],
  },
  {
    key: "とぁ",
    origins: ["twa"],
  },
  {
    key: "とぃ",
    origins: ["twi"],
  },
  {
    key: "とぅ",
    origins: ["twu"],
  },
  {
    key: "とぇ",
    origins: ["twe"],
  },
  {
    key: "とぉ",
    origins: ["two"],
  },
  {
    key: "にゃ",
    origins: ["nya"],
  },
  {
    key: "にぃ",
    origins: ["nyi"],
  },
  {
    key: "にゅ",
    origins: ["nyu"],
  },
  {
    key: "にぇ",
    origins: ["nyu"],
  },
  {
    key: "にょ",
    origins: ["nyu"],
  },
  {
    key: "ひゃ",
    origins: ["hya"],
  },
  {
    key: "ひぃ",
    origins: ["hyi"],
  },
  {
    key: "ひゅ",
    origins: ["hyu"],
  },
  {
    key: "ひぇ",
    origins: ["hye"],
  },
  {
    key: "ひょ",
    origins: ["hyo"],
  },
  {
    key: "みゃ",
    origins: ["mya"],
  },
  {
    key: "みぃ",
    origins: ["myi"],
  },
  {
    key: "みゅ",
    origins: ["myu"],
  },
  {
    key: "みぇ",
    origins: ["mye"],
  },
  {
    key: "みょ",
    origins: ["myo"],
  },
  {
    key: "りゃ",
    origins: ["rya"],
  },
  {
    key: "りぃ",
    origins: ["ryi"],
  },
  {
    key: "りゅ",
    origins: ["ryu"],
  },
  {
    key: "りぇ",
    origins: ["rye"],
  },
  {
    key: "りょ",
    origins: ["ryo"],
  },
  {
    key: "ふぁ",
    origins: ["fa", "fwa"],
  },
  {
    key: "ふぃ",
    origins: ["fi", "fwi", "fyi"],
  },
  {
    key: "ふぅ",
    origins: ["fwu"],
  },
  {
    key: "ふぇ",
    origins: ["fe", "fwe", "fye"],
  },
  {
    key: "ふぉ",
    origins: ["fo", "fwo"],
  },
  {
    key: "ふゃ",
    origins: ["fya"],
  },
  {
    key: "ふゅ",
    origins: ["fyu"],
  },
  {
    key: "ふょ",
    origins: ["fyo"],
  },
  {
    key: "ぎゃ",
    origins: ["gya"],
  },
  {
    key: "ぎぃ",
    origins: ["gyi"],
  },
  {
    key: "ぎゅ",
    origins: ["gyu"],
  },
  {
    key: "ぎぇ",
    origins: ["gye"],
  },
  {
    key: "ぎょ",
    origins: ["gyo"],
  },
  {
    key: "じゃ",
    origins: ["zya", "ja", "jya"],
  },
  {
    key: "じぃ",
    origins: ["zyi", "jyi"],
  },
  {
    key: "じゅ",
    origins: ["zyu", "ju", "jyu"],
  },
  {
    key: "じぇ",
    origins: ["zye", "je", "jye"],
  },
  {
    key: "じょ",
    origins: ["zyo", "jo", "jyo"],
  },
  {
    key: "ぢゃ",
    origins: ["dya"],
  },
  {
    key: "ぢぃ",
    origins: ["dyi"],
  },
  {
    key: "ぢゅ",
    origins: ["dyu"],
  },
  {
    key: "ぢぇ",
    origins: ["dye"],
  },
  {
    key: "ぢょ",
    origins: ["dyo"],
  },
  {
    key: "びゃ",
    origins: ["bya"],
  },
  {
    key: "びぃ",
    origins: ["byi"],
  },
  {
    key: "びゅ",
    origins: ["byu"],
  },
  {
    key: "びぇ",
    origins: ["bye"],
  },
  {
    key: "びょ",
    origins: ["byo"],
  },
  {
    key: "ぴゃ",
    origins: ["pya"],
  },
  {
    key: "ぴぃ",
    origins: ["pyi"],
  },
  {
    key: "ぴゅ",
    origins: ["pyu"],
  },
  {
    key: "ぴぇ",
    origins: ["pye"],
  },
  {
    key: "ぴょ",
    origins: ["pyo"],
  },
  {
    key: "ゔぁ",
    origins: ["va"],
  },
  {
    key: "ゔぃ",
    origins: ["vi", "vyi"],
  },
  {
    key: "ゔぇ",
    origins: ["ve", "vye"],
  },
  {
    key: "ゔぉ",
    origins: ["vo"],
  },
  {
    key: "ゔゃ",
    origins: ["vya"],
  },
  {
    key: "ゔゅ",
    origins: ["vyu"],
  },
  {
    key: "ゔょ",
    origins: ["vyo"],
  },
  {
    key: "でゃ",
    origins: ["dha"],
  },
  {
    key: "でぃ",
    origins: ["dhi"],
  },
  {
    key: "でゅ",
    origins: ["dhu"],
  },
  {
    key: "でぇ",
    origins: ["dhe"],
  },
  {
    key: "でょ",
    origins: ["dho"],
  },
  {
    key: "どぁ",
    origins: ["dwa"],
  },
  {
    key: "どぃ",
    origins: ["dwi"],
  },
  {
    key: "どぅ",
    origins: ["dwu"],
  },
  {
    key: "どぇ",
    origins: ["dwe"],
  },
  {
    key: "どぉ",
    origins: ["dwo"],
  },
];
export type KeyConfigs = Array<KeyConfig>;

export interface KeyConfig {
  key: string;
  origins: string[];
}

export const extractAllPatterns = (root: Roman): string[] => {
  const results: string[] = [];

  const traverse = (node: Roman, current: string) => {
    const updated = current + node.roma;
    if (node.children.length === 0) {
      results.push(updated);
      return;
    }
    node.children.forEach((child) => traverse(child, updated));
  };

  root.children.forEach((child) => traverse(child, ""));
  return results;
};
