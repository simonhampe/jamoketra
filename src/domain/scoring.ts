export interface WordResult {
  word: string;
  moraeCount: number;
  errorCount: number;
}

export interface SessionSummary {
  wordsCompleted: number;
  totalMorae: number;
  totalErrors: number;
  accuracy: number;
  moraePerSecond: number;
}

export function summarizeSession(
  results: readonly WordResult[],
  elapsedSeconds: number
): SessionSummary {
  const totalMorae = results.reduce((sum, r) => sum + r.moraeCount, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);
  const attempted = totalMorae + totalErrors;

  return {
    wordsCompleted: results.length,
    totalMorae,
    totalErrors,
    accuracy: attempted === 0 ? 1 : totalMorae / attempted,
    moraePerSecond: elapsedSeconds <= 0 ? 0 : totalMorae / elapsedSeconds,
  };
}
