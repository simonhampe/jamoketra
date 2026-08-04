import { normalizeNFC } from "./normalizer";
import { foldHalfwidthKatakanaToFullwidth } from "./converter";
import { tokenizeMorae } from "./mora";

export type MoraStatus = "correct" | "incorrect" | "pending" | "extra";

export interface MoraComparison {
  mora: string;
  status: MoraStatus;
}

export interface ComparisonResult {
  moraeComparison: MoraComparison[];
  errorCount: number;
  isComplete: boolean;
}

/**
 * Mora-based, type-through comparison: never rejects input, just reports
 * per-mora status against the target so the UI can auto-advance on a full
 * match and colour everything else along the way.
 */
export function compare(target: string, typedRaw: string): ComparisonResult {
  const typed = foldHalfwidthKatakanaToFullwidth(normalizeNFC(typedRaw));
  const targetMorae = tokenizeMorae(target);
  const typedMorae = tokenizeMorae(typed);

  const length = Math.max(targetMorae.length, typedMorae.length);
  const moraeComparison: MoraComparison[] = [];
  let errorCount = 0;

  for (let i = 0; i < length; i++) {
    const t = targetMorae[i];
    const u = typedMorae[i];
    if (t === undefined) {
      moraeComparison.push({ mora: u, status: "extra" });
      errorCount++;
    } else if (u === undefined) {
      moraeComparison.push({ mora: t, status: "pending" });
    } else if (u === t) {
      moraeComparison.push({ mora: t, status: "correct" });
    } else {
      moraeComparison.push({ mora: t, status: "incorrect" });
      errorCount++;
    }
  }

  const isComplete =
    typedMorae.length === targetMorae.length &&
    typedMorae.every((m, i) => m === targetMorae[i]);

  return { moraeComparison, errorCount, isComplete };
}
