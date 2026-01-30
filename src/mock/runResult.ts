import type { RunResult, WindowRange } from "../types";
import { runSweep, runTwinCore } from "./twinCore";

export const generateRunResult = (
  quality: "preview" | "bake",
  window: WindowRange,
  latencyMs: number,
): RunResult => {
  const runMode = quality === "preview" ? "preview" : "bake";
  const result = runTwinCore({
    trial_id: `legacy_${Date.now()}`,
    mode: "standard",
    do_window: window,
    recipe: {
      eeg: { noise_type: "white", noise_sigma: quality === "preview" ? 1.1 : 0.8, channel_mask: { mode: "group", groups: ["motor_strip_left"], explicit: [] } },
      emg: { enabled: true, gain: Array.from({ length: 8 }, () => 1), delay_ms: 40 },
      sync: { jitter_ms: 8, dropout_rate: 0.04 },
      prior: { skeleton_strength: 0.7, dynamics_smoothness: 0.6 },
      output: { quality },
    },
    seed: 7,
    runMode,
    calibrationVersion: "legacy",
  });
  return { ...result, latencyMs };
};

export const generateSweepData = () => {
  return runSweep({
    trial_id: "legacy",
    mode: "standard",
    do_window: { t0_ms: 0, t1_ms: 1200 },
    recipe: {
      eeg: { noise_type: "white", noise_sigma: 1.2, channel_mask: { mode: "group", groups: ["motor_strip_left"], explicit: [] } },
      emg: { enabled: true, gain: Array.from({ length: 8 }, () => 1), delay_ms: 40 },
      sync: { jitter_ms: 10, dropout_rate: 0.05 },
      prior: { skeleton_strength: 0.7, dynamics_smoothness: 0.6 },
      output: { quality: "preview" },
    },
    seed: 7,
    runMode: "sweep",
    calibrationVersion: "legacy",
  });
};
