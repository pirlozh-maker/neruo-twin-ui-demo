import type { Recipe, ScenarioResult, ScenarioSet } from "../types";
import { generateRunResult } from "./runResult";

const mergeRecipe = (base: Recipe, patch: Partial<Recipe>): Recipe => ({
  ...base,
  ...patch,
  eeg: { ...base.eeg, ...patch.eeg },
  emg: { ...base.emg, ...patch.emg },
  sync: { ...base.sync, ...patch.sync },
  prior: { ...base.prior, ...patch.prior },
  output: { ...base.output, ...patch.output },
});

export const generateScenarioResults = (scenario: ScenarioSet): ScenarioResult[] => {
  return scenario.variants.map((variant) => {
    const recipe = mergeRecipe(scenario.baseRecipe, variant.recipePatch);
    const runResult = generateRunResult(
      recipe.output.quality,
      { t0_ms: 0, t1_ms: scenario.horizon_ms },
      900,
    );
    return {
      scenarioId: scenario.id,
      variantId: variant.id,
      runResult: { ...runResult, provenance: { ...runResult.provenance, recipeId: variant.id } },
    };
  });
};
