import { useMemo, useState } from "react";
import { useActiveRunResult } from "../state/selectors";
import { useAppStore } from "../state/store";

const TOTAL_MS = 4000;

const Timeline = () => {
  const {
    doWindow,
    setDoWindow,
    playhead,
    setPlayhead,
    activeScenarioVariantId,
    runState,
    pushToast,
  } = useAppStore();
  const runResult = useActiveRunResult();
  const isLocked = runState === "BAKE_RUNNING" || runState === "ROLLOUT_RUNNING";
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const selection = useMemo(() => {
    const start = Math.min(doWindow.t0_ms, doWindow.t1_ms);
    const end = Math.max(doWindow.t0_ms, doWindow.t1_ms);
    return { start, end, width: end - start };
  }, [doWindow]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * TOTAL_MS;
    setDragStart(value);
    setDoWindow({ t0_ms: value, t1_ms: value + 400 });
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
    if (!dragging || dragStart === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * TOTAL_MS;
    setDoWindow({ t0_ms: dragStart, t1_ms: Math.max(0, Math.min(TOTAL_MS, value)) });
  };

  const handlePointerUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const handlePlayhead = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * TOTAL_MS;
    setPlayhead(Math.max(0, Math.min(TOTAL_MS, value)));
  };

  const tracks = runResult?.timeline.tracks ?? [
    { id: "qc", values: Array.from({ length: 48 }, () => 65) },
    { id: "twinScore", values: Array.from({ length: 48 }, () => 70) },
    { id: "ood", values: Array.from({ length: 48 }, () => 40) },
  ];
  const events = runResult?.timeline.events ?? [
    { id: "evt_skel_1", type: "HS", time_ms: 640 },
    { id: "evt_skel_2", type: "TO", time_ms: 980 },
  ];
  const marks = runResult?.timeline.marks ?? [
    { id: "mark_skel", label: "Intervention", time_ms: 1200 },
  ];

  const trackMeta = [
    { id: "qc", label: "QC", color: "bg-cyan-500/40" },
    { id: "twinScore", label: "TwinScore", color: "bg-emerald-500/40" },
    { id: "ood", label: "OOD", color: "bg-orange-500/40" },
    { id: "events", label: "Events (HS/TO)", color: "bg-purple-500/40" },
    { id: "marks", label: "Marks", color: "bg-pink-500/40" },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Timeline</h2>
        <div className="text-xs text-slate-400">
          do-window: {Math.round(selection.start)}ms → {Math.round(selection.end)}ms
        </div>
      </div>
      {isLocked && (
        <div className="mt-2 text-[11px] text-orange-300">
          Bake running — timeline edits locked.
        </div>
      )}
      {activeScenarioVariantId && (
        <div className="mt-2 text-[11px] text-slate-500">
          Scenario view: {activeScenarioVariantId}
        </div>
      )}
      <div className="mt-4 space-y-3">
        {trackMeta.map((track) => (
          <div key={track.id} className="space-y-1">
            <div className="text-[11px] text-slate-400">{track.label}</div>
            <div
              className="relative h-8 rounded-lg border border-slate-800 bg-slate-950"
              onPointerDown={(event) => {
                handlePointerDown(event);
                handlePlayhead(event);
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {track.id === "events" &&
                events.map((evt) => (
                  <button
                    key={evt.id}
                    className="absolute top-1 h-6 w-1 rounded bg-purple-400"
                    style={{ left: `${(evt.time_ms / TOTAL_MS) * 100}%` }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setPlayhead(evt.time_ms);
                      pushToast({
                        id: `toast_event_${Date.now()}`,
                        title: "Event jump",
                        description: `${evt.type} marker selected.`,
                        tone: "info",
                      });
                    }}
                  />
                ))}
              {track.id === "marks" &&
                marks.map((mark) => (
                  <button
                    key={mark.id}
                    className="absolute top-1 h-6 w-1 rounded bg-pink-400"
                    style={{ left: `${(mark.time_ms / TOTAL_MS) * 100}%` }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setPlayhead(mark.time_ms);
                      pushToast({
                        id: `toast_mark_${Date.now()}`,
                        title: "Mark jump",
                        description: `${mark.label} marker selected.`,
                        tone: "info",
                      });
                    }}
                  />
                ))}
              {["qc", "twinScore", "ood"].includes(track.id) && (
                <div className="absolute inset-0 flex items-end">
                  {(() => {
                    const values = tracks.find((item) => item.id === track.id)?.values ?? [];
                    return values.map((value, index) => (
                      <div
                        key={`${track.id}-${index}`}
                        className={track.color}
                        style={{
                          height: `${Math.max(10, value)}%`,
                          width: `${100 / values.length}%`,
                        }}
                      />
                    ));
                  })()}
                </div>
              )}
              <div
                className="absolute inset-y-0 rounded bg-cyan-500/30"
                style={{
                  left: `${(selection.start / TOTAL_MS) * 100}%`,
                  width: `${(selection.width / TOTAL_MS) * 100}%`,
                }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-white"
                style={{ left: `${(playhead / TOTAL_MS) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
