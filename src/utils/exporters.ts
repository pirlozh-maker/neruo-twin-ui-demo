import type { CorrectionClip, Macro, Recipe, RunResult, ScenarioSet, TrialMeta } from "../types";

export const downloadJson = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportBundle = (params: {
  recipe: Recipe;
  runResult: RunResult | null;
  trial: TrialMeta;
  macros: Macro[];
  scenarioSet: ScenarioSet | null;
  correction: CorrectionClip | null;
}) => {
  const { recipe, runResult, trial, macros, scenarioSet, correction } = params;
  const provenance = {
    modelVersion: trial.modelVersion,
    dataVersion: trial.dataVersion,
    recipeId: trial.recipeId,
    seed: trial.seed,
    raw_fingerprint: `raw_${trial.id}`,
    feature_snapshot_version: "fsnap_0.3.0",
    run_hash: `${trial.id}-${Date.now()}`,
  };

  downloadJson("provenance.json", provenance);
  downloadJson("recipe.json", recipe);
  downloadJson("macros.json", macros);
  if (scenarioSet) downloadJson("scenario_set.json", scenarioSet);
  if (correction) downloadJson("correction.json", correction);
  if (runResult) downloadJson("run_result.json", runResult);
};

export const buildExportBundle = (params: {
  recipe: Recipe;
  runResult: RunResult;
  trial: TrialMeta;
  macros: Macro[];
  scenarioSet: ScenarioSet | null;
  correction: CorrectionClip | null;
}) => {
  const { recipe, runResult, trial, macros, scenarioSet, correction } = params;
  const filename = `twin_bundle_${trial.id}_${Date.now()}.json`;
  const payload: Record<string, unknown> = {
    provenance: {
      modelVersion: trial.modelVersion,
      dataVersion: trial.dataVersion,
      recipeId: trial.recipeId,
      seed: trial.seed,
      raw_fingerprint: `raw_${trial.id}`,
      feature_snapshot_version: "fsnap_0.4.0",
      run_hash: runResult.provenance.run_hash,
    },
    recipe,
    run_result: runResult,
    macros,
  };
  if (scenarioSet) payload.scenario_set = scenarioSet;
  if (correction) payload.correction = correction;

  return {
    id: `bundle_${Date.now()}`,
    filename,
    createdAt: new Date().toLocaleString(),
    payload,
  };
};
