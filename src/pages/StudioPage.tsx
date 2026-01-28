import HeaderBar from "../features/HeaderBar";
import Viewport3D from "../features/Viewport3D";
import Timeline from "../features/Timeline";
import RecipePanel from "../features/RecipePanel";
import ResultsDrawer from "../features/ResultsDrawer";
import SweepPanel from "../features/SweepPanel";
import TwinScorePanel from "../features/TwinScorePanel";
import ExplainPanel from "../features/ExplainPanel";
import RunStatus from "../features/RunStatus";
import JobQueue from "../features/JobQueue";
import ScenarioLab from "../features/ScenarioLab";
import { generateRunResult, generateSweepData } from "../mock/runResult";
import { exportBundle } from "../utils/exporters";
import { useAppStore } from "../state/store";
import { useActiveRunResult } from "../state/selectors";

const StudioPage = () => {
  const {
    recipe,
    doWindow,
    currentTrial,
    activeTab,
    setActiveTab,
    setRunResult,
    setIsSweeping,
    setSweepData,
    enqueueJob,
    updateJobStatus,
    macros,
    scenarioSet,
    correction,
  } = useAppStore();
  const activeRunResult = useActiveRunResult();

  const handleRun = (quality: "preview" | "bake") => {
    const latency = quality === "preview" ? 300 : 1200;
    if (quality === "preview") {
      setRunResult(null);
      setTimeout(() => {
        setRunResult(generateRunResult(quality, doWindow, latency));
      }, latency);
      return;
    }
    const job = enqueueJob("bake", "High fidelity bake");
    updateJobStatus(job.id, "running");
    setRunResult(null);
    setTimeout(() => {
      const latest = useAppStore.getState().jobs.find((item) => item.id === job.id);
      if (!latest || latest.status === "canceled") return;
      setRunResult(generateRunResult(quality, doWindow, latency));
      updateJobStatus(job.id, "completed");
    }, latency);
  };

  const handleSweep = () => {
    const job = enqueueJob("sweep", "Sweep stability");
    updateJobStatus(job.id, "running");
    setIsSweeping(true);
    setSweepData(null);
    setTimeout(() => {
      const latest = useAppStore.getState().jobs.find((item) => item.id === job.id);
      if (!latest || latest.status === "canceled") return;
      setSweepData(generateSweepData());
      updateJobStatus(job.id, "completed");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeaderBar
        onPreview={() => handleRun("preview")}
        onBake={() => handleRun("bake")}
        onSweep={handleSweep}
        onExport={() =>
          exportBundle({
            recipe,
            runResult: activeRunResult,
            trial: currentTrial,
            macros,
            scenarioSet,
            correction,
          })
        }
      />
      <div className="border-b border-slate-800 px-6 py-3">
        <div className="flex gap-2 text-xs">
          {(["studio", "scenario"] as const).map((tab) => (
            <button
              key={tab}
              className={`rounded-lg border px-3 py-2 ${
                activeTab === tab
                  ? "border-cyan-500 bg-cyan-500/20 text-white"
                  : "border-slate-800 text-slate-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "studio" ? "Studio" : "Scenario Lab"}
            </button>
          ))}
        </div>
      </div>
      {activeRunResult?.twinScore.oodLevel === "high" && (
        <div className="mx-6 mt-4 rounded-xl border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          结果仅供参考：OOD 高风险检测，建议复核数据与参数设置。
        </div>
      )}
      <main className="grid gap-4 p-6 lg:grid-cols-[1.2fr_1.4fr_1fr]">
        <div className="space-y-4">
          <Viewport3D />
        </div>
        <div className="space-y-4">
          <Timeline />
          {activeTab === "scenario" && <ScenarioLab />}
        </div>
        <div className="space-y-4">
          <JobQueue />
          <RunStatus />
          <TwinScorePanel />
          <ExplainPanel />
          <RecipePanel />
        </div>
      </main>
      <ResultsDrawer />
      <SweepPanel />
    </div>
  );
};

export default StudioPage;
