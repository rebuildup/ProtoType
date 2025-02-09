export function getNextKeysOptimized(
  readingText: string,
  currentInput: string
): NextKeyInfo[] {
  const cache = new Map<string, NextKeyInfo[]>();

  // Check if a character is Hiragana.
  function isHiragana(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096;
  }

  // Check if a character is a consonant.
  function isConsonant(char: string): boolean {
    return !"aiueo".includes(char.toLowerCase());
  }

  function getSmallTsuCandidates(): string[] {
    const tsuConfig = KEY_CONFIGS.find((config) => config.key === "っ");
    const letters = new Set<string>();
    if (tsuConfig) {
      tsuConfig.origins.forEach((origin) => {
        if (origin.length > 0 && isConsonant(origin.charAt(0))) {
          letters.add(origin.charAt(0));
        }
      });
    }
    return Array.from(letters);
  }

  function getDoublingCandidates(syllableIndex: number): string[] {
    const letters = new Set<string>();
    for (const config of KEY_CONFIGS) {
      if (readingText.startsWith(config.key, syllableIndex)) {
        for (const origin of config.origins) {
          if (origin.length > 0 && isConsonant(origin.charAt(0))) {
            letters.add(origin.charAt(0));
          }
        }
      }
    }
    return Array.from(letters);
  }

  function nextLetters(index: number, matched: number): NextKeyInfo[] {
    const cacheKey = `${index}_${matched}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;
    let results: NextKeyInfo[] = [];

    // Base case: if all readingText is processed.
    if (index >= readingText.length) {
      cache.set(cacheKey, results);
      return results;
    }

    const currentChar = readingText[index];

    // For non-Hiragana characters, compare directly.
    if (!isHiragana(currentChar)) {
      const candidate = currentChar;
      const remainingInput = currentInput.substring(matched);
      if (remainingInput.startsWith(candidate)) {
        const rec = nextLetters(
          index + candidate.length,
          matched + candidate.length
        );
        results.push(...rec);
      } else {
        results.push({
          letter: candidate,
          flag: {
            type: "direct",
            consumed: candidate.length,
          } as ConversionFlag,
        });
      }
      cache.set(cacheKey, results);
      return results;
    }

    // Processing for small "っ" remains unchanged.
    if (currentChar === "っ") {
      if (index + 1 < readingText.length) {
        const candidatesFromNext = getDoublingCandidates(index + 1);
        const candidatesFromTsu = getSmallTsuCandidates();
        const expectedDoubling = Array.from(
          new Set([...candidatesFromNext, ...candidatesFromTsu])
        );
        const currentLetter = currentInput.substring(matched, matched + 1);
        if (currentLetter) {
          if (expectedDoubling.includes(currentLetter)) {
            const rec = nextLetters(index + 1, matched + 1);
            results.push(...rec);
          } else {
            expectedDoubling.forEach((letter) =>
              results.push({
                letter,
                flag: { type: "direct", consumed: 1 } as ConversionFlag,
              })
            );
          }
        } else {
          expectedDoubling.forEach((letter) =>
            results.push({
              letter,
              flag: { type: "direct", consumed: 1 } as ConversionFlag,
            })
          );
        }
        cache.set(cacheKey, results);
        return results;
      }
      cache.set(cacheKey, results);
      return results;
    }

    // Processing for "ん"
    if (currentChar === "ん") {
      const remainingInput = currentInput.substring(matched);
      // Final "ん": last character of readingText.
      if (index === readingText.length - 1) {
        // If the user already entered "nn", conversion is complete.
        if (remainingInput.startsWith("nn")) {
          cache.set(cacheKey, []);
          return [];
        } else {
          const consumed = remainingInput.startsWith("n") ? 1 : 0;
          results.push({
            letter: "n",
            flag: { type: "direct", consumed } as ConversionFlag,
          });
          cache.set(cacheKey, results);
          return results;
        }
      } else {
        // Middle "ん":
        // If user has typed extra "n" (i.e. remainingInput starts with "nn"),
        // then consume two letters.
        if (remainingInput.startsWith("nn")) {
          return nextLetters(index + 1, matched + 2);
        } else {
          // Otherwise, offer candidate "n" (consuming 1 letter) combined with the branch.
          const branchWithNConsumed = nextLetters(index + 1, matched + 1);
          // If the branch is complete (empty), then no candidate should be offered.
          if (branchWithNConsumed.length === 0) {
            cache.set(cacheKey, []);
            return [];
          }
          let candidates: NextKeyInfo[] = [];
          candidates.push({
            letter: "n",
            flag: { type: "direct", consumed: 1 } as ConversionFlag,
          });
          candidates.push(...branchWithNConsumed);
          cache.set(cacheKey, candidates);
          return candidates;
        }
      }
    }

    // Normal conversion via KEY_CONFIGS.
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
                const nextChar = origin.charAt(remaining.length);
                results.push({
                  letter: nextChar,
                  flag: {
                    type: "keyConfig",
                    configKey: config.key,
                    origin: origin,
                    consumed: remaining.length + 1,
                  } as ConversionFlag,
                });
              } else {
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

  const finalResult = nextLetters(0, 0);
  return finalResult;
}
export function getRomanizedTextFromTendency(
  tendencies: ConversionTendencies,
  readingText: string,
  currentInput: string
): string {
  // ひらがなかどうか判定
  function isHiragana(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096;
  }
  // 次の文字がナ行かどうか判定（「な」「に」「ぬ」「ね」「の」）
  function isNextNaRow(text: string, i: number): boolean {
    if (i + 1 >= text.length) return false;
    const next = text[i + 1];
    return ["な", "に", "ぬ", "ね", "の"].includes(next);
  }
  // 現在の出力 out が currentInput の接頭辞と一致しているかチェック
  function prefixMatches(out: string): boolean {
    if (out.length > currentInput.length) {
      return currentInput === out.slice(0, currentInput.length);
    } else {
      return out === currentInput.slice(0, out.length);
    }
  }

  const results: string[] = [];

  /**
   * 再帰関数 dfs
   * @param i 読みテキストの現在位置
   * @param dup 直前に「っ」があった場合、次のセグメントで先頭子音の重複を行う必要がある
   * @param out これまでの変換結果
   */
  function dfs(i: number, dup: boolean, out: string): void {
    // 現在の出力が currentInput の接頭辞と一致していなければ枝刈り
    if (!prefixMatches(out)) return;

    // 読みテキスト末尾なら候補として採用
    if (i >= readingText.length) {
      if (out.startsWith(currentInput)) results.push(out);
      return;
    }

    const ch = readingText[i];

    // ひらがなでない場合はそのまま出力
    if (!isHiragana(ch)) {
      dfs(i + 1, false, out + ch);
      return;
    }

    // 「っ」の処理
    if (ch === "っ") {
      // オプション1: 次の文字の子音を重複させるためdupフラグを立てる
      dfs(i + 1, true, out);
      // オプション2: 固定変換候補をそのまま出力する（"ltu","xtu","ltsu","xtsu"）
      const fixedAlternatives = ["ltu", "xtu", "ltsu", "xtsu"];
      for (const alt of fixedAlternatives) {
        dfs(i + 1, false, out + alt);
      }
      return;
    }

    // 「ん」の処理
    if (ch === "ん") {
      let candidates: string[];
      // 末尾または次がナ行なら "nn" のみ
      if (i === readingText.length - 1 || isNextNaRow(readingText, i)) {
        candidates = ["nn"];
      } else {
        candidates = ["n", "nn"];
      }
      for (const cand of candidates) {
        dfs(i + 1, false, out + cand);
      }
      return;
    }

    // 通常のひらがなについて、読みテキスト i 以降と先頭一致するすべての変換候補を試す
    for (const t of tendencies) {
      if (readingText.startsWith(t.key, i)) {
        let conv = t.tendency;
        // 直前でdupフラグが立っていれば、変換先の先頭文字を重複させる
        if (dup && conv.length > 0) {
          conv = conv.charAt(0) + conv;
        }
        dfs(i + t.key.length, false, out + conv);
      }
    }
  }

  dfs(0, false, "");

  if (results.length === 0) {
    throw new Error("入力済みのテキストと変換結果が一致しません。");
  }
  // 複数候補がある場合、currentInput以降の余分な文字数が少ないものを優先して返す
  results.sort((a, b) => {
    const extraA = a.length - currentInput.length;
    const extraB = b.length - currentInput.length;
    if (extraA === extraB) {
      return a.localeCompare(b);
    }
    return extraA - extraB;
  });
  return results[0];
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
