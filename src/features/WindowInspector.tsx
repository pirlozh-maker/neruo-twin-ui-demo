import { useMemo } from "react";
import { useAppStore } from "../state/store";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const WindowInspector = () => {
  const { doWindow, setDoWindow, playhead, setPlayhead, pushToast, runState } = useAppStore();
  const isLocked = runState === "BAKE_RUNNING" || runState === "ROLLOUT_RUNNING";

  const duration = useMemo(
    () => Math.abs(doWindow.t1_ms - doWindow.t0_ms),
    [doWindow.t0_ms, doWindow.t1_ms],
  );

  const handleNudge = (delta: number) => {
    const t0 = clamp(doWindow.t0_ms + delta, 0, 4000);
    const t1 = clamp(doWindow.t1_ms + delta, 0, 4000);
    setDoWindow({ t0_ms: t0, t1_ms: t1 });
    pushToast({
      id: `toast_window_${Date.now()}`,
      title: "Window shifted",
      description: `Window moved by ${delta}ms.`,
      tone: "info",
    });
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Window Inspector</h3>
        <span className="text-[11px] text-slate-500">len {Math.round(duration)} ms</span>
      </div>
      {isLocked && (
        <div className="mt-2 text-[11px] text-orange-300">
          Bake running — edits locked (changes require rebake).
        </div>
      )}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-slate-400">t0_ms</span>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            value={Math.round(doWindow.t0_ms)}
            onChange={(event) =>
              setDoWindow({ t0_ms: Number(event.target.value), t1_ms: doWindow.t1_ms })
            }
            disabled={isLocked}
          />
        </label>
        <label className="space-y-1">
          <span className="text-slate-400">t1_ms</span>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            value={Math.round(doWindow.t1_ms)}
            onChange={(event) =>
              setDoWindow({ t0_ms: doWindow.t0_ms, t1_ms: Number(event.target.value) })
            }
            disabled={isLocked}
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => handleNudge(-100)}
          disabled={isLocked}
        >
          ◀︎ -100ms
        </button>
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => handleNudge(100)}
          disabled={isLocked}
        >
          +100ms ▶︎
        </button>
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => {
            setPlayhead(clamp(playhead - 120, 0, 4000));
            pushToast({
              id: `toast_playhead_${Date.now()}`,
              title: "Playhead adjusted",
              description: "Moved playhead backward.",
              tone: "info",
            });
          }}
        >
          Playhead -120
        </button>
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => {
            setPlayhead(clamp(playhead + 120, 0, 4000));
            pushToast({
              id: `toast_playhead_forward_${Date.now()}`,
              title: "Playhead adjusted",
              description: "Moved playhead forward.",
              tone: "info",
            });
          }}
        >
          Playhead +120
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {[600, 1200, 2000].map((window) => (
          <button
            key={window}
            className="rounded-lg border border-slate-700 px-3 py-1"
            onClick={() => {
              setDoWindow({ t0_ms: 0, t1_ms: window });
              pushToast({
                id: `toast_window_preset_${Date.now()}`,
                title: "Window preset",
                description: `Window set to ${window}ms.`,
                tone: "info",
              });
            }}
          >
            {window}ms
          </button>
        ))}
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => {
            setPlayhead(0);
            pushToast({
              id: `toast_playhead_reset_${Date.now()}`,
              title: "Playhead reset",
              description: "Playhead set to start.",
              tone: "info",
            });
          }}
        >
          Reset Playhead
        </button>
      </div>
    </section>
  );
};

export default WindowInspector;
