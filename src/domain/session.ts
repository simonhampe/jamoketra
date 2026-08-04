import { mulberry32 } from "./random";
import { generateWord, WordConstraints } from "./generator";
import { moraCount } from "./mora";
import { WordResult } from "./scoring";

export type SessionMode = { type: "time"; seconds: number } | { type: "wordCount"; count: number };

export interface SessionConfig {
  seed: number;
  mode: SessionMode;
  wordConstraints: WordConstraints;
}

/**
 * Mode-agnostic session runner. The RNG is seeded once and advanced
 * sequentially as words complete, so the word sequence for a given seed +
 * constraints is identical regardless of session mode -- the basis for
 * reproducible, comparable rounds.
 */
export class SessionRunner {
  private readonly config: SessionConfig;
  private readonly rng: ReturnType<typeof mulberry32>;
  private readonly results: WordResult[] = [];
  private currentWordValue: string;

  constructor(config: SessionConfig) {
    this.config = config;
    this.rng = mulberry32(config.seed);
    this.currentWordValue = generateWord(this.rng, config.wordConstraints);
  }

  get currentWord(): string {
    return this.currentWordValue;
  }

  get history(): readonly WordResult[] {
    return this.results;
  }

  get wordsCompleted(): number {
    return this.results.length;
  }

  completeCurrentWord(errorCount: number): void {
    this.results.push({
      word: this.currentWordValue,
      moraeCount: moraCount(this.currentWordValue),
      errorCount,
    });
    this.currentWordValue = generateWord(this.rng, this.config.wordConstraints);
  }

  isOver(elapsedMs: number): boolean {
    if (this.config.mode.type === "time") {
      return elapsedMs >= this.config.mode.seconds * 1000;
    }
    return this.wordsCompleted >= this.config.mode.count;
  }
}
