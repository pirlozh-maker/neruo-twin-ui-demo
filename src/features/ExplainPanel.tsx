import { useActiveRunResult } from "../state/selectors";
import { useAppStore } from "../state/store";

const ExplainPanel = () => {
  const runResult = useActiveRunResult();
  const { setPlayhead, pushToast } = useAppStore();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-sm font-semibold">Explain TopK</h2>
      {runResult ? (
        <div className="mt-3 grid grid-cols-1 gap-3 text-xs">
          <div>
            <div className="text-[11px] text-slate-400">Channels</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {runResult.explain.channels.map((channel) => (
                <button
                  key={channel.id}
                  className="rounded bg-slate-800 px-2 py-1"
                  onClick={() => {
                    setPlayhead(channel.window.t0_ms);
                    pushToast({
                      id: `toast_channel_${Date.now()}`,
                      title: "Channel focus",
                      description: `Jumped to ${channel.id}.`,
                      tone: "info",
                    });
                  }}
                >
                  {channel.id} ({channel.weight})
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Bands</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {runResult.explain.bands.map((band) => (
                <span key={band.id} className="rounded bg-slate-800 px-2 py-1">
                  {band.id} ({band.weight})
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Time slices</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {runResult.explain.time_slices.map((slice) => (
                <button
                  key={slice.id}
                  className="rounded bg-slate-800 px-2 py-1"
                  onClick={() => {
                    setPlayhead(slice.window.t0_ms);
                    pushToast({
                      id: `toast_explain_${Date.now()}`,
                      title: "Explain jump",
                      description: `Focused on ${slice.id}.`,
                      tone: "info",
                    });
                  }}
                >
                  {slice.id} ({slice.weight})
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2 text-xs text-slate-500">
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
            Explainability tracks will appear after Preview/Bake.
          </div>
          <div className="flex flex-wrap gap-2">
            {["C3", "C4", "Pz", "F3", "F4"].map((label) => (
              <span key={label} className="rounded bg-slate-800 px-2 py-1 text-slate-600">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ExplainPanel;
