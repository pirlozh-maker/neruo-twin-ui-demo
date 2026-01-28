import { useMemo, useState } from "react";
import { useAppStore } from "../state/store";

const TRACKS = [
  { id: "eeg_qc", label: "EEG_QC", color: "bg-cyan-500/40" },
  { id: "twin", label: "TwinScore", color: "bg-emerald-500/40" },
  { id: "ood", label: "OOD", color: "bg-orange-500/40" },
  { id: "events", label: "Events (HS/TO)", color: "bg-purple-500/40" },
  { id: "marks", label: "InterventionMarks", color: "bg-pink-500/40" },
];

const TOTAL_MS = 4000;

const Timeline = () => {
  const { doWindow, setDoWindow, playhead, setPlayhead } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const selection = useMemo(() => {
    const start = Math.min(doWindow.t0_ms, doWindow.t1_ms);
    const end = Math.max(doWindow.t0_ms, doWindow.t1_ms);
    return { start, end, width: end - start };
  }, [doWindow]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * TOTAL_MS;
    setDragStart(value);
    setDoWindow({ t0_ms: value, t1_ms: value + 400 });
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
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
    const rect = event.currentTarget.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * TOTAL_MS;
    setPlayhead(Math.max(0, Math.min(TOTAL_MS, value)));
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Timeline</h2>
        <div className="text-xs text-slate-400">
          do-window: {Math.round(selection.start)}ms → {Math.round(selection.end)}ms
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {TRACKS.map((track) => (
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
              <div
                className={`absolute inset-y-1 ${track.color} rounded`}
                style={{ left: "10%", width: "30%" }}
              />
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
