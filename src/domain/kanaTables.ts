/**
 * All kana data lives here as flat lists/pairs so the rest of the domain
 * layer never hand-constructs a mora — it only ever picks from these
 * pre-validated tables. That's what keeps invalid combinations (さゃ, etc.)
 * structurally impossible instead of merely "usually avoided".
 */

// The 46 seion (plain) hiragana, one mora each.
export const SEION: readonly string[] = [
  "あ", "い", "う", "え", "お",
  "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と",
  "な", "に", "ぬ", "ね", "の",
  "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も",
  "や", "ゆ", "よ",
  "ら", "り", "る", "れ", "ろ",
  "わ", "を",
  "ん",
];

// base seion -> dakuten hiragana (20 pairs)
export const DAKUTEN_PAIRS: readonly (readonly [string, string])[] = [
  ["か", "が"], ["き", "ぎ"], ["く", "ぐ"], ["け", "げ"], ["こ", "ご"],
  ["さ", "ざ"], ["し", "じ"], ["す", "ず"], ["せ", "ぜ"], ["そ", "ぞ"],
  ["た", "だ"], ["ち", "ぢ"], ["つ", "づ"], ["て", "で"], ["と", "ど"],
  ["は", "ば"], ["ひ", "び"], ["ふ", "ぶ"], ["へ", "べ"], ["ほ", "ぼ"],
];

// base seion -> handakuten hiragana (5 pairs)
export const HANDAKUTEN_PAIRS: readonly (readonly [string, string])[] = [
  ["は", "ぱ"], ["ひ", "ぴ"], ["ふ", "ぷ"], ["へ", "ぺ"], ["ほ", "ぽ"],
];

export const DAKUTEN: readonly string[] = DAKUTEN_PAIRS.map(([, d]) => d);
export const HANDAKUTEN: readonly string[] = HANDAKUTEN_PAIRS.map(([, h]) => h);

// i-column kana (seion + dakuten + handakuten) that can take a small
// ゃ/ゅ/ょ to form a youon. ぢゃ/ぢゅ/ぢょ are excluded — non-standard
// in modern Japanese orthography.
const YOUON_BASES: readonly string[] = [
  "き", "ぎ", "し", "じ", "ち", "に", "ひ", "び", "ぴ", "み", "り",
];

export const YOUON_SMALL: readonly string[] = ["ゃ", "ゅ", "ょ"];

// Every valid base+small combination, pre-built so nothing downstream
// can ever construct an invalid pairing like さ + ゃ.
export const YOUON: readonly string[] = YOUON_BASES.flatMap((base) =>
  YOUON_SMALL.map((small) => base + small)
);

export const SOKUON = "っ";
export const CHOUON = "ー";

// Morae that cannot be geminated by a preceding っ (vowel-only / nasal).
export const SOKUON_INCOMPATIBLE_FOLLOWERS: ReadonlySet<string> = new Set([
  "あ", "い", "う", "え", "お", "わ", "を", "ん", SOKUON, CHOUON,
]);
