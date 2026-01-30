import { useState } from "react";
import { useAppStore } from "../state/store";

const RunsPage = () => {
  const { runHistory, pushToast } = useAppStore();
  const [compareId, setCompareId] = useState<string | null>(null);

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-sm font-semibold">Runs History</h2>
        <p className="mt-2 text-xs text-slate-400">
          Compare recent Preview/Bake/Rollout outputs. Select a run to mark as baseline for
          comparison.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {runHistory.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-500">
            No runs yet — trigger Preview/Bake to populate the history.
          </div>
        ) : (
          runHistory.map((run) => (
            <div
              key={run.runId}
              className={`rounded-2xl border p-4 text-xs ${
                compareId === run.runId
                  ? "border-cyan-500/60 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{run.runId}</span>
                <span className="text-[11px] text-slate-500">{run.mode}</span>
              </div>
              <div className="mt-2 space-y-1 text-slate-300">
                <div>Score: {run.twinScore.total}</div>
                <div>OOD: {run.ood_level}</div>
                <div>Latency: {run.latencyMs}ms</div>
              </div>
              <button
                className="mt-3 rounded-lg border border-slate-700 px-3 py-1"
                onClick={() => {
                  setCompareId(run.runId);
                  pushToast({
                    id: `toast_compare_${Date.now()}`,
                    title: "Baseline selected",
                    description: `Baseline set to ${run.runId}.`,
                    tone: "info",
                  });
                }}
              >
                {compareId === run.runId ? "Baseline Selected" : "Set as Baseline"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RunsPage;
