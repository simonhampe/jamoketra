const HIRAGANA_START = 0x3041;
const HIRAGANA_END = 0x3096;
const KATAKANA_OFFSET = 0x60;

export function hiraganaToKatakana(input: string): string {
  return Array.from(input)
    .map((ch) => {
      const code = ch.codePointAt(0)!;
      if (code >= HIRAGANA_START && code <= HIRAGANA_END) {
        return String.fromCodePoint(code + KATAKANA_OFFSET);
      }
      return ch;
    })
    .join("");
}

export function katakanaToHiragana(input: string): string {
  const start = HIRAGANA_START + KATAKANA_OFFSET;
  const end = HIRAGANA_END + KATAKANA_OFFSET;
  return Array.from(input)
    .map((ch) => {
      const code = ch.codePointAt(0)!;
      if (code >= start && code <= end) {
        return String.fromCodePoint(code - KATAKANA_OFFSET);
      }
      return ch;
    })
    .join("");
}

// Halfwidth katakana block (U+FF66-FF9D) folded to their fullwidth
// counterparts, plus the two halfwidth voicing marks (U+FF9E/FF9F) which
// -- unlike fullwidth dakuten/handakuten -- are never precomposed and
// always arrive as a separate following character.
const HALFWIDTH_KATAKANA_BASE: ReadonlyMap<number, string> = new Map([
  [0xff66, "ヲ"], [0xff67, "ァ"], [0xff68, "ィ"], [0xff69, "ゥ"],
  [0xff6a, "ェ"], [0xff6b, "ォ"], [0xff6c, "ャ"], [0xff6d, "ュ"],
  [0xff6e, "ョ"], [0xff6f, "ッ"], [0xff70, "ー"],
  [0xff71, "ア"], [0xff72, "イ"], [0xff73, "ウ"], [0xff74, "エ"], [0xff75, "オ"],
  [0xff76, "カ"], [0xff77, "キ"], [0xff78, "ク"], [0xff79, "ケ"], [0xff7a, "コ"],
  [0xff7b, "サ"], [0xff7c, "シ"], [0xff7d, "ス"], [0xff7e, "セ"], [0xff7f, "ソ"],
  [0xff80, "タ"], [0xff81, "チ"], [0xff82, "ツ"], [0xff83, "テ"], [0xff84, "ト"],
  [0xff85, "ナ"], [0xff86, "ニ"], [0xff87, "ヌ"], [0xff88, "ネ"], [0xff89, "ノ"],
  [0xff8a, "ハ"], [0xff8b, "ヒ"], [0xff8c, "フ"], [0xff8d, "ヘ"], [0xff8e, "ホ"],
  [0xff8f, "マ"], [0xff90, "ミ"], [0xff91, "ム"], [0xff92, "メ"], [0xff93, "モ"],
  [0xff94, "ヤ"], [0xff95, "ユ"], [0xff96, "ヨ"],
  [0xff97, "ラ"], [0xff98, "リ"], [0xff99, "ル"], [0xff9a, "レ"], [0xff9b, "ロ"],
  [0xff9c, "ワ"], [0xff9d, "ン"],
]);

const HALFWIDTH_DAKUTEN_MARK = 0xff9e;
const HALFWIDTH_HANDAKUTEN_MARK = 0xff9f;

const KATAKANA_DAKUTEN_MAP: ReadonlyMap<string, string> = new Map([
  ["カ", "ガ"], ["キ", "ギ"], ["ク", "グ"], ["ケ", "ゲ"], ["コ", "ゴ"],
  ["サ", "ザ"], ["シ", "ジ"], ["ス", "ズ"], ["セ", "ゼ"], ["ソ", "ゾ"],
  ["タ", "ダ"], ["チ", "ヂ"], ["ツ", "ヅ"], ["テ", "デ"], ["ト", "ド"],
  ["ハ", "バ"], ["ヒ", "ビ"], ["フ", "ブ"], ["ヘ", "ベ"], ["ホ", "ボ"],
]);

const KATAKANA_HANDAKUTEN_MAP: ReadonlyMap<string, string> = new Map([
  ["ハ", "パ"], ["ヒ", "ピ"], ["フ", "プ"], ["ヘ", "ペ"], ["ホ", "ポ"],
]);

/**
 * Folds halfwidth katakana (ｶ, possibly followed by a halfwidth ﾞ/ﾟ) to
 * fullwidth. Deliberately not applied to the stored/committed buffer --
 * only to a working copy used for comparison -- so raw IME output stays
 * inspectable.
 */
export function foldHalfwidthKatakanaToFullwidth(input: string): string {
  const chars = Array.from(input);
  const out: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const code = chars[i].codePointAt(0)!;
    const base = HALFWIDTH_KATAKANA_BASE.get(code);
    if (base === undefined) {
      out.push(chars[i]);
      continue;
    }
    const nextCode = chars[i + 1]?.codePointAt(0);
    const dakuten = nextCode === HALFWIDTH_DAKUTEN_MARK ? KATAKANA_DAKUTEN_MAP.get(base) : undefined;
    const handakuten = nextCode === HALFWIDTH_HANDAKUTEN_MARK ? KATAKANA_HANDAKUTEN_MAP.get(base) : undefined;
    if (dakuten) {
      out.push(dakuten);
      i++;
    } else if (handakuten) {
      out.push(handakuten);
      i++;
    } else {
      out.push(base);
    }
  }
  return out.join("");
}
