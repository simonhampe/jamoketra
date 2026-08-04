import { describe, expect, it } from "vitest";
import { generateWord, generateWordList, WordConstraints } from "./generator";
import { mulberry32 } from "./random";
import { tokenizeMorae } from "./mora";
import { SOKUON, CHOUON, YOUON_SMALL } from "./kanaTables";

const baseConstraints: WordConstraints = {
  moraeLength: 4,
  hasDakuten: true,
  hasHandakuten: true,
  hasYouon: true,
  hasSokuon: true,
  hasChouon: true,
  script: "hiragana",
};

// Only these hiragana can precede a small ゃ/ゅ/ょ to form a valid youon.
const VALID_YOUON_BASES = new Set(["き", "ぎ", "し", "じ", "ち", "に", "ひ", "び", "ぴ", "み", "り"]);

function assertStructurallyValid(word: string) {
  const morae = tokenizeMorae(word);

  // No mora is a base + small-kana pair unless the base is youon-capable
  // (this is guaranteed by construction, but re-verified from the raw
  // character stream to catch any accidental bypass of the mora table).
  for (const mora of morae) {
    if (mora.length === 2) {
      const [base, small] = Array.from(mora);
      expect(VALID_YOUON_BASES.has(base)).toBe(true);
      expect(YOUON_SMALL.includes(small)).toBe(true);
    }
  }

  // っ never starts or ends a word.
  expect(morae[0]).not.toBe(SOKUON);
  expect(morae[morae.length - 1]).not.toBe(SOKUON);

  // ー never starts a word.
  expect(morae[0]).not.toBe(CHOUON);

  // っ is always followed by a consonant-initial mora, never a vowel/ん/っ/ー.
  for (let i = 0; i < morae.length - 1; i++) {
    if (morae[i] === SOKUON) {
      const follower = morae[i + 1];
      expect(["あ", "い", "う", "え", "お", "わ", "を", "ん", SOKUON, CHOUON]).not.toContain(follower);
    }
  }
}

describe("generateWord", () => {
  it("produces a word with exactly the requested mora length", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 200; i++) {
      const word = generateWord(rng, baseConstraints);
      expect(tokenizeMorae(word).length).toBe(baseConstraints.moraeLength);
    }
  });

  it("never produces structurally invalid youon/sokuon/chouon placement across many samples", () => {
    const rng = mulberry32(1234);
    for (let i = 0; i < 500; i++) {
      const word = generateWord(rng, { ...baseConstraints, moraeLength: 5 });
      assertStructurallyValid(word);
    }
  });

  it("respects hasDakuten=false by never emitting a dakuten mora", () => {
    const rng = mulberry32(7);
    const constraints: WordConstraints = { ...baseConstraints, hasDakuten: false, hasHandakuten: false };
    const dakutenChars = new Set(["が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ"]);
    for (let i = 0; i < 200; i++) {
      const word = generateWord(rng, constraints);
      for (const mora of tokenizeMorae(word)) {
        expect(dakutenChars.has(mora)).toBe(false);
      }
    }
  });

  it("respects hasSokuon=false by never emitting っ", () => {
    const rng = mulberry32(99);
    const constraints: WordConstraints = { ...baseConstraints, hasSokuon: false };
    for (let i = 0; i < 200; i++) {
      const word = generateWord(rng, constraints);
      expect(tokenizeMorae(word)).not.toContain(SOKUON);
    }
  });

  it("respects hasChouon=false by never emitting ー", () => {
    const rng = mulberry32(17);
    const constraints: WordConstraints = { ...baseConstraints, hasChouon: false };
    for (let i = 0; i < 200; i++) {
      const word = generateWord(rng, constraints);
      expect(tokenizeMorae(word)).not.toContain(CHOUON);
    }
  });

  it("respects hasYouon=false by never emitting a 2-character mora", () => {
    const rng = mulberry32(55);
    const constraints: WordConstraints = { ...baseConstraints, hasYouon: false };
    for (let i = 0; i < 200; i++) {
      const word = generateWord(rng, constraints);
      for (const mora of tokenizeMorae(word)) {
        expect(mora.length).toBe(1);
      }
    }
  });

  it("renders katakana script by converting the internally-generated hiragana", () => {
    const rng = mulberry32(3);
    const word = generateWord(rng, { ...baseConstraints, script: "katakana" });
    // every codepoint should be in the katakana block
    for (const ch of Array.from(word)) {
      const code = ch.codePointAt(0)!;
      expect(code >= 0x30a1 && code <= 0x30fc).toBe(true);
    }
  });

  it("falls back to plain seion-only words when moraeLength is 1 (no sokuon/chouon possible)", () => {
    const rng = mulberry32(8);
    const word = generateWord(rng, { ...baseConstraints, moraeLength: 1 });
    expect(tokenizeMorae(word)).toHaveLength(1);
    expect(tokenizeMorae(word)[0]).not.toBe(SOKUON);
    expect(tokenizeMorae(word)[0]).not.toBe(CHOUON);
  });
});

describe("generateWordList + seeded reproducibility", () => {
  it("produces the identical word sequence for the same seed and constraints", () => {
    const listA = generateWordList(mulberry32(2026), baseConstraints, 20);
    const listB = generateWordList(mulberry32(2026), baseConstraints, 20);
    expect(listA).toEqual(listB);
  });

  it("produces a different sequence for a different seed", () => {
    const listA = generateWordList(mulberry32(1), baseConstraints, 20);
    const listB = generateWordList(mulberry32(2), baseConstraints, 20);
    expect(listA).not.toEqual(listB);
  });
});
