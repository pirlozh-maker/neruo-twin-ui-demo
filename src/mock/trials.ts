import type { TrialMeta } from "../types";

export const trials: TrialMeta[] = [
  {
    id: "trial_001",
    name: "Trial 001",
    subject: "S01",
    sessionDate: "2025-01-12",
    modelVersion: "nk-2.3.1",
    dataVersion: "eeg-v5",
    recipeId: "recipe_alpha",
    seed: 42,
  },
  {
    id: "trial_002",
    name: "Trial 002",
    subject: "S02",
    sessionDate: "2025-01-18",
    modelVersion: "nk-2.3.1",
    dataVersion: "eeg-v5",
    recipeId: "recipe_beta",
    seed: 108,
  },
];
