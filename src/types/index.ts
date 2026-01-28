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

export type TwinScoreBreakdown = {
  input: number;
  sync: number;
  selfConsistency: number;
  ood: number;
};

export type TwinScore = {
  total: number;
  breakdown: TwinScoreBreakdown;
  oodLevel: "low" | "medium" | "high";
};

export type ExplainResult = {
  channels: string[];
  bands: string[];
  time_slices: string[];
};

export type RunResult = {
  runId: string;
  createdAt: string;
  latencyMs: number;
  metrics: {
    speed: number;
    phase: number;
    cadence: number;
  };
  twinScore: TwinScore;
  explain: ExplainResult;
  alerts: string[];
  sweep?: {
    x: number[];
    y: number[];
    heat: number[][];
  };
};
