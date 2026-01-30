import { useAppStore } from "../state/store";

const SweepPanel = () => {
  const { runState, sweepData, cancelRun, pushToast, setSweepData } = useAppStore();

  if (runState !== "SWEEP_RUNNING" && !sweepData) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 p-6 text-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sweep Response (noise_sigma × channel_count)</h3>
          <button
            className="rounded-lg border border-slate-700 px-3 py-1 text-xs"
            onClick={() => {
              cancelRun();
              setSweepData(null);
              pushToast({
                id: `toast_sweep_close_${Date.now()}`,
                title: "Sweep dismissed",
                description: "Sweep panel closed.",
                tone: "warning",
              });
            }}
          >
            Close
          </button>
        </div>
        {sweepData ? (
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>noise_sigma → {sweepData.x.join(" | ")}</span>
              <span>channel_count → {sweepData.y.join(" | ")}</span>
            </div>
            <div className="grid gap-2">
              {sweepData.heat.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="grid grid-cols-7 gap-2">
                  {row.map((value, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="rounded-lg bg-slate-800 px-2 py-1 text-center"
                      style={{ opacity: value }}
                    >
                      {value.toFixed(2)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
              Stability region highlighted by higher opacity values.
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs text-slate-500">Generating sweep response...</p>
        )}
      </div>
    </div>
  );
};

export default SweepPanel;
