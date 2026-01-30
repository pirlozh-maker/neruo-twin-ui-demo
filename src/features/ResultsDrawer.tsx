import { useEffect, useState } from "react";
import { useAppStore } from "../state/store";
import { useActiveRunResult } from "../state/selectors";

const tabs = ["Overview", "Explain", "Provenance", "Corrections", "Artifacts"] as const;

const ResultsDrawer = () => {
  const runResult = useActiveRunResult();
  const { correction, exports, pushToast } = useAppStore();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const [height, setHeight] = useState(0.4);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const handleUp = () => setDragging(false);
    window.addEventListener("pointerup", handleUp);
    return () => window.removeEventListener("pointerup", handleUp);
  }, []);

  return (
    <section
      className="border-t border-slate-800 bg-slate-950/70"
      style={{ height: open ? `${height * 100}vh` : "auto" }}
    >
      <div className="flex w-full items-center justify-between px-6 py-3 text-left text-sm">
        <button
          className="flex-1 text-left"
          onClick={() => {
            setOpen((value) => !value);
            pushToast({
              id: `toast_drawer_${Date.now()}`,
              title: "Results drawer toggled",
              description: open ? "Drawer collapsed." : "Drawer expanded.",
              tone: "info",
            });
          }}
        >
          Results Drawer
        </button>
        <span className="text-xs text-slate-400">{open ? "Hide" : "Show"}</span>
      </div>
      {open && (
        <>
          <div
            className="mx-6 h-2 cursor-row-resize rounded-full bg-slate-800"
            onPointerDown={() => setDragging(true)}
            onPointerMove={(event) => {
              if (!dragging) return;
              const next = 1 - event.clientY / window.innerHeight;
              setHeight(Math.min(0.7, Math.max(0.3, next)));
            }}
          />
          <div className="mt-3 flex flex-wrap gap-2 px-6 text-xs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`rounded-lg border px-3 py-1 ${
                  activeTab === tab
                    ? "border-cyan-500/60 bg-cyan-500/10 text-white"
                    : "border-slate-800 text-slate-400"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  pushToast({
                    id: `toast_drawer_tab_${Date.now()}`,
                    title: "Results tab switched",
                    description: `${tab} view active.`,
                    tone: "info",
                  });
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid gap-4 px-6 pb-6 pt-4 md:grid-cols-3">
            {activeTab === "Overview" && (
              <>
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
                    <div className="mt-2 text-slate-500">Metrics skeleton ready.</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
                  <h4 className="text-sm font-semibold">TwinScore</h4>
                  {runResult ? (
                    <div className="mt-2 space-y-2 text-slate-300">
                      <div className="text-lg font-semibold text-cyan-300">
                        {runResult.twinScore.total}
                      </div>
                      <div>Input {runResult.twinScore.breakdown.input}</div>
                      <div>Sync {runResult.twinScore.breakdown.sync}</div>
                      <div>Self {runResult.twinScore.breakdown.selfConsistency}</div>
                      <div>OOD {runResult.twinScore.breakdown.ood}</div>
                    </div>
                  ) : (
                    <div className="mt-2 text-slate-500">TwinScore skeleton ready.</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
                  <h4 className="text-sm font-semibold">Alerts</h4>
                  {runResult ? (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-300">
                      {runResult.alerts.map((alert) => (
                        <li key={alert.id}>{alert.label}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 text-slate-500">Alerts skeleton ready.</div>
                  )}
                </div>
              </>
            )}
            {activeTab === "Explain" && (
              <>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
                  <h4 className="text-sm font-semibold">Top Channels</h4>
                  {runResult ? (
                    <ul className="mt-2 space-y-1 text-slate-300">
                      {runResult.explain.channels.map((channel) => (
                        <li key={channel.id}>
                          {channel.id} • {channel.weight}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 text-slate-500">Channels skeleton ready.</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
                  <h4 className="text-sm font-semibold">Top Bands</h4>
                  {runResult ? (
                    <ul className="mt-2 space-y-1 text-slate-300">
                      {runResult.explain.bands.map((band) => (
                        <li key={band.id}>
                          {band.id} • {band.weight}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 text-slate-500">Bands skeleton ready.</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
                  <h4 className="text-sm font-semibold">Counterfactual Δ</h4>
                  <div className="mt-2 text-slate-400">
                    Δ score +1.8 after noise_sigma reduction.
                  </div>
                </div>
              </>
            )}
            {activeTab === "Provenance" && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs md:col-span-2">
                <h4 className="text-sm font-semibold">Provenance</h4>
                {runResult ? (
                  <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                    <div>Model: {runResult.provenance.modelVersion}</div>
                    <div>Data: {runResult.provenance.dataVersion}</div>
                    <div>Raw fingerprint: {runResult.provenance.raw_fingerprint}</div>
                    <div>Feature snapshot: {runResult.provenance.feature_snapshot_version}</div>
                    <div>Run hash: {runResult.provenance.run_hash}</div>
                  </div>
                ) : (
                  <div className="mt-2 text-slate-500">Provenance skeleton ready.</div>
                )}
              </div>
            )}
            {activeTab === "Corrections" && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs md:col-span-2">
                <h4 className="text-sm font-semibold">Correction Clip</h4>
                {correction ? (
                  <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                    <div>ID: {correction.id}</div>
                    <div>Time: {correction.time_ms} ms</div>
                    <div>Apply: {correction.apply_mode}</div>
                    <div>
                      Points:{" "}
                      {correction.points
                        .map((point) => `${point.id}(${point.dx},${point.dy})`)
                        .join(", ")}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-slate-500">No correction saved yet.</div>
                )}
              </div>
            )}
            {activeTab === "Artifacts" && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs md:col-span-2">
                <h4 className="text-sm font-semibold">Artifacts</h4>
                {exports.length === 0 ? (
                  <div className="mt-2 text-slate-500">No exports yet.</div>
                ) : (
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                    {exports.map((bundle) => (
                      <li key={bundle.id}>{bundle.filename}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ResultsDrawer;
