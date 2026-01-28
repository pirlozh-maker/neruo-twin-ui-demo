import { useActiveRunResult } from "../state/selectors";

const RunStatus = () => {
  const runResult = useActiveRunResult();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">Run Status</span>
        <span className="text-[11px] text-slate-500">
          {runResult ? new Date(runResult.createdAt).toLocaleTimeString() : "Idle"}
        </span>
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
            <span className="text-orange-300">{runResult.twinScore.oodLevel}</span>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-slate-500">Awaiting Preview/Bake run.</p>
      )}
    </div>
  );
};

export default RunStatus;
