export function getNextKeysOptimized(
  readingText: string,
  currentInput: string
): NextKeyInfo[] {
  const cache = new Map<string, NextKeyInfo[]>();

  function isHiragana(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096;
  }

  function isConsonant(char: string): boolean {
    return !"aiueo".includes(char.toLowerCase());
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
    const cacheKey = `${index}_${matched}_${currentInput}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;
    let results: NextKeyInfo[] = [];

    if (index >= readingText.length) {
      cache.set(cacheKey, results);
      return results;
    }

    const currentChar = readingText[index];

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

    if (currentChar === "っ") {
      const tsuConfig = KEY_CONFIGS.find((config) => config.key === "っ");
      if (tsuConfig) {
        const currentInputRemaining = currentInput.substring(matched);
        const possibleNextLetters = new Set<string>();
        let hasExactMatch = false;

        for (const origin of tsuConfig.origins) {
          if (currentInputRemaining === origin) {
            const rec = nextLetters(index + 1, matched + origin.length);
            results.push(...rec);
            hasExactMatch = true;
          } else if (origin.startsWith(currentInputRemaining)) {
            const nextChar = origin.charAt(currentInputRemaining.length);
            possibleNextLetters.add(nextChar);
          }
        }

        if (!hasExactMatch) {
          const doublingCandidates = getDoublingCandidates(index + 1);
          if (currentInputRemaining === "") {
            doublingCandidates.forEach((c) => possibleNextLetters.add(c));
          } else {
            const firstChar = currentInputRemaining[0];
            if (doublingCandidates.includes(firstChar)) {
              const rec = nextLetters(index + 1, matched + 1);
              results.push(...rec);
            }
          }
          const fixedAlternatives = ["ltu", "xtu", "ltsu", "xtsu"];
          const rawFixedCandidates = Array.from(
            new Set(fixedAlternatives.map((s) => s.charAt(0)))
          );
          if (currentInputRemaining) {
            const firstChar = currentInputRemaining[0];
            if (rawFixedCandidates.includes(firstChar)) {
              for (const alt of fixedAlternatives) {
                if (currentInputRemaining.startsWith(alt)) {
                  const rec = nextLetters(index + 1, matched + alt.length);
                  results.push(...rec);
                } else if (alt.startsWith(currentInputRemaining)) {
                  const nextChar = alt.charAt(currentInputRemaining.length);
                  possibleNextLetters.add(nextChar);
                }
              }
            }
          }
        }

        Array.from(possibleNextLetters).forEach((letter) => {
          results.push({
            letter,
            flag: {
              type: "direct",
              consumed: currentInput.substring(matched).length + 1,
            } as ConversionFlag,
          });
        });
      }

      cache.set(cacheKey, results);
      return results;
    }

    if (currentChar === "ん") {
      const remainingInput = currentInput.substring(matched);
      if (index === readingText.length - 1) {
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
        if (remainingInput.startsWith("nn")) {
          return nextLetters(index + 1, matched + 2);
        } else {
          const branchWithNConsumed = nextLetters(index + 1, matched + 1);
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

  return nextLetters(0, 0);
}

export interface ConversionTendency {
  key: string;
  tendency: string;
}
export type ConversionTendencies = ConversionTendency[];
export type ConversionFlag = {
  type: "direct" | "keyConfig";
  configKey?: string;
  origin?: string;
  consumed?: number;
};
export type NextKeyInfo = {
  letter: string;
  flag: ConversionFlag;
};

export function getRomanizedTextFromTendency(
  tendencies: ConversionTendencies,
  readingText: string,
  currentInput: string
): string {
  function isHiragana(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0x3041 && code <= 0x3096;
  }
  function isNextNaRow(text: string, i: number): boolean {
    if (i + 1 >= text.length) return false;
    const next = text[i + 1];
    return ["な", "に", "ぬ", "ね", "の"].includes(next);
  }
  function prefixMatches(out: string): boolean {
    if (out.length > currentInput.length) {
      return true;
    } else {
      return out === currentInput.slice(0, out.length);
    }
  }
  function isConsonant(char: string): boolean {
    return !"aiueoy".includes(char.toLowerCase());
  }

  type Candidate = { out: string; nonPreferred: number };

  const results: Candidate[] = [];

  function dfs(
    i: number,
    dup: boolean,
    out: string,
    nonPreferred: number
  ): void {
    if (!prefixMatches(out)) return;
    if (i >= readingText.length) {
      if (out.startsWith(currentInput)) results.push({ out, nonPreferred });
      return;
    }
    const ch = readingText[i];

    if (!isHiragana(ch)) {
      dfs(i + 1, false, out + ch, nonPreferred);
      return;
    }

    if (ch === "っ") {
      const nextIndex = i + 1;
      const doublingCandidates = (function () {
        const letters = new Set<string>();
        for (const config of KEY_CONFIGS) {
          if (readingText.startsWith(config.key, nextIndex)) {
            for (const origin of config.origins) {
              if (origin.length > 0 && isConsonant(origin.charAt(0))) {
                letters.add(origin.charAt(0));
              }
            }
          }
        }
        return Array.from(letters);
      })();
      const fixedAlternatives = ["ltu", "xtu", "ltsu", "xtsu"];
      const rawFixedCandidates = Array.from(
        new Set(fixedAlternatives.map((s) => s.charAt(0)))
      );
      const userCandidate = currentInput.charAt(out.length) || "";
      if (userCandidate) {
        if (doublingCandidates.includes(userCandidate)) {
          dfs(nextIndex, true, out, nonPreferred);
        } else if (rawFixedCandidates.includes(userCandidate)) {
          for (const alt of fixedAlternatives) {
            if (alt.charAt(0) === userCandidate) {
              dfs(nextIndex, false, out + alt, nonPreferred);
            }
          }
        } else {
          return;
        }
      } else {
        dfs(nextIndex, true, out, nonPreferred);
        for (const alt of fixedAlternatives) {
          dfs(nextIndex, false, out + alt, nonPreferred);
        }
      }
      return;
    }

    if (ch === "ん") {
      let candidates: string[];
      if (i === readingText.length - 1 || isNextNaRow(readingText, i)) {
        candidates = ["nn"];
      } else {
        candidates = ["n", "nn"];
      }
      for (const cand of candidates) {
        dfs(i + 1, false, out + cand, nonPreferred);
      }
      return;
    }

    for (const config of KEY_CONFIGS) {
      if (readingText.startsWith(config.key, i)) {
        const tendencyEntry = tendencies.find((t) => t.key === config.key);
        let candidateOrigins: string[];
        if (tendencyEntry) {
          candidateOrigins = [tendencyEntry.tendency];
          for (const origin of config.origins) {
            if (origin !== tendencyEntry.tendency) {
              candidateOrigins.push(origin);
            }
          }
        } else {
          candidateOrigins = config.origins;
        }
        for (const origin of candidateOrigins) {
          const additionalPenalty =
            tendencyEntry && origin === tendencyEntry.tendency ? 0 : 1;
          let conv = origin;
          if (dup && conv.length > 0) {
            conv = conv.charAt(0) + conv;
          }
          dfs(
            i + config.key.length,
            false,
            out + conv,
            nonPreferred + additionalPenalty
          );
        }
      }
    }
  }

  dfs(0, false, "", 0);

  if (results.length > 0) {
    results.sort((a, b) => {
      const scoreA =
        a.nonPreferred * 10000 + (a.out.length - currentInput.length);
      const scoreB =
        b.nonPreferred * 10000 + (b.out.length - currentInput.length);
      return scoreA - scoreB;
    });
    return results[0].out;
  } else {
    // 結果がない場合はKEY_CONFIGSを使って基本的なローマ字表現を生成
    return readingTextToBasicRomaji(readingText);
  }
}
function readingTextToBasicRomaji(readingText: string): string {
  let result = "";
  let i = 0;

  while (i < readingText.length) {
    let found = false;

    // 2文字以上の組み合わせを先にチェック
    for (let len = 3; len > 0; len--) {
      if (i + len <= readingText.length) {
        const key = readingText.substring(i, i + len);
        const config = KEY_CONFIGS.find((c) => c.key === key);

        if (config) {
          // 見つかった場合は最初のorigin（ローマ字表現）を使用
          result += config.origins[0];
          i += len;
          found = true;
          break;
        }
      }
    }

    // 見つからなかった場合は1文字進める
    if (!found) {
      result += readingText[i];
      i++;
    }
  }

  return result;
}

function isConsonant(char: string): boolean {
  return !"aiueoy".includes(char.toLowerCase());
}

export interface ConversionTendency {
  key: string;
  tendency: string;
}

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
    key: "ゐ",
    origins: ["wyi", "wi"],
  },
  {
    key: "ゑ",
    origins: ["wye", "we"],
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
    origins: [","],
  },
  {
    key: "。",
    origins: ["."],
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
    key: "くぁ",
    origins: ["qa", "kwa"],
  },
  {
    key: "くぃ",
    origins: ["qi", "kwi"],
  },
  {
    key: "くぇ",
    origins: ["qe"],
  },
  {
    key: "くぉ",
    origins: ["qo", "qwo"],
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
    key: "ぐぉ",
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
    key: "てゃ",
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
    origins: ["nye"],
  },
  {
    key: "にょ",
    origins: ["nyo"],
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
    origins: ["fa", "fwa", "hwa"],
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
