import { useActiveRunResult } from "../state/selectors";

const ExplainPanel = () => {
  const runResult = useActiveRunResult();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-sm font-semibold">Explain TopK</h2>
      {runResult ? (
        <div className="mt-3 grid grid-cols-1 gap-3 text-xs">
          <div>
            <div className="text-[11px] text-slate-400">Channels</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {runResult.explain.channels.map((channel) => (
                <span key={channel} className="rounded bg-slate-800 px-2 py-1">
                  {channel}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Bands</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {runResult.explain.bands.map((band) => (
                <span key={band} className="rounded bg-slate-800 px-2 py-1">
                  {band}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Time slices</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {runResult.explain.time_slices.map((slice) => (
                <span key={slice} className="rounded bg-slate-800 px-2 py-1">
                  {slice}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">Run Preview/Bake to see explainability.</p>
      )}
    </section>
  );
};

export default ExplainPanel;
