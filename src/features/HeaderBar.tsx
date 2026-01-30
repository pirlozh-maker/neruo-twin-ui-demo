import { trials } from "../mock/trials";
import { useAppStore } from "../state/store";

type HeaderBarProps = {
  onPreview: () => void;
  onBake: () => void;
  onSweep: () => void;
  onExport: () => void;
};

const HeaderBar = ({ onPreview, onBake, onSweep, onExport }: HeaderBarProps) => {
  const { currentTrial, mode, setMode, setTrial } = useAppStore();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="text-xs text-slate-400">Trial</label>
          <select
            className="mt-1 block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={currentTrial.id}
            onChange={(event) => setTrial(event.target.value)}
          >
            {trials.map((trial) => (
              <option key={trial.id} value={trial.id}>
                {trial.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400">Mode</label>
          <div className="mt-1 flex rounded-lg border border-slate-700 bg-slate-900 text-xs">
            {(["standard", "lab"] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={`px-3 py-2 ${
                  mode === value ? "bg-cyan-600 text-white" : "text-slate-300"
                }`}
                onClick={() => setMode(value)}
              >
                {value === "standard" ? "Standard (EEG-only)" : "Lab (EEG+EMG)"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
          <button
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            onClick={onPreview}
          >
            Preview
          </button>
          <button
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            onClick={onBake}
          >
            Bake
          </button>
          <button
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            onClick={onSweep}
          >
            Sweep
          </button>
          <button
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            onClick={onExport}
          >
            Export
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
          Model {currentTrial.modelVersion}
        </span>
        <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
          Data {currentTrial.dataVersion}
        </span>
        <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
          Recipe {currentTrial.recipeId}
        </span>
        <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
          Seed {currentTrial.seed}
        </span>
      </div>
    </header>
  );
};

export default HeaderBar;
