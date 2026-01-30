import { useState } from "react";
import { useAppStore } from "../../state/store";

const VersionChips = () => {
  const { currentTrial, runResult, pushToast } = useAppStore();
  const [showProvenance, setShowProvenance] = useState(false);

  const handleToggle = (label: string) => {
    setShowProvenance((value) => !value);
    pushToast({
      id: `toast_prov_${Date.now()}`,
      title: "Provenance details",
      description: `${label} chip clicked.`,
      tone: "info",
    });
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
      <button
        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
        onClick={() => handleToggle("Model")}
      >
        Model {currentTrial.modelVersion}
      </button>
      <button
        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
        onClick={() => handleToggle("Data")}
      >
        Data {currentTrial.dataVersion}
      </button>
      <button
        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
        onClick={() => handleToggle("Recipe")}
      >
        Recipe {currentTrial.recipeId}
      </button>
      <button
        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
        onClick={() => handleToggle("Seed")}
      >
        Seed {currentTrial.seed}
      </button>
      {showProvenance && runResult && (
        <div className="absolute right-0 top-10 w-64 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-300">
          <div className="font-semibold">Provenance</div>
          <div className="mt-2 space-y-1 text-slate-400">
            <div>Run hash: {runResult.provenance.run_hash}</div>
            <div>Model: {runResult.provenance.modelVersion}</div>
            <div>Data: {runResult.provenance.dataVersion}</div>
            <div>Recipe: {runResult.provenance.recipeId}</div>
            <div>Seed: {runResult.provenance.seed}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionChips;
