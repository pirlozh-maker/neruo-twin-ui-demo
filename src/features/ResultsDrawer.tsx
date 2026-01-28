import { useState } from "react";
import { useAppStore } from "../state/store";

const ResultsDrawer = () => {
  const runResult = useAppStore((state) => state.runResult);
  const [open, setOpen] = useState(true);

  return (
    <section className="border-t border-slate-800 bg-slate-950/70">
      <button
        className="flex w-full items-center justify-between px-6 py-3 text-left text-sm"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Results Drawer</span>
        <span className="text-xs text-slate-400">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="grid gap-4 px-6 pb-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
            <h4 className="text-sm font-semibold">Metrics</h4>
            {runResult ? (
              <div className="mt-2 space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Speed</span>
                  <span>{runResult.metrics.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase</span>
                  <span>{runResult.metrics.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cadence</span>
                  <span>{runResult.metrics.cadence}</span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-slate-500">No results yet.</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
            <h4 className="text-sm font-semibold">TwinScore</h4>
            {runResult ? (
              <div className="mt-2 space-y-2 text-slate-300">
                <div className="text-lg font-semibold text-cyan-300">{runResult.twinScore.total}</div>
                <div>Input {runResult.twinScore.breakdown.input}</div>
                <div>Sync {runResult.twinScore.breakdown.sync}</div>
                <div>Self {runResult.twinScore.breakdown.selfConsistency}</div>
                <div>OOD {runResult.twinScore.breakdown.ood}</div>
              </div>
            ) : (
              <p className="mt-2 text-slate-500">No results yet.</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
            <h4 className="text-sm font-semibold">Explain TopK</h4>
            {runResult ? (
              <div className="mt-2 space-y-2 text-slate-300">
                <div>Channels: {runResult.explain.channels.join(", ")}</div>
                <div>Bands: {runResult.explain.bands.join(", ")}</div>
                <div>Slices: {runResult.explain.time_slices.join(", ")}</div>
              </div>
            ) : (
              <p className="mt-2 text-slate-500">No results yet.</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
            <h4 className="text-sm font-semibold">Alerts</h4>
            {runResult ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-300">
                {runResult.alerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-slate-500">No alerts yet.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ResultsDrawer;
