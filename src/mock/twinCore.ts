import type {
  ExplainResult,
  Recipe,
  RunMode,
  RunResult,
  TimelineEvent,
  TimelineMark,
  TimelineTrack,
  TwinScore,
  WindowRange,
} from "../types";
import { createRng, hashString, stableStringify } from "../utils/hash";

type TwinCoreInput = {
  trial_id: string;
  mode: "standard" | "lab" | "live";
  do_window: WindowRange;
  recipe: Recipe;
  seed: number;
  runMode: RunMode;
  calibrationVersion: string;
};

const frameCountForWindow = (window: WindowRange) =>
  Math.max(48, Math.round((window.t1_ms - window.t0_ms) / 40));

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const makeTimelineTracks = (rng: () => number, frames: number): TimelineTrack[] => {
  const makeValues = (base: number, jitter: number) =>
    Array.from({ length: frames }, (_, i) =>
      clamp(base + Math.sin(i / 6) * jitter + (rng() - 0.5) * jitter, 0, 100),
    );
  return [
    { id: "qc", values: makeValues(80, 12) },
    { id: "twinScore", values: makeValues(75, 18) },
    { id: "ood", values: makeValues(35, 22) },
  ];
};

const makeEvents = (rng: () => number, window: WindowRange): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const count = 4;
  for (let i = 0; i < count; i += 1) {
    const t = window.t0_ms + rng() * (window.t1_ms - window.t0_ms);
    events.push({
      id: `evt_${i}`,
      type: i % 2 === 0 ? "HS" : "TO",
      time_ms: Math.round(t),
    });
  }
  return events.sort((a, b) => a.time_ms - b.time_ms);
};

const makeMarks = (rng: () => number, window: WindowRange): TimelineMark[] => [
  {
    id: "mark_1",
    label: "Intervention",
    time_ms: Math.round(window.t0_ms + (window.t1_ms - window.t0_ms) * 0.35),
  },
  {
    id: "mark_2",
    label: "Stride reset",
    time_ms: Math.round(window.t0_ms + (window.t1_ms - window.t0_ms) * (0.6 + rng() * 0.2)),
  },
];

const makeExplain = (rng: () => number, window: WindowRange): ExplainResult => ({
  channels: ["C3", "C4", "Pz", "F3", "F4"].map((id) => ({
    id,
    weight: Math.round((0.55 + rng() * 0.4) * 100) / 100,
    window: {
      t0_ms: Math.round(window.t0_ms + rng() * 400),
      t1_ms: Math.round(window.t0_ms + 400 + rng() * 400),
    },
  })),
  bands: ["alpha", "beta", "gamma", "theta"].map((id) => ({
    id,
    weight: Math.round((0.4 + rng() * 0.5) * 100) / 100,
  })),
  time_slices: ["0-250ms", "250-500ms", "500-750ms", "750-1000ms"].map((id) => {
    const offset = rng() * (window.t1_ms - window.t0_ms - 300);
    return {
      id,
      weight: Math.round((0.5 + rng() * 0.45) * 100) / 100,
      window: { t0_ms: Math.round(window.t0_ms + offset), t1_ms: Math.round(window.t0_ms + offset + 280) },
    };
  }),
});

const makeTwinScore = (
  rng: () => number,
  noiseSigma: number,
  syncJitter: number,
): TwinScore => {
  const base = clamp(90 - noiseSigma * 8 - syncJitter * 0.6, 50, 96);
  const total = Math.round((base + (rng() - 0.5) * 8) * 10) / 10;
  const breakdown = {
    input: clamp(Math.round((base + (rng() - 0.5) * 10) * 10) / 10, 40, 98),
    sync: clamp(Math.round((base + (rng() - 0.5) * 9) * 10) / 10, 40, 98),
    selfConsistency: clamp(Math.round((base + (rng() - 0.5) * 9) * 10) / 10, 40, 98),
    ood: clamp(Math.round((base - noiseSigma * 4 + (rng() - 0.5) * 10) * 10) / 10, 30, 98),
  };
  const oodLevel = total > 82 ? "normal" : total > 70 ? "warning" : "high";
  return {
    total,
    breakdown,
    oodLevel,
    trend: Array.from({ length: 12 }, () =>
      clamp(Math.round((total + (rng() - 0.5) * 12) * 10) / 10, 40, 99),
    ),
  };
};

