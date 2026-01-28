import type { ExplainResult, RunResult, TwinScore, WindowRange } from "../types";

const randomBetween = (min: number, max: number) =>
  Math.round((min + Math.random() * (max - min)) * 100) / 100;

const pickOodLevel = (score: number): TwinScore["oodLevel"] => {
  if (score > 85) return "low";
  if (score > 75) return "medium";
  if (score > 65) return "warning";
  return "high";
};

const makeExplain = (): ExplainResult => ({
  channels: ["C3", "C4", "Pz", "F3", "F4"],
  bands: ["alpha", "beta", "gamma"],
  time_slices: ["0-250ms", "250-500ms", "500-750ms"],
});

export const generateRunResult = (
  quality: "preview" | "bake",
  window: WindowRange,
  latencyMs: number,
): RunResult => {
  const total = quality === "bake" ? randomBetween(82, 95) : randomBetween(70, 88);
  const twinScore: TwinScore = {
    total,
    breakdown: {
      input: randomBetween(70, 96),
      sync: randomBetween(68, 94),
      selfConsistency: randomBetween(72, 96),
      ood: randomBetween(65, 92),
    },
    oodLevel: pickOodLevel(total),
  };

  return {
    runId: `run_${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    latencyMs,
    provenance: {
      modelVersion: "nk-2.3.1",
      dataVersion: "eeg-v5",
      recipeId: `recipe_${quality}`,
      seed: Math.floor(Math.random() * 1000),
      raw_fingerprint: `raw_${Math.floor(Math.random() * 99999)}`,
      feature_snapshot_version: "fsnap_0.3.0",
    },
    metrics: {
      speed: randomBetween(1.3, 2.2),
      phase: randomBetween(0.2, 1.0),
      cadence: randomBetween(92, 118),
    },
    twinScore,
    explain: makeExplain(),
    alerts: [
      total < 75 ? "OOD high" : "OOD nominal",
      window.t1_ms - window.t0_ms < 800 ? "short_window" : "stable_window",
      "bad_channel_ratio < 0.08",
    ],
  };
};

export const generateSweepData = () => {
  const x = Array.from({ length: 7 }, (_, i) => i * 0.5);
  const y = Array.from({ length: 6 }, (_, i) => i * 8 + 16);
  const heat = y.map(() => x.map(() => randomBetween(0.6, 0.98)));
  return { x, y, heat };
};
