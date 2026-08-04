import { describe, expect, it } from "vitest";
import { summarizeSession, WordResult } from "./scoring";

describe("summarizeSession", () => {
  it("computes totals, accuracy, and morae/sec for a clean session", () => {
    const results: WordResult[] = [
      { word: "さくら", moraeCount: 3, errorCount: 0 },
      { word: "きょう", moraeCount: 2, errorCount: 0 },
    ];
    const summary = summarizeSession(results, 10);
    expect(summary.wordsCompleted).toBe(2);
    expect(summary.totalMorae).toBe(5);
    expect(summary.totalErrors).toBe(0);
    expect(summary.accuracy).toBe(1);
    expect(summary.moraePerSecond).toBe(0.5);
  });

  it("computes accuracy as morae over (morae + errors)", () => {
    const results: WordResult[] = [{ word: "さくら", moraeCount: 3, errorCount: 1 }];
    const summary = summarizeSession(results, 5);
    expect(summary.accuracy).toBeCloseTo(3 / 4);
  });

  it("returns accuracy 1 and moraePerSecond 0 for an empty session", () => {
    const summary = summarizeSession([], 0);
    expect(summary.accuracy).toBe(1);
    expect(summary.moraePerSecond).toBe(0);
    expect(summary.totalMorae).toBe(0);
  });

  it("does not divide by zero when elapsedSeconds is 0 but morae exist", () => {
    const results: WordResult[] = [{ word: "さくら", moraeCount: 3, errorCount: 0 }];
    const summary = summarizeSession(results, 0);
    expect(summary.moraePerSecond).toBe(0);
  });
});
