import {
  SEION,
  DAKUTEN,
  HANDAKUTEN,
  YOUON,
  SOKUON,
  CHOUON,
  SOKUON_INCOMPATIBLE_FOLLOWERS,
} from "./kanaTables";
import { hiraganaToKatakana } from "./converter";
import { RNG, pickRandom } from "./random";

export interface WordConstraints {
  moraeLength: number;
  hasDakuten: boolean;
  hasHandakuten: boolean;
  hasYouon: boolean;
  hasSokuon: boolean;
  hasChouon: boolean;
  script: "hiragana" | "katakana";
}

function buildPool(constraints: WordConstraints): string[] {
  const pool = [...SEION];
  if (constraints.hasDakuten) pool.push(...DAKUTEN);
  if (constraints.hasHandakuten) pool.push(...HANDAKUTEN);
  if (constraints.hasYouon) pool.push(...YOUON);
  if (constraints.hasSokuon) pool.push(SOKUON);
  if (constraints.hasChouon) pool.push(CHOUON);
  return pool;
}

function isValidAt(
  candidate: string,
  index: number,
  length: number,
  previous: string | undefined
): boolean {
  if (index === 0 && (candidate === SOKUON || candidate === CHOUON)) {
    return false;
  }
  if (index === length - 1 && candidate === SOKUON) {
    return false;
  }
  if (previous === SOKUON && SOKUON_INCOMPATIBLE_FOLLOWERS.has(candidate)) {
    return false;
  }
  if (previous === CHOUON && (candidate === CHOUON || candidate === SOKUON)) {
    return false;
  }
  return true;
}

/**
 * Generates one word (in hiragana, internally) satisfying the given
 * constraints, then renders it to the requested script. Every mora is
 * drawn from pre-validated tables (kanaTables.ts) and checked against
 * positional rules -- no youon/sokuon/chouon combination can slip through
 * that wasn't explicitly allowed.
 */
export function generateWord(rng: RNG, constraints: WordConstraints): string {
  const pool = buildPool(constraints);
  const morae: string[] = [];

  for (let i = 0; i < constraints.moraeLength; i++) {
    const previous = morae[i - 1];
    const candidates = pool.filter((c) => isValidAt(c, i, constraints.moraeLength, previous));
    if (candidates.length === 0) {
      throw new Error(
        `generateWord: no valid mora at position ${i} for the given constraints`
      );
    }
    morae.push(pickRandom(rng, candidates));
  }

  const hiragana = morae.join("");
  return constraints.script === "katakana" ? hiraganaToKatakana(hiragana) : hiragana;
}

export function generateWordList(
  rng: RNG,
  constraints: WordConstraints,
  count: number
): string[] {
  return Array.from({ length: count }, () => generateWord(rng, constraints));
}
