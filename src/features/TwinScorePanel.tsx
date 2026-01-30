import { useActiveRunResult } from "../state/selectors";

const TwinScorePanel = () => {
  const runResult = useActiveRunResult();
  const score = runResult?.twinScore;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-sm font-semibold">TwinScore</h2>
      {score ? (
        <div className="mt-3 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Total</span>
            <span className="text-lg font-semibold text-cyan-300">{score.total}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-cyan-500"
              style={{ width: `${Math.round(score.total)}%` }}
            />
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Input</span>
              <span>{score.breakdown.input}</span>
            </div>
            <div className="flex justify-between">
              <span>Sync</span>
              <span>{score.breakdown.sync}</span>
            </div>
            <div className="flex justify-between">
              <span>SelfConsistency</span>
              <span>{score.breakdown.selfConsistency}</span>
            </div>
            <div className="flex justify-between">
              <span>OOD</span>
              <span>{score.breakdown.ood}</span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-300">
            OOD level: <span className="font-semibold text-orange-300">{score.oodLevel}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Trend: {score.trend.slice(0, 6).join(" → ")}
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="text-slate-600">--</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800" />
          <div className="space-y-1">
            {["Input", "Sync", "SelfConsistency", "OOD"].map((label) => (
              <div key={label} className="flex justify-between">
                <span>{label}</span>
                <span className="text-slate-600">--</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-500">
            Preview/Bake to populate scores and trend.
          </div>
        </div>
      )}
    </section>
  );
};

export default TwinScorePanel;
