import { useMemo, useState } from "react";
import { trials } from "../../mock/trials";
import { useAppStore } from "../../state/store";

const TrialSelector = () => {
  const { currentTrial, recentTrials, mode, setMode, setTrial, runState, pushToast } =
    useAppStore();
  const [search, setSearch] = useState("");

  const filteredTrials = useMemo(
    () =>
      trials.filter(
        (trial) =>
          trial.id.toLowerCase().includes(search.toLowerCase()) ||
          trial.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  const disableInputs = runState === "BAKE_RUNNING" || runState === "ROLLOUT_RUNNING";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="text-[11px] text-slate-400">Trial Selector</label>
        <div className="mt-1 flex gap-2">
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs"
            value={currentTrial.id}
            onChange={(event) => {
              setTrial(event.target.value);
              pushToast({
                id: `toast_trial_select_${Date.now()}`,
                title: "Trial selected",
                description: `Loaded ${event.target.value}.`,
                tone: "info",
              });
            }}
            disabled={disableInputs}
          >
            {filteredTrials.map((trial) => (
              <option key={trial.id} value={trial.id}>
                {trial.id} — {trial.name}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs"
            placeholder="Search trial…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            disabled={disableInputs}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
          Recent:
          {recentTrials.map((trial) => (
            <button
              key={trial.id}
              className="rounded border border-slate-800 px-2 py-0.5"
              onClick={() => {
                setTrial(trial.id);
                pushToast({
                  id: `toast_trial_${Date.now()}`,
                  title: "Trial updated",
                  description: `Switched to ${trial.id}.`,
                  tone: "info",
                });
              }}
              disabled={disableInputs}
            >
              {trial.id}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[11px] text-slate-400">Mode</label>
        <div className="mt-1 flex rounded-lg border border-slate-700 bg-slate-900 text-xs">
          {(["standard", "lab", "live"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`px-3 py-2 ${
                mode === value ? "bg-cyan-600 text-white" : "text-slate-300"
              }`}
              onClick={() => {
                setMode(value);
                pushToast({
                  id: `toast_mode_${Date.now()}`,
                  title: "Mode switched",
                  description: `Mode set to ${value}.`,
                  tone: "info",
                });
              }}
              disabled={disableInputs}
            >
              {value === "standard" ? "Standard" : value === "lab" ? "Lab" : "Live"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrialSelector;
