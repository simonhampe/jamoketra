import { hiraganaToKatakana } from "./converter";

// i-column kana (hiragana and katakana) that can be followed by a small
// ゃ/ゅ/ょ to form a single two-character youon mora.
const YOUON_CAPABLE_HIRAGANA = ["き", "ぎ", "し", "じ", "ち", "に", "ひ", "び", "ぴ", "み", "り"];
const YOUON_CAPABLE: ReadonlySet<string> = new Set([
  ...YOUON_CAPABLE_HIRAGANA,
  ...YOUON_CAPABLE_HIRAGANA.map(hiraganaToKatakana),
]);

const YOUON_SMALL: ReadonlySet<string> = new Set(["ゃ", "ゅ", "ょ", "ャ", "ュ", "ョ"]);

/**
 * Splits a kana string into morae. A youon (きゃ) is one mora made of two
 * characters; everything else (including っ and ー) is one character = one
 * mora. Works on hiragana or katakana input.
 */
export function tokenizeMorae(kana: string): string[] {
  const chars = Array.from(kana);
  const morae: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const current = chars[i];
    const next = chars[i + 1];
    if (next && YOUON_SMALL.has(next) && YOUON_CAPABLE.has(current)) {
      morae.push(current + next);
      i++;
    } else {
      morae.push(current);
    }
  }
  return morae;
}

export function moraCount(kana: string): number {
  return tokenizeMorae(kana).length;
}
