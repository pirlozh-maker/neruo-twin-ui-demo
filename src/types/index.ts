export type TrialMeta = {
  id: string;
  name: string;
  subject: string;
  sessionDate: string;
  modelVersion: string;
  dataVersion: string;
  recipeId: string;
  seed: number;
};

export type WindowRange = {
  t0_ms: number;
  t1_ms: number;
};

export type Recipe = {
  eeg: {
    noise_type: "white" | "1f";
    noise_sigma: number;
    channel_mask: {
      mode: "group" | "explicit";
      groups: Array<
        "motor_strip_left" | "motor_strip_right" | "left_hemi" | "right_hemi"
      >;
      explicit: string[];
    };
  };
  emg: {
    enabled: boolean;
    gain: number[];
    delay_ms: number;
  };
  sync: {
    jitter_ms: number;
    dropout_rate: number;
  };
  prior: {
    skeleton_strength: number;
    dynamics_smoothness: number;
  };
  output: {
    quality: "preview" | "bake";
  };
};

export type RunState =
  | "IDLE"
  | "PREVIEW_RUNNING"
  | "BAKE_RUNNING"
  | "ROLLOUT_RUNNING"
  | "SWEEP_RUNNING"
  | "EXPORTING"
  | "ERROR";

export type RunMode = "preview" | "bake" | "rollout" | "sweep";

export type TwinScoreBreakdown = {
  input: number;
  sync: number;
  selfConsistency: number;
  ood: number;
};

export type TwinScore = {
  total: number;
  breakdown: TwinScoreBreakdown;
  oodLevel: "normal" | "warning" | "high";
  trend: number[];
};

export type ExplainResult = {
  channels: Array<{ id: string; weight: number; window: WindowRange }>;
  bands: Array<{ id: string; weight: number }>;
  time_slices: Array<{ id: string; window: WindowRange; weight: number }>;
};

export type TimelineTrack = {
  id: "qc" | "twinScore" | "ood";
  values: number[];
};

export type TimelineEvent = {
  id: string;
  type: "HS" | "TO";
  time_ms: number;
};

export type TimelineMark = {
  id: string;
  label: string;
  time_ms: number;
};

export type RunResult = {
  runId: string;
  createdAt: string;
  latencyMs: number;
  mode: RunMode;
  do_window: WindowRange;
  prediction: {
    gt_pose: number[][][];
    twin_pose: number[][][];
    ci_radius: number[];
  };
  provenance: {
    modelVersion: string;
    dataVersion: string;
    recipeId: string;
    seed: number;
    raw_fingerprint: string;
    feature_snapshot_version: string;
    run_hash: string;
  };
  metrics: {
    speed: number;
    phase: number;
    cadence: number;
  };
  twinScore: TwinScore;
  ood_level: "normal" | "warning" | "high";
  explain: ExplainResult;
  alerts: Array<{
    id: string;
    label: string;
    severity: "info" | "warning" | "high";
    window: WindowRange;
  }>;
  timeline: {
    tracks: TimelineTrack[];
    events: TimelineEvent[];
    marks: TimelineMark[];
  };
  sweep?: {
    x: number[];
    y: number[];
    heat: number[][];
  };
};

export type Macro = {
  id: string;
  name: string;
  description: string;
  recipePatch: Partial<Recipe>;
};

export type ScenarioVariant = {
  id: string;
  name: string;
  recipePatch: Partial<Recipe>;
};

export type ScenarioSet = {
  id: string;
  name: string;
  horizon_ms: number;
  sample_count: number;
  baseRecipe: Recipe;
  variants: ScenarioVariant[];
};

export type ScenarioResult = {
  scenarioId: string;
  variantId: string;
  runResult: RunResult;
};

export type CorrectionClip = {
  id: string;
  time_ms: number;
  apply_mode: "local_fix" | "calibrate_hint";
  points: Array<{
    id: "RToe" | "RHeel";
    dx: number;
    dy: number;
  }>;
};

export type JobType = "bake" | "scenario" | "sweep" | "rollout";

export type JobStatus = "queued" | "running" | "canceled" | "completed";

export type Job = {
  id: string;
  type: JobType;
  label: string;
  status: JobStatus;
  createdAt: number;
};
