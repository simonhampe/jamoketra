import { create } from "zustand";
import * as Haptics from "expo-haptics";
import { SessionRunner, SessionConfig, SessionMode } from "@/domain/session";
import { compare, ComparisonResult } from "@/domain/comparator";
import { summarizeSession, SessionSummary } from "@/domain/scoring";
import { WordConstraints } from "@/domain/generator";

export type SessionStatus = "idle" | "running" | "finished";

export interface DebugEvent {
  elapsedMs: number;
  rawLength: number;
}

export const DEFAULT_WORD_CONSTRAINTS: WordConstraints = {
  moraeLength: 3,
  hasDakuten: true,
  hasHandakuten: true,
  hasYouon: true,
  hasSokuon: true,
  hasChouon: true,
  script: "hiragana",
};

export const DEFAULT_SESSION_MODE: SessionMode = { type: "time", seconds: 60 };

const MAX_DEBUG_EVENTS = 200;

interface SessionState {
  status: SessionStatus;
  runner: SessionRunner | null;
  committedOffset: number;
  startedAt: number;
  elapsedMs: number;
  comparison: ComparisonResult | null;
  summary: SessionSummary | null;
  debugEvents: DebugEvent[];

  startSession: () => void;
  onBufferChange: (raw: string) => void;
  tick: () => void;
  reset: () => void;
}

function emptyComparison(target: string): ComparisonResult {
  return compare(target, "");
}

export const useSessionStore = create<SessionState>((set, get) => ({
  status: "idle",
  runner: null,
  committedOffset: 0,
  startedAt: 0,
  elapsedMs: 0,
  comparison: null,
  summary: null,
  debugEvents: [],

  startSession: () => {
    const runner = new SessionRunner({
      seed: Date.now(),
      mode: DEFAULT_SESSION_MODE,
      wordConstraints: DEFAULT_WORD_CONSTRAINTS,
    });
    set({
      status: "running",
      runner,
      committedOffset: 0,
      startedAt: Date.now(),
      elapsedMs: 0,
      comparison: emptyComparison(runner.currentWord),
      summary: null,
      debugEvents: [],
    });
  },

  onBufferChange: (raw: string) => {
    const { runner, committedOffset, status, startedAt, comparison: prevComparison, debugEvents } = get();
    if (!runner || status !== "running") return;

    const elapsedMs = Date.now() - startedAt;
    const nextDebugEvents = [...debugEvents, { elapsedMs, rawLength: raw.length }].slice(-MAX_DEBUG_EVENTS);

    const typedSoFar = raw.slice(committedOffset);
    let comparison = compare(runner.currentWord, typedSoFar);

    if (comparison.errorCount > (prevComparison?.errorCount ?? 0)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    let nextCommittedOffset = committedOffset;
    if (comparison.isComplete) {
      runner.completeCurrentWord(comparison.errorCount);
      nextCommittedOffset = raw.length;
      comparison = emptyComparison(runner.currentWord);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    const isOver = runner.isOver(elapsedMs);
    if (isOver) {
      set({
        status: "finished",
        comparison,
        committedOffset: nextCommittedOffset,
        elapsedMs,
        debugEvents: nextDebugEvents,
        summary: summarizeSession(runner.history, elapsedMs / 1000),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      return;
    }

    set({
      comparison,
      committedOffset: nextCommittedOffset,
      elapsedMs,
      debugEvents: nextDebugEvents,
    });
  },

  tick: () => {
    const { runner, status, startedAt } = get();
    if (!runner || status !== "running") return;
    const elapsedMs = Date.now() - startedAt;
    if (runner.isOver(elapsedMs)) {
      set({
        status: "finished",
        elapsedMs,
        summary: summarizeSession(runner.history, elapsedMs / 1000),
      });
      return;
    }
    set({ elapsedMs });
  },

  reset: () => {
    set({
      status: "idle",
      runner: null,
      committedOffset: 0,
      startedAt: 0,
      elapsedMs: 0,
      comparison: null,
      summary: null,
      debugEvents: [],
    });
  },
}));
