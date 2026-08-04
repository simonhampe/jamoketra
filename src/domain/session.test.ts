import { describe, expect, it } from "vitest";
import { SessionRunner, SessionConfig } from "./session";
import { WordConstraints } from "./generator";

const wordConstraints: WordConstraints = {
  moraeLength: 3,
  hasDakuten: true,
  hasHandakuten: true,
  hasYouon: true,
  hasSokuon: true,
  hasChouon: true,
  script: "hiragana",
};

describe("SessionRunner", () => {
  it("ends a time-mode session once elapsed time reaches the limit", () => {
    const config: SessionConfig = { seed: 1, mode: { type: "time", seconds: 60 }, wordConstraints };
    const runner = new SessionRunner(config);
    expect(runner.isOver(59_000)).toBe(false);
    expect(runner.isOver(60_000)).toBe(true);
    expect(runner.isOver(61_000)).toBe(true);
  });

  it("ends a wordCount-mode session once enough words are completed", () => {
    const config: SessionConfig = { seed: 1, mode: { type: "wordCount", count: 3 }, wordConstraints };
    const runner = new SessionRunner(config);
    expect(runner.isOver(999_999)).toBe(false);
    runner.completeCurrentWord(0);
    runner.completeCurrentWord(0);
    expect(runner.isOver(0)).toBe(false);
    runner.completeCurrentWord(0);
    expect(runner.isOver(0)).toBe(true);
    expect(runner.wordsCompleted).toBe(3);
  });

  it("advances to a new current word after completing one, and records history", () => {
    const config: SessionConfig = { seed: 1, mode: { type: "wordCount", count: 5 }, wordConstraints };
    const runner = new SessionRunner(config);
    const first = runner.currentWord;
    runner.completeCurrentWord(2);
    expect(runner.currentWord).not.toBe(first);
    expect(runner.history).toHaveLength(1);
    expect(runner.history[0].word).toBe(first);
    expect(runner.history[0].errorCount).toBe(2);
  });

  it("produces the same word sequence for the same seed regardless of session mode", () => {
    const timeRunner = new SessionRunner({ seed: 42, mode: { type: "time", seconds: 999 }, wordConstraints });
    const countRunner = new SessionRunner({ seed: 42, mode: { type: "wordCount", count: 999 }, wordConstraints });

    const timeWords: string[] = [];
    const countWords: string[] = [];
    for (let i = 0; i < 10; i++) {
      timeWords.push(timeRunner.currentWord);
      timeRunner.completeCurrentWord(0);
      countWords.push(countRunner.currentWord);
      countRunner.completeCurrentWord(0);
    }
    expect(timeWords).toEqual(countWords);
  });
});
