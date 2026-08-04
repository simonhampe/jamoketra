import { describe, expect, it } from "vitest";
import { tokenizeMorae, moraCount } from "./mora";

describe("tokenizeMorae", () => {
  it("splits plain hiragana into one mora per character", () => {
    expect(tokenizeMorae("さくら")).toEqual(["さ", "く", "ら"]);
  });

  it("treats a youon (2 chars) as a single mora", () => {
    expect(tokenizeMorae("きょう")).toEqual(["きょ", "う"]);
  });

  it("counts っ (sokuon) as its own mora", () => {
    expect(tokenizeMorae("がっこう")).toEqual(["が", "っ", "こ", "う"]);
  });

  it("counts ー (chouon) as its own mora", () => {
    expect(tokenizeMorae("スーパー")).toEqual(["ス", "ー", "パ", "ー"]);
  });

  it("handles multiple youon in one word", () => {
    expect(tokenizeMorae("びょういん")).toEqual(["びょ", "う", "い", "ん"]);
  });

  it("does not merge a small ゃ/ゅ/ょ with a base that can't take it", () => {
    // あ cannot precede a youon small kana, so ゃ stands alone
    expect(tokenizeMorae("あゃ")).toEqual(["あ", "ゃ"]);
  });

  it("works on katakana youon the same way", () => {
    expect(tokenizeMorae("キョウ")).toEqual(["キョ", "ウ"]);
  });

  it("counts ん as its own mora", () => {
    expect(tokenizeMorae("にほん")).toEqual(["に", "ほ", "ん"]);
  });
});

describe("moraCount", () => {
  it("returns the mora length, not the character length", () => {
    expect(moraCount("きょう")).toBe(2);
    expect("きょう".length).toBe(3);
  });
});
