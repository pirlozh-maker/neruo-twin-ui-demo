import { useAppStore } from "../state/store";

const NAV_ITEMS = [
  { id: "studio", label: "Studio", description: "Main workspace" },
  { id: "scenario", label: "Scenario Lab", description: "Rollout analysis" },
  { id: "calibrate", label: "Calibrate", description: "Personalization" },
  { id: "runs", label: "Runs", description: "History & compare" },
  { id: "export", label: "Export & Reports", description: "Artifacts & bundles" },
] as const;

const SideRail = () => {
  const { activePage, setActivePage, pushToast } = useAppStore();

  return (
    <aside className="flex h-full w-60 flex-col gap-2 border-r border-slate-800 bg-slate-950/80 px-4 py-6 text-xs text-slate-300">
      <div className="px-2 text-[11px] uppercase tracking-wide text-slate-500">Navigation</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`rounded-xl border px-3 py-3 text-left ${
            activePage === item.id
              ? "border-cyan-500/60 bg-cyan-500/10 text-white"
              : "border-slate-800 bg-slate-900/40 text-slate-300"
          }`}
          onClick={() => {
            setActivePage(item.id);
            pushToast({
              id: `toast_nav_${Date.now()}`,
              title: "Navigation updated",
              description: `Switched to ${item.label}.`,
              tone: "info",
            });
          }}
        >
          <div className="text-sm font-semibold">{item.label}</div>
          <div className="mt-1 text-[11px] text-slate-500">{item.description}</div>
        </button>
      ))}
      <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-[11px] text-slate-400">
        Demo Quick Start: Preview → inspect timeline → Bake → Export bundle.
      </div>
    </aside>
  );
};

export default SideRail;
