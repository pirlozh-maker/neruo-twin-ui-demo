import RunControls from "./header/RunControls";
import TrialSelector from "./header/TrialSelector";
import VersionChips from "./header/VersionChips";

const HeaderBar = () => (
  <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur">
    <TrialSelector />
    <div className="flex flex-wrap items-center gap-3">
      <RunControls />
      <VersionChips />
    </div>
  </header>
);

export default HeaderBar;
