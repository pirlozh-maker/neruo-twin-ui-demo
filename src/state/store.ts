import { create } from "zustand";
import type {
  CorrectionClip,
  Macro,
  Recipe,
  RunMode,
  RunResult,
  RunState,
  ScenarioResult,
  ScenarioSet,
  TrialMeta,
  WindowRange,
} from "../types";
import { trials } from "../mock/trials";
import { runTwinCore, runSweep } from "../mock/twinCore";

export type Mode = "standard" | "lab" | "live";

export type PageId = "studio" | "scenario" | "calibrate" | "runs" | "export";

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "danger";
};

type ExportBundle = {
  id: string;
  filename: string;
  createdAt: string;
  payload: Record<string, unknown>;
};

let progressTimer: number | null = null;

export type AppState = {
  currentTrial: TrialMeta;
  recentTrials: TrialMeta[];
  mode: Mode;
  activePage: PageId;
  recipe: Recipe;
  macros: Macro[];
  activeMacroId: string | null;
  macroChangeLog: string[];
  doWindow: WindowRange;
  playhead: number;
  runResult: RunResult | null;
  runState: RunState;
  runProgress: number;
  runStartedAt: number | null;
  runDurationMs: number;
  lastRunAt: string | null;
  lastRunMode: RunMode | null;
  lastRunId: string | null;
  runError: string | null;
  bakeNeedsRebake: boolean;
  calibrationVersion: string;
  runHistory: RunResult[];
  exports: ExportBundle[];
  toasts: Toast[];
  latestPreviewToken: string | null;
  activeRunToken: string | null;
  correction: CorrectionClip | null;
  correctionMode: boolean;
  correctionApplyMode: CorrectionClip["apply_mode"];
  scenarioSet: ScenarioSet | null;
  scenarioResults: ScenarioResult[];
  activeScenarioVariantId: string | null;
  sweepData: RunResult["sweep"] | null;
  setTrial: (trialId: string) => void;
  setMode: (mode: Mode) => void;
  setActivePage: (page: PageId) => void;
  setRecipe: (recipe: Recipe) => void;
  updateRecipe: (partial: Partial<Recipe>) => void;
  setMacros: (macros: Macro[]) => void;
  setActiveMacroId: (macroId: string | null) => void;
  setMacroChangeLog: (log: string[]) => void;
  setDoWindow: (window: WindowRange) => void;
  setPlayhead: (value: number) => void;
  setRunResult: (result: RunResult | null) => void;
  setRunState: (state: RunState) => void;
  setRunProgress: (value: number) => void;
  setBakeNeedsRebake: (value: boolean) => void;
  pushToast: (toast: Toast) => void;
  removeToast: (toastId: string) => void;
  addExport: (bundle: ExportBundle) => void;
  startRun: (mode: RunMode) => void;
  startSweep: () => void;
  cancelRun: () => void;
  setCorrection: (clip: CorrectionClip | null) => void;
  setCorrectionMode: (value: boolean) => void;
  setCorrectionApplyMode: (mode: CorrectionClip["apply_mode"]) => void;
  setCalibrationVersion: (value: string) => void;
  setScenarioSet: (scenario: ScenarioSet | null) => void;
  setScenarioResults: (results: ScenarioResult[]) => void;
  setActiveScenarioVariantId: (variantId: string | null) => void;
  setSweepData: (data: RunResult["sweep"] | null) => void;
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
  recentTrials: trials.slice(0, 2),
  mode: "standard",
  activePage: "studio",
  recipe: defaultRecipe,
  macros: [
    {
      id: "macro_motor_strip_mask",
      name: "Motor Strip Mask",
      description: "Focus motor strip channels, reduce noise, lock to left hemi.",
      recipePatch: {
        eeg: {
          noise_type: "1f",
          noise_sigma: 0.8,
          channel_mask: { mode: "group", groups: ["motor_strip_left"], explicit: [] },
        },
      },
    },
    {
      id: "macro_left_hemi_drop",
      name: "Left Hemi Drop",
      description: "Simulate left hemisphere dropouts and sync degradation.",
      recipePatch: {
        eeg: {
          noise_type: "white",
          noise_sigma: 1.5,
          channel_mask: { mode: "group", groups: ["left_hemi"], explicit: [] },
        },
        sync: { jitter_ms: 16, dropout_rate: 0.12 },
      },
    },
    {
      id: "macro_high_noise_robustness",
      name: "High Noise Robustness",
      description: "Boost smoothing + prior to stabilize in noisy conditions.",
      recipePatch: {
        prior: { skeleton_strength: 0.88, dynamics_smoothness: 0.86 },
        output: { quality: "bake" },
      },
    },
  ],
  activeMacroId: null,
  macroChangeLog: [],
  doWindow: { t0_ms: 0, t1_ms: 1200 },
  playhead: 0,
  runResult: null,
  runState: "IDLE",
  runProgress: 0,
  runStartedAt: null,
  runDurationMs: 0,
  lastRunAt: null,
  lastRunMode: null,
  lastRunId: null,
  runError: null,
  bakeNeedsRebake: false,
  calibrationVersion: "calib_0",
  runHistory: [],
  exports: [],
  toasts: [],
  latestPreviewToken: null,
  activeRunToken: null,
  correction: null,
  correctionMode: false,
  correctionApplyMode: "local_fix",
  scenarioSet: null,
  scenarioResults: [],
  activeScenarioVariantId: null,
  sweepData: null,
  setTrial: (trialId) => {
    const trial = trials.find((item) => item.id === trialId) ?? trials[0];
    const recent = get().recentTrials.filter((item) => item.id !== trial.id);
    set({ currentTrial: trial, recentTrials: [trial, ...recent].slice(0, 4) });
  },
  setMode: (mode) => set({ mode }),
  setActivePage: (activePage) => set({ activePage }),
  setRecipe: (recipe) =>
    set({
      recipe,
      bakeNeedsRebake: get().lastRunMode === "bake" ? true : get().bakeNeedsRebake,
    }),
  updateRecipe: (partial) =>
    set({
      recipe: { ...get().recipe, ...partial },
      bakeNeedsRebake: get().lastRunMode === "bake" ? true : get().bakeNeedsRebake,
    }),
  setMacros: (macros) => set({ macros }),
  setActiveMacroId: (activeMacroId) => set({ activeMacroId }),
  setMacroChangeLog: (macroChangeLog) => set({ macroChangeLog }),
  setDoWindow: (doWindow) => set({ doWindow }),
  setPlayhead: (playhead) => set({ playhead }),
  setRunResult: (runResult) =>
    set({
      runResult,
      playhead: runResult ? runResult.do_window.t0_ms : get().playhead,
    }),
  setRunState: (runState) => set({ runState }),
  setRunProgress: (runProgress) => set({ runProgress }),
  setBakeNeedsRebake: (bakeNeedsRebake) => set({ bakeNeedsRebake }),
  pushToast: (toast) => set({ toasts: [...get().toasts, toast] }),
  removeToast: (toastId) =>
    set({ toasts: get().toasts.filter((toast) => toast.id !== toastId) }),
  addExport: (bundle) => set({ exports: [bundle, ...get().exports].slice(0, 12) }),
  startRun: (runMode) => {
    const activeState = get().runState;
    if (
      activeState === "BAKE_RUNNING" ||
      activeState === "ROLLOUT_RUNNING" ||
      activeState === "SWEEP_RUNNING" ||
      activeState === "EXPORTING"
    ) {
      return;
    }
    const stateMap: Record<RunMode, RunState> = {
      preview: "PREVIEW_RUNNING",
      bake: "BAKE_RUNNING",
      rollout: "ROLLOUT_RUNNING",
      sweep: "SWEEP_RUNNING",
    };
    const runToken = `${runMode}_${Date.now()}`;
    set({
      runState: stateMap[runMode],
      runProgress: 0,
      runStartedAt: Date.now(),
      runError: null,
      activeRunToken: runToken,
      latestPreviewToken: runMode === "preview" ? runToken : get().latestPreviewToken,
    });
    const latency = runMode === "preview" ? 480 : runMode === "bake" ? 1400 : 1000;
    const startTime = Date.now();
    if (progressTimer) window.clearInterval(progressTimer);
    progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      set({ runProgress: Math.min(0.92, elapsed / latency) });
    }, 120);
    setTimeout(() => {
      if (progressTimer) window.clearInterval(progressTimer);
      progressTimer = null;
      if (get().runState !== stateMap[runMode]) return;
      if (runMode === "preview" && get().latestPreviewToken !== runToken) return;
      if (get().activeRunToken !== runToken) return;
      const { currentTrial, recipe, doWindow, mode, calibrationVersion } = get();
      const result = runTwinCore({
        trial_id: currentTrial.id,
        mode,
        do_window: doWindow,
        recipe,
        seed: currentTrial.seed,
        runMode,
        calibrationVersion,
      });
      set({
        runResult: result,
        runState: "IDLE",
        runProgress: 1,
        runDurationMs: Date.now() - startTime,
        lastRunAt: new Date().toISOString(),
        lastRunMode: runMode,
        lastRunId: result.runId,
        bakeNeedsRebake: runMode === "bake" ? false : get().bakeNeedsRebake,
        runHistory: [result, ...get().runHistory].slice(0, 12),
        playhead: result.do_window.t0_ms,
        activeRunToken: null,
      });
    }, latency);
    set({
      runHistory: get().runHistory,
    });
  },
  startSweep: () => {
    const activeState = get().runState;
    if (
      activeState === "BAKE_RUNNING" ||
      activeState === "ROLLOUT_RUNNING" ||
      activeState === "PREVIEW_RUNNING" ||
      activeState === "EXPORTING"
    ) {
      return;
    }
    set({
      runState: "SWEEP_RUNNING",
      runProgress: 0,
      runStartedAt: Date.now(),
      sweepData: null,
    });
    const startTime = Date.now();
    if (progressTimer) window.clearInterval(progressTimer);
    progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      set({ runProgress: Math.min(0.9, elapsed / 900) });
    }, 140);
    setTimeout(() => {
      if (progressTimer) window.clearInterval(progressTimer);
      progressTimer = null;
      if (get().runState !== "SWEEP_RUNNING") return;
      const { currentTrial, recipe, doWindow, mode, calibrationVersion } = get();
      const sweep = runSweep({
        trial_id: currentTrial.id,
        mode,
        do_window: doWindow,
        recipe,
        seed: currentTrial.seed,
        runMode: "sweep",
        calibrationVersion,
      });
      set({
        sweepData: sweep,
        runProgress: 1,
        runState: "IDLE",
        runDurationMs: Date.now() - startTime,
        lastRunAt: new Date().toISOString(),
        lastRunMode: "sweep",
      });
    }, 900);
  },
  cancelRun: () => {
    const { runState } = get();
    if (runState === "IDLE") return;
    if (progressTimer) window.clearInterval(progressTimer);
    progressTimer = null;
    set({
      runState: "IDLE",
      runProgress: 0,
      runError: null,
      runStartedAt: null,
      activeRunToken: null,
      latestPreviewToken: null,
    });
  },
  setCorrection: (correction) => set({ correction }),
  setCorrectionMode: (correctionMode) => set({ correctionMode }),
  setCorrectionApplyMode: (correctionApplyMode) => set({ correctionApplyMode }),
  setCalibrationVersion: (calibrationVersion) => set({ calibrationVersion }),
  setScenarioSet: (scenarioSet) => set({ scenarioSet }),
  setScenarioResults: (scenarioResults) => set({ scenarioResults }),
  setActiveScenarioVariantId: (activeScenarioVariantId) => set({ activeScenarioVariantId }),
  setSweepData: (sweepData) => set({ sweepData }),
  resetRecipe: () => set({ recipe: defaultRecipe }),
}));
