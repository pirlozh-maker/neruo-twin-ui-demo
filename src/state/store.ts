import { create } from "zustand";
import type { Recipe, RunResult, TrialMeta, WindowRange } from "../types";
import { trials } from "../mock/trials";

export type Mode = "standard" | "lab";

export type AppState = {
  currentTrial: TrialMeta;
  mode: Mode;
  recipe: Recipe;
  doWindow: WindowRange;
  playhead: number;
  runResult: RunResult | null;
  isSweeping: boolean;
  sweepData: RunResult["sweep"] | null;
  setTrial: (trialId: string) => void;
  setMode: (mode: Mode) => void;
  setRecipe: (recipe: Recipe) => void;
  updateRecipe: (partial: Partial<Recipe>) => void;
  setDoWindow: (window: WindowRange) => void;
  setPlayhead: (value: number) => void;
  setRunResult: (result: RunResult | null) => void;
  setSweepData: (data: RunResult["sweep"] | null) => void;
  setIsSweeping: (value: boolean) => void;
  resetRecipe: () => void;
};

export const defaultRecipe: Recipe = {
  eeg: {
    noise_type: "white",
    noise_sigma: 1.2,
    channel_mask: {
      mode: "group",
      groups: ["motor_strip_left"],
      explicit: [],
    },
  },
  emg: {
    enabled: true,
    gain: Array.from({ length: 8 }, () => 1),
    delay_ms: 40,
  },
  sync: {
    jitter_ms: 10,
    dropout_rate: 0.05,
  },
  prior: {
    skeleton_strength: 0.7,
    dynamics_smoothness: 0.6,
  },
  output: {
    quality: "preview",
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  currentTrial: trials[0],
  mode: "standard",
  recipe: defaultRecipe,
  doWindow: { t0_ms: 0, t1_ms: 1200 },
  playhead: 0,
  runResult: null,
  isSweeping: false,
  sweepData: null,
  setTrial: (trialId) => {
    const trial = trials.find((item) => item.id === trialId) ?? trials[0];
    set({ currentTrial: trial });
  },
  setMode: (mode) => set({ mode }),
  setRecipe: (recipe) => set({ recipe }),
  updateRecipe: (partial) => set({ recipe: { ...get().recipe, ...partial } }),
  setDoWindow: (doWindow) => set({ doWindow }),
  setPlayhead: (playhead) => set({ playhead }),
  setRunResult: (runResult) => set({ runResult }),
  setSweepData: (sweepData) => set({ sweepData }),
  setIsSweeping: (isSweeping) => set({ isSweeping }),
  resetRecipe: () => set({ recipe: defaultRecipe }),
}));
