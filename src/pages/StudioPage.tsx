import Viewport3D from "../features/Viewport3D";
import Timeline from "../features/Timeline";
import RecipePanel from "../features/RecipePanel";
import ResultsDrawer from "../features/ResultsDrawer";
import SweepPanel from "../features/SweepPanel";
import TwinScorePanel from "../features/TwinScorePanel";
import ExplainPanel from "../features/ExplainPanel";
import RunStatus from "../features/RunStatus";
import WindowInspector from "../features/WindowInspector";
import SignalHealthPanel from "../features/SignalHealthPanel";
import SessionNotesPanel from "../features/SessionNotesPanel";
import { useEffect, useRef } from "react";
import { useAppStore } from "../state/store";
import { useActiveRunResult } from "../state/selectors";

const StudioPage = () => {
  const { startRun, pushToast } = useAppStore();
  const initializedRef = useRef(false);
  const activeRunResult = useActiveRunResult();

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (!activeRunResult) {
      startRun("preview");
      pushToast({
        id: `toast_auto_${Date.now()}`,
        title: "Auto preview generated",
        description: "Demo run created for first load.",
        tone: "success",
      });
    }
  }, [activeRunResult, pushToast, startRun]);

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Demo Quick Start</span>
          <span className="text-[11px] text-slate-500">v0.4 demo-ready</span>
        </div>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-slate-400">
          <li>Preview to generate a fast twin pass and check the timeline.</li>
          <li>Bake to lock high fidelity results and compare to Preview.</li>
          <li>Export bundle to share recipe + run_result + provenance.</li>
        </ol>
      </div>
      {activeRunResult?.ood_level === "high" && (
        <div className="mx-6 mt-4 rounded-xl border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          结果仅供参考：OOD 高风险检测，建议复核数据与参数设置。
        </div>
      )}
      <main className="grid gap-4 lg:grid-cols-[1.25fr_1.35fr_1.05fr]">
        <div className="space-y-4">
          <Viewport3D />
          <SignalHealthPanel />
          <SessionNotesPanel />
        </div>
        <div className="space-y-4">
          <Timeline />
          <WindowInspector />
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