const makePrediction = (
  rng: () => number,
  frames: number,
  joints: number,
  noiseSigma: number,
) => {
  const gt_pose: number[][][] = [];
  const twin_pose: number[][][] = [];
  const ci_radius: number[] = [];
  for (let t = 0; t < frames; t += 1) {
    const gtFrame: number[][] = [];
    const twinFrame: number[][] = [];
    const phase = t / frames;
    const baseNoise = noiseSigma * (0.8 + rng() * 0.6);
    ci_radius.push(Math.round((0.12 + baseNoise * 0.06) * 1000) / 1000);
    for (let j = 0; j < joints; j += 1) {
      const angle = (j / joints) * Math.PI * 2 + phase * 0.6;
      const radius = 0.6 + (j % 5) * 0.05;
      const gt = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.sin(phase * 2 + j * 0.1) * 0.2,
      ];
      const twin = [
        gt[0] + (rng() - 0.5) * baseNoise * 0.12,
        gt[1] + (rng() - 0.5) * baseNoise * 0.12,
        gt[2] + (rng() - 0.5) * baseNoise * 0.08,
      ];
      gtFrame.push(gt.map((value) => Math.round(value * 1000) / 1000));
      twinFrame.push(twin.map((value) => Math.round(value * 1000) / 1000));
    }
    gt_pose.push(gtFrame);
    twin_pose.push(twinFrame);
  }
  return { gt_pose, twin_pose, ci_radius };
};

export const runTwinCore = (input: TwinCoreInput): RunResult => {
  const signature = stableStringify(input);
  const seed = hashString(signature);
  const rng = createRng(seed);
  const frames = frameCountForWindow(input.do_window);
  const joints = 53;
  const noiseSigma = input.recipe.eeg.noise_sigma + (input.calibrationVersion ? 0.1 : 0);
  const syncJitter = input.recipe.sync.jitter_ms;

  const twinScore = makeTwinScore(rng, noiseSigma, syncJitter);
  const ood_level = twinScore.oodLevel;
  const prediction = makePrediction(rng, frames, joints, noiseSigma);
  const tracks = makeTimelineTracks(rng, frames);
  const events = makeEvents(rng, input.do_window);
  const marks = makeMarks(rng, input.do_window);
  const explain = makeExplain(rng, input.do_window);

  const alerts = [
    {
      id: "ood",
      label: ood_level === "high" ? "OOD high risk" : "OOD nominal",
      severity: ood_level === "high" ? "high" : ood_level === "warning" ? "warning" : "info",
      window: input.do_window,
    },
    {
      id: "bad_channel_ratio",
      label: noiseSigma > 1.4 ? "bad_channel_ratio > 0.18" : "bad_channel_ratio < 0.1",
      severity: noiseSigma > 1.4 ? "warning" : "info",
      window: {
        t0_ms: input.do_window.t0_ms,
        t1_ms: Math.min(input.do_window.t1_ms, input.do_window.t0_ms + 400),
      },
    },
    {
      id: "monotonicity",
      label: syncJitter > 12 ? "monotonicity drift" : "monotonicity stable",
      severity: syncJitter > 12 ? "warning" : "info",
      window: {
        t0_ms: input.do_window.t0_ms + 320,
        t1_ms: Math.min(input.do_window.t1_ms, input.do_window.t0_ms + 720),
      },
    },
  ];

  return {
    runId: `run_${seed.toString(16).slice(0, 6)}`,
    createdAt: new Date().toISOString(),
    latencyMs: Math.round(320 + rng() * 480),
    mode: input.runMode,
    do_window: input.do_window,
    prediction,
    provenance: {
      modelVersion: "nk-2.4.0",
      dataVersion: "eeg-v6",
      recipeId: input.recipe.output.quality,
      seed: input.seed,
      raw_fingerprint: `raw_${input.trial_id}`,
      feature_snapshot_version: "fsnap_0.4.0",
      run_hash: `hash_${seed.toString(16)}`,
    },
    metrics: {
      speed: Math.round((1.4 + rng() * 1.1) * 100) / 100,
      phase: Math.round((0.2 + rng() * 0.8) * 100) / 100,
      cadence: Math.round(86 + rng() * 28),
    },
    twinScore,
    ood_level,
    explain,
    alerts,
    timeline: { tracks, events, marks },
  };
};

export const runSweep = (input: TwinCoreInput): RunResult["sweep"] => {
  const seed = hashString(stableStringify({ ...input, runMode: "sweep" }));
  const rng = createRng(seed);
  const x = Array.from({ length: 7 }, (_, i) => i * 0.4 + 0.6);
  const y = Array.from({ length: 6 }, (_, i) => i * 6 + 18);
  const heat = y.map(() => x.map(() => Math.round((0.6 + rng() * 0.35) * 100) / 100));
  return { x, y, heat };
};
