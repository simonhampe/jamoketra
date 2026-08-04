import { describe, expect, it } from "vitest";
import {
  hiraganaToKatakana,
  katakanaToHiragana,
  foldHalfwidthKatakanaToFullwidth,
} from "./converter";

describe("hiraganaToKatakana / katakanaToHiragana", () => {
  it("converts seion hiragana to katakana", () => {
    expect(hiraganaToKatakana("さくら")).toBe("サクラ");
  });

  it("converts dakuten/handakuten hiragana to katakana", () => {
    expect(hiraganaToKatakana("がっこう")).toBe("ガッコウ");
    expect(hiraganaToKatakana("ぱぴぷぺぽ")).toBe("パピプペポ");
  });

  it("converts youon hiragana to katakana", () => {
    expect(hiraganaToKatakana("きょう")).toBe("キョウ");
  });

  it("round-trips katakana back to hiragana", () => {
    expect(katakanaToHiragana("サクラ")).toBe("さくら");
    expect(katakanaToHiragana(hiraganaToKatakana("がっこう"))).toBe("がっこう");
  });

  it("leaves non-kana characters untouched", () => {
    expect(hiraganaToKatakana("abc123")).toBe("abc123");
  });
});

describe("foldHalfwidthKatakanaToFullwidth", () => {
  it("folds a plain halfwidth katakana character", () => {
    expect(foldHalfwidthKatakanaToFullwidth("ｱ")).toBe("ア"); // ｱ -> ア
  });

  it("folds halfwidth katakana + halfwidth dakuten mark to fullwidth voiced kana", () => {
    expect(foldHalfwidthKatakanaToFullwidth("ｶﾞ")).toBe("ガ"); // ｶﾞ -> ガ
  });

  it("folds halfwidth katakana + halfwidth handakuten mark to fullwidth semi-voiced kana", () => {
    expect(foldHalfwidthKatakanaToFullwidth("ﾊﾟ")).toBe("パ"); // ﾊﾟ -> パ
  });

  it("folds halfwidth small youon/sokuon/chouon marks", () => {
    expect(foldHalfwidthKatakanaToFullwidth("ｬ")).toBe("ャ"); // small ya
    expect(foldHalfwidthKatakanaToFullwidth("ｯ")).toBe("ッ"); // sokuon
    expect(foldHalfwidthKatakanaToFullwidth("ｰ")).toBe("ー"); // chouon
  });

  it("folds a full halfwidth word to fullwidth", () => {
    // ｶﾞｯｺｳ -> ガッコウ
    expect(foldHalfwidthKatakanaToFullwidth("ｶﾞｯｺｳ")).toBe("ガッコウ");
  });

  it("does not fold a halfwidth dakuten mark that isn't preceded by a voiceable base", () => {
    // ｱﾞ has no voiced form for ｱ, so the mark stays literal
    expect(foldHalfwidthKatakanaToFullwidth("ｱﾞ")).toBe("アﾞ");
  });

  it("leaves fullwidth and non-kana characters untouched", () => {
    expect(foldHalfwidthKatakanaToFullwidth("さくらabc")).toBe("さくらabc");
  });
});
