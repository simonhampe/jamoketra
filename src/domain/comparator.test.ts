import { describe, expect, it } from "vitest";
import { compare } from "./comparator";

describe("compare", () => {
  it("reports all-correct and isComplete on an exact match", () => {
    const result = compare("さくら", "さくら");
    expect(result.isComplete).toBe(true);
    expect(result.errorCount).toBe(0);
    expect(result.moraeComparison.every((m) => m.status === "correct")).toBe(true);
  });

  it("marks not-yet-typed morae as pending and does not complete", () => {
    const result = compare("さくら", "さ");
    expect(result.isComplete).toBe(false);
    expect(result.moraeComparison.map((m) => m.status)).toEqual(["correct", "pending", "pending"]);
  });

  it("type-through: a wrong mora is recorded as an error but typing continues to be compared", () => {
    const result = compare("さくら", "さすら");
    expect(result.isComplete).toBe(false);
    expect(result.errorCount).toBe(1);
    expect(result.moraeComparison.map((m) => m.status)).toEqual(["correct", "incorrect", "correct"]);
  });

  it("does not auto-complete when typed is longer than target (extra morae)", () => {
    const result = compare("さくら", "さくらら");
    expect(result.isComplete).toBe(false);
    expect(result.errorCount).toBe(1);
    expect(result.moraeComparison[3].status).toBe("extra");
  });

  it("normalizes decomposed dakuten in typed input before comparing", () => {
    const decomposedGa = "か" + "゙" + "っこう";
    const result = compare("がっこう", decomposedGa);
    expect(result.isComplete).toBe(true);
  });

  it("folds halfwidth katakana in typed input before comparing", () => {
    const result = compare("ガッコウ", "ｶﾞｯｺｳ");
    expect(result.isComplete).toBe(true);
  });

  it("compares mora-by-mora, not character-by-character, for youon", () => {
    const result = compare("きょう", "きょう");
    expect(result.moraeComparison).toHaveLength(2);
    expect(result.isComplete).toBe(true);
  });

  it("treats an empty typed string as all-pending", () => {
    const result = compare("さくら", "");
    expect(result.errorCount).toBe(0);
    expect(result.isComplete).toBe(false);
    expect(result.moraeComparison.every((m) => m.status === "pending")).toBe(true);
  });
});
