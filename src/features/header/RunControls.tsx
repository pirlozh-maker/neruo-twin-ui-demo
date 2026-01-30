import { buildExportBundle, downloadJson } from "../../utils/exporters";
import { useAppStore } from "../../state/store";

const RunControls = () => {
  const {
    currentTrial,
    runState,
    runProgress,
    startRun,
    startSweep,
    cancelRun,
    runResult,
    addExport,
    pushToast,
    bakeNeedsRebake,
    setRunState,
    setRunProgress,
  } = useAppStore();

  const isRunning =
    runState === "PREVIEW_RUNNING" ||
    runState === "BAKE_RUNNING" ||
    runState === "ROLLOUT_RUNNING" ||
    runState === "SWEEP_RUNNING" ||
    runState === "EXPORTING";
  const isBakeRunning = runState === "BAKE_RUNNING";
  const disablePreview = isBakeRunning || runState === "ROLLOUT_RUNNING" || runState === "SWEEP_RUNNING";
  const disableBake = isRunning;
  const disableExport = !runResult || isRunning;

  const handleExport = () => {
    if (!runResult) return;
    setRunState("EXPORTING");
    setRunProgress(0.2);
    const bundle = buildExportBundle({
      recipe: useAppStore.getState().recipe,
      runResult,
      trial: currentTrial,
      macros: useAppStore.getState().macros,
      scenarioSet: useAppStore.getState().scenarioSet,
      correction: useAppStore.getState().correction,
    });
    downloadJson(bundle.filename, bundle.payload);
    addExport(bundle);
    pushToast({
      id: `toast_export_${Date.now()}`,
      title: "Export complete",
      description: `Saved ${bundle.filename}`,
      tone: "success",
    });
    setRunProgress(1);
    setTimeout(() => {
      setRunState("IDLE");
      setRunProgress(0);
    }, 200);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          className={`rounded-lg border px-3 py-2 ${
            disablePreview ? "border-slate-800 text-slate-500" : "border-slate-700 bg-slate-900"
          }`}
          onClick={() => {
            startRun("preview");
            pushToast({
              id: `toast_preview_${Date.now()}`,
              title: "Preview started",
              description: "Latest-wins preview running.",
              tone: "info",
            });
          }}
          disabled={disablePreview}
        >
          {runState === "PREVIEW_RUNNING" ? "Previewing…" : "Preview"}
        </button>
        <button
          className={`rounded-lg border px-3 py-2 ${
            disableBake ? "border-slate-800 text-slate-500" : "border-slate-700 bg-slate-900"
          }`}
          onClick={() => {
            startRun("bake");
            pushToast({
              id: `toast_bake_${Date.now()}`,
              title: "Bake started",
              description: "High fidelity bake running.",
              tone: "info",
            });
          }}
          disabled={disableBake}
        >
          {runState === "BAKE_RUNNING" ? "Baking…" : "Bake"}
        </button>
        <button
          className={`rounded-lg border px-3 py-2 ${
            isRunning ? "border-slate-800 text-slate-500" : "border-slate-700 bg-slate-900"
          }`}
          onClick={() => {
            startRun("rollout");
            pushToast({
              id: `toast_rollout_${Date.now()}`,
              title: "Rollout running",
              description: "Scenario rollout in progress.",
              tone: "info",
            });
          }}
          disabled={isRunning}
        >
          {runState === "ROLLOUT_RUNNING" ? "Rollout…" : "Rollout"}
        </button>
        <button
          className={`rounded-lg border px-3 py-2 ${
            isRunning ? "border-slate-800 text-slate-500" : "border-slate-700 bg-slate-900"
          }`}
          onClick={() => {
            startSweep();
            pushToast({
              id: `toast_sweep_${Date.now()}`,
              title: "Sweep running",
              description: "Stability sweep generating.",
              tone: "info",
            });
          }}
          disabled={isRunning}
        >
          {runState === "SWEEP_RUNNING" ? "Sweep…" : "Sweep"}
        </button>
        <button
          className={`rounded-lg border px-3 py-2 ${
            disableExport ? "border-slate-800 text-slate-500" : "border-slate-700 bg-slate-900"
          }`}
          onClick={handleExport}
          disabled={disableExport}
        >
          Export
        </button>
        <button
          className={`rounded-lg border px-3 py-2 ${
            runState === "IDLE" ? "border-slate-800 text-slate-500" : "border-red-400 text-red-200"
          }`}
          onClick={() => {
            cancelRun();
            pushToast({
              id: `toast_cancel_${Date.now()}`,
              title: "Run canceled",
              description: "Current job was canceled.",
              tone: "warning",
            });
          }}
          disabled={runState === "IDLE"}
        >
          Cancel
        </button>
        <div className="ml-2 h-2 w-28 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-cyan-500"
            style={{ width: `${Math.round(runProgress * 100)}%` }}
          />
        </div>
      </div>
      {bakeNeedsRebake && (
        <span className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-2 py-1 text-[11px] text-orange-200">
          Recipe changed → rebake required
        </span>
      )}
    </div>
  );
};

export default RunControls;
