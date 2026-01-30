import { useMemo } from "react";
import { useAppStore } from "../state/store";
import type { ScenarioSet, ScenarioVariant } from "../types";
import { generateScenarioResults } from "../mock/scenario";

const defaultVariants: ScenarioVariant[] = [
  {
    id: "variant_a",
    name: "Variant A",
    recipePatch: { eeg: { noise_sigma: 1.6 } },
  },
  {
    id: "variant_b",
    name: "Variant B",
    recipePatch: { sync: { jitter_ms: 18 } },
  },
];

const ScenarioLab = () => {
  const {
    recipe,
    scenarioSet,
    setScenarioSet,
    scenarioResults,
    setScenarioResults,
    activeScenarioVariantId,
    setActiveScenarioVariantId,
    pushToast,
  } = useAppStore();

  const activeResult = useMemo(
    () => scenarioResults.find((item) => item.variantId === activeScenarioVariantId),
    [activeScenarioVariantId, scenarioResults],
  );

  const handleCreate = () => {
    const next: ScenarioSet = {
      id: `scenario_${Date.now()}`,
      name: "Scenario Set",
      horizon_ms: 1800,
      sample_count: 48,
      baseRecipe: recipe,
      variants: defaultVariants,
    };
    setScenarioSet(next);
    setActiveScenarioVariantId(defaultVariants[0]?.id ?? null);
    pushToast({
      id: `toast_scenario_${Date.now()}`,
      title: "Scenario set created",
      description: "Base + variants ready to rollout.",
      tone: "success",
    });
  };

  const updateScenario = (partial: Partial<ScenarioSet>) => {
    if (!scenarioSet) return;
    setScenarioSet({ ...scenarioSet, ...partial });
  };

  const updateVariant = (variantId: string, patch: Partial<ScenarioVariant>) => {
    if (!scenarioSet) return;
    setScenarioSet({
      ...scenarioSet,
      variants: scenarioSet.variants.map((variant) =>
        variant.id === variantId ? { ...variant, ...patch } : variant,
      ),
    });
  };

  const handleRun = () => {
    if (!scenarioSet) return;
    setScenarioResults([]);
    setTimeout(() => {
      setScenarioResults(generateScenarioResults(scenarioSet));
    }, 1200);
    pushToast({
      id: `toast_scenario_run_${Date.now()}`,
      title: "Scenario rollout started",
      description: "Generating variant comparisons.",
      tone: "info",
    });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Scenario Lab</h2>
        <button
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs"
          onClick={handleCreate}
        >
          Create Scenario Set
        </button>
      </div>
      {!scenarioSet ? (
        <p className="text-xs text-slate-500">
          Create a scenario set to compare Base + 2 variants across the timeline and viewport.
        </p>
      ) : (
        <div className="space-y-4 text-xs">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-slate-400">Scenario Name</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                value={scenarioSet.name}
                onChange={(event) => updateScenario({ name: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-slate-400">rollout horizon_ms</span>
              <input
                type="number"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                value={scenarioSet.horizon_ms}
                onChange={(event) => updateScenario({ horizon_ms: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-slate-400">sample_count</span>
              <input
                type="number"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                value={scenarioSet.sample_count}
                onChange={(event) => updateScenario({ sample_count: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-slate-400">Active Variant</span>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                value={activeScenarioVariantId ?? ""}
                onChange={(event) => setActiveScenarioVariantId(event.target.value)}
              >
                {scenarioSet.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="space-y-2">
            {scenarioSet.variants.map((variant) => (
              <div key={variant.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{variant.name}</span>
                  <span className="text-[11px] text-slate-500">{variant.id}</span>
                </div>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-slate-400">Label</span>
                    <input
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                      value={variant.name}
                      onChange={(event) => updateVariant(variant.id, { name: event.target.value })}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-slate-400">noise_sigma override</span>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                      value={variant.recipePatch.eeg?.noise_sigma ?? ""}
                      onChange={(event) =>
                        updateVariant(variant.id, {
                          recipePatch: {
                            ...variant.recipePatch,
                            eeg: {
                              ...variant.recipePatch.eeg,
                              noise_sigma: Number(event.target.value),
                            },
                          },
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-slate-700 px-3 py-2"
              onClick={handleRun}
            >
              Run Scenario
            </button>
            {activeResult && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-400">
                Active: {activeResult.variantId} • score {activeResult.runResult.twinScore.total}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ScenarioLab;
