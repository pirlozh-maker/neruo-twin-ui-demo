import { create } from "zustand";
import type {
  CorrectionClip,
  Job,
  JobType,
  Macro,
  Recipe,
  RunResult,
  ScenarioResult,
  ScenarioSet,
  TrialMeta,
  WindowRange,
} from "../types";
import { trials } from "../mock/trials";

export type Mode = "standard" | "lab";

export type AppState = {
  currentTrial: TrialMeta;
  mode: Mode;
  activeTab: "studio" | "scenario";
  recipe: Recipe;
  macros: Macro[];
  activeMacroId: string | null;
  doWindow: WindowRange;
  playhead: number;
  runResult: RunResult | null;
  correction: CorrectionClip | null;
  correctionMode: boolean;
  correctionApplyMode: CorrectionClip["apply_mode"];
  scenarioSet: ScenarioSet | null;
  scenarioResults: ScenarioResult[];
  activeScenarioVariantId: string | null;
  isSweeping: boolean;
  sweepData: RunResult["sweep"] | null;
  jobs: Job[];
  setTrial: (trialId: string) => void;
  setMode: (mode: Mode) => void;
  setActiveTab: (tab: "studio" | "scenario") => void;
  setRecipe: (recipe: Recipe) => void;
  updateRecipe: (partial: Partial<Recipe>) => void;
  setMacros: (macros: Macro[]) => void;
  setActiveMacroId: (macroId: string | null) => void;
  setDoWindow: (window: WindowRange) => void;
  setPlayhead: (value: number) => void;
  setRunResult: (result: RunResult | null) => void;
  setCorrection: (clip: CorrectionClip | null) => void;
  setCorrectionMode: (value: boolean) => void;
  setCorrectionApplyMode: (mode: CorrectionClip["apply_mode"]) => void;
  setScenarioSet: (scenario: ScenarioSet | null) => void;
  setScenarioResults: (results: ScenarioResult[]) => void;
  setActiveScenarioVariantId: (variantId: string | null) => void;
  setSweepData: (data: RunResult["sweep"] | null) => void;
  setIsSweeping: (value: boolean) => void;
  enqueueJob: (type: JobType, label: string) => Job;
  updateJobStatus: (jobId: string, status: Job["status"]) => void;
  cancelJob: (jobId: string) => void;
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
  activeTab: "studio",
  recipe: defaultRecipe,
  macros: [
    {
      id: "macro_focus_low_noise",
      name: "Focus Low Noise",
      description: "Reduce EEG noise and tighten sync jitter.",
      recipePatch: {
        eeg: { noise_type: "white", noise_sigma: 0.6 },
        sync: { jitter_ms: 6, dropout_rate: 0.03 },
      },
    },
    {
      id: "macro_high_smoothing",
      name: "High Smoothing",
      description: "Increase smoothing for stable motion.",
      recipePatch: {
        prior: { skeleton_strength: 0.85, dynamics_smoothness: 0.85 },
      },
    },
  ],
  activeMacroId: null,
  doWindow: { t0_ms: 0, t1_ms: 1200 },
  playhead: 0,
  runResult: null,
  correction: null,
  correctionMode: false,
  correctionApplyMode: "local_fix",
  scenarioSet: null,
  scenarioResults: [],
  activeScenarioVariantId: null,
  isSweeping: false,
  sweepData: null,
  jobs: [],
  setTrial: (trialId) => {
    const trial = trials.find((item) => item.id === trialId) ?? trials[0];
    set({ currentTrial: trial });
  },
  setMode: (mode) => set({ mode }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setRecipe: (recipe) => set({ recipe }),
  updateRecipe: (partial) => set({ recipe: { ...get().recipe, ...partial } }),
  setMacros: (macros) => set({ macros }),
  setActiveMacroId: (activeMacroId) => set({ activeMacroId }),
  setDoWindow: (doWindow) => set({ doWindow }),
  setPlayhead: (playhead) => set({ playhead }),
  setRunResult: (runResult) => set({ runResult }),
  setCorrection: (correction) => set({ correction }),
  setCorrectionMode: (correctionMode) => set({ correctionMode }),
  setCorrectionApplyMode: (correctionApplyMode) => set({ correctionApplyMode }),
  setScenarioSet: (scenarioSet) => set({ scenarioSet }),
  setScenarioResults: (scenarioResults) => set({ scenarioResults }),
  setActiveScenarioVariantId: (activeScenarioVariantId) => set({ activeScenarioVariantId }),
  setSweepData: (sweepData) => set({ sweepData }),
  setIsSweeping: (isSweeping) => set({ isSweeping }),
  enqueueJob: (type, label) => {
    const job: Job = {
      id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      label,
      status: "queued",
      createdAt: Date.now(),
    };
    set({ jobs: [...get().jobs, job] });
    return job;
  },
  updateJobStatus: (jobId, status) =>
    set({
      jobs: get().jobs.map((job) => (job.id === jobId ? { ...job, status } : job)),
    }),
  cancelJob: (jobId) => {
    const job = get().jobs.find((item) => item.id === jobId);
    set({
      jobs: get().jobs.map((item) =>
        item.id === jobId ? { ...item, status: "canceled" } : item,
      ),
      isSweeping: job?.type === "sweep" ? false : get().isSweeping,
      sweepData: job?.type === "sweep" ? null : get().sweepData,
    });
  },
  resetRecipe: () => set({ recipe: defaultRecipe }),
}));
