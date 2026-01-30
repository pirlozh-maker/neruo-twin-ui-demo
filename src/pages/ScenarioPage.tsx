import ScenarioLab from "../features/ScenarioLab";
import ResultsDrawer from "../features/ResultsDrawer";

const ScenarioPage = () => (
  <div className="p-6">
    <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
      Scenario Lab focuses on rollout comparisons across variants. Generate a scenario set, run
      rollout, then inspect the timeline + viewport overlays.
    </div>
    <ScenarioLab />
    <ResultsDrawer />
  </div>
);

export default ScenarioPage;
