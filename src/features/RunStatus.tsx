import { useActiveRunResult } from "../state/selectors";
import { useAppStore } from "../state/store";

const RunStatus = () => {
  const runResult = useActiveRunResult();
  const { runState, runProgress, runDurationMs, bakeNeedsRebake } = useAppStore();

  const statusLabel =
    runState === "IDLE" ? "Idle" : runState.replace("_", " ").replace("_", " ");
  const nextSuggestion = bakeNeedsRebake
    ? "Recipe changed — run Bake to refresh."
    : runResult
      ? "Next: Export bundle or apply macro."
      : "Run Preview to generate results.";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">Run Status</span>
        <span className="text-[11px] text-slate-500">
          {runResult ? new Date(runResult.createdAt).toLocaleTimeString() : statusLabel}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span>Status</span>
        <span className="text-cyan-300">{statusLabel}</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-cyan-500"
          style={{ width: `${Math.round(runProgress * 100)}%` }}
        />
      </div>
      {runResult ? (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span>Run ID</span>
            <span>{runResult.runId}</span>
          </div>
          <div className="flex justify-between">
            <span>Latency</span>
            <span>{runResult.latencyMs} ms</span>
          </div>
          <div className="flex justify-between">
            <span>OOD level</span>
            <span className="text-orange-300">{runResult.ood_level}</span>
          </div>
          <div className="flex justify-between">
            <span>Run time</span>
            <span>{Math.round(runDurationMs)} ms</span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-400">
            Next: {nextSuggestion}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-slate-500">Awaiting Preview/Bake run.</p>
      )}
    </div>
  );
};

export default RunStatus;
