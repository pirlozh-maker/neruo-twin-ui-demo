import type { Recipe, RunResult, TrialMeta } from "../types";

export const downloadJson = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportBundle = (
  recipe: Recipe,
  runResult: RunResult | null,
  trial: TrialMeta,
) => {
  const provenance = {
    modelVersion: trial.modelVersion,
    dataVersion: trial.dataVersion,
    recipeId: trial.recipeId,
    seed: trial.seed,
    run_hash: `${trial.id}-${Date.now()}`,
  };

  downloadJson("neurokine_bundle.json", {
    recipe,
    run_result: runResult,
    provenance,
  });
};
