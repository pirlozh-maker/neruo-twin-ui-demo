import HeaderBar from "../features/HeaderBar";
import Viewport3D from "../features/Viewport3D";
import Timeline from "../features/Timeline";
import RecipePanel from "../features/RecipePanel";
import ResultsDrawer from "../features/ResultsDrawer";
import SweepPanel from "../features/SweepPanel";
import TwinScorePanel from "../features/TwinScorePanel";
import ExplainPanel from "../features/ExplainPanel";
import RunStatus from "../features/RunStatus";
import { generateRunResult, generateSweepData } from "../mock/runResult";
import { exportBundle } from "../utils/exporters";
import { useAppStore } from "../state/store";

const StudioPage = () => {
  const {
    recipe,
    doWindow,
    currentTrial,
    setRunResult,
    setIsSweeping,
    setSweepData,
  } = useAppStore();

  const handleRun = (quality: "preview" | "bake") => {
    const latency = quality === "preview" ? 300 : 1200;
    setRunResult(null);
    setTimeout(() => {
      setRunResult(generateRunResult(quality, doWindow, latency));
    }, latency);
  };

  const handleSweep = () => {
    setIsSweeping(true);
    setSweepData(null);
    setTimeout(() => {
      setSweepData(generateSweepData());
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeaderBar
        onPreview={() => handleRun("preview")}
        onBake={() => handleRun("bake")}
        onSweep={handleSweep}
        onExport={() => exportBundle(recipe, useAppStore.getState().runResult, currentTrial)}
      />
      <main className="grid gap-4 p-6 lg:grid-cols-[1.2fr_1.4fr_1fr]">
        <div className="space-y-4">
          <Viewport3D />
        </div>
        <div className="space-y-4">
          <Timeline />
        </div>
        <div className="space-y-4">
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
