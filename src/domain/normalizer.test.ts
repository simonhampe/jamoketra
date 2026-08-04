import { describe, expect, it } from "vitest";
import { normalizeNFC } from "./normalizer";
import { DAKUTEN_PAIRS, HANDAKUTEN_PAIRS } from "./kanaTables";

const COMBINING_DAKUTEN = "゙";
const COMBINING_HANDAKUTEN = "゚";

describe("normalizeNFC", () => {
  it("recomposes a decomposed dakuten sequence (base + U+3099) into precomposed が", () => {
    const decomposed = "か" + COMBINING_DAKUTEN;
    expect(decomposed).not.toBe("が"); // sanity: input really is two codepoints
    expect(normalizeNFC(decomposed)).toBe("が");
  });

  it("recomposes a decomposed handakuten sequence (base + U+309A) into precomposed ぱ", () => {
    const decomposed = "は" + COMBINING_HANDAKUTEN;
    expect(decomposed).not.toBe("ぱ");
    expect(normalizeNFC(decomposed)).toBe("ぱ");
  });

  it("leaves already-precomposed dakuten untouched", () => {
    expect(normalizeNFC("が")).toBe("が");
  });

  it("recomposes every dakuten pair from the table", () => {
    for (const [base, dakuten] of DAKUTEN_PAIRS) {
      expect(normalizeNFC(base + COMBINING_DAKUTEN)).toBe(dakuten);
    }
  });

  it("recomposes every handakuten pair from the table", () => {
    for (const [base, handakuten] of HANDAKUTEN_PAIRS) {
      expect(normalizeNFC(base + COMBINING_HANDAKUTEN)).toBe(handakuten);
    }
  });

  it("recomposes within a longer word without disturbing surrounding kana", () => {
    const decomposed = "か" + COMBINING_DAKUTEN + "っこう";
    expect(normalizeNFC(decomposed)).toBe("がっこう");
  });

  it("is a no-op for plain kana with no dakuten", () => {
    expect(normalizeNFC("さくら")).toBe("さくら");
  });
});
