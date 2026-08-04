import { DAKUTEN_PAIRS, HANDAKUTEN_PAIRS } from "./kanaTables";

const COMBINING_DAKUTEN = "゙";
const COMBINING_HANDAKUTEN = "゚";

// Fallback recomposition table, keyed by "base + combining mark", for
// engines where String.prototype.normalize('NFC') doesn't fully recompose
// dakuten/handakuten (older Hermes builds without full ICU data).
const DECOMPOSED_TO_PRECOMPOSED: ReadonlyMap<string, string> = new Map([
  ...DAKUTEN_PAIRS.map(
    ([base, dakuten]) => [base + COMBINING_DAKUTEN, dakuten] as const
  ),
  ...HANDAKUTEN_PAIRS.map(
    ([base, handakuten]) => [base + COMBINING_HANDAKUTEN, handakuten] as const
  ),
]);

/**
 * NFC-normalizes hiragana input, then applies a manual fallback pass for
 * any decomposed dakuten/handakuten NFC left standing (belt and suspenders
 * against Hermes builds with incomplete Unicode normalization support).
 */
export function normalizeNFC(input: string): string {
  const nfc = input.normalize("NFC");
  let result = "";
  for (let i = 0; i < nfc.length; i++) {
    const pair = nfc[i] + (nfc[i + 1] ?? "");
    const precomposed = DECOMPOSED_TO_PRECOMPOSED.get(pair);
    if (precomposed) {
      result += precomposed;
      i++;
    } else {
      result += nfc[i];
    }
  }
  return result;
}
