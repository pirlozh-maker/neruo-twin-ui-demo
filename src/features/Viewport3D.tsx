import { useMemo, useState } from "react";
import Toggle from "../components/Toggle";
import { useAppStore } from "../state/store";
import { useActiveRunResult } from "../state/selectors";
import ViewportPlayback from "./viewport/ViewportPlayback";
import ViewportCorrectionBar from "./viewport/ViewportCorrectionBar";
import ViewportCanvas from "./viewport/ViewportCanvas";

type Keypoint = {
  id: "RToe" | "RHeel";
  x: number;
  y: number;
};

const Viewport3D = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const {
    playhead,
    correctionMode,
    setCorrectionMode,
    correctionApplyMode,
    setCorrectionApplyMode,
    setCorrection,
    setCalibrationVersion,
    pushToast,
    activeScenarioVariantId,
  } = useAppStore();
  const runResult = useActiveRunResult();
  const [showGt, setShowGt] = useState(true);
  const [showTwin, setShowTwin] = useState(true);
  const [showCi, setShowCi] = useState(false);
  const [draggingPoint, setDraggingPoint] = useState<null | Keypoint["id"]>(null);
  const [points, setPoints] = useState<Keypoint[]>([
    { id: "RToe", x: 60, y: 80 },
    { id: "RHeel", x: 120, y: 120 },
  ]);

  const oodLevel = runResult?.ood_level ?? "normal";
  const twinOpacity = oodLevel === "high" ? 0.35 : oodLevel === "warning" ? 0.6 : 1;
  const ciBorder =
    showCi && oodLevel === "high"
      ? "border-2"
      : showCi && oodLevel === "warning"
        ? "border"
        : "";
  const scenarioLabel = activeScenarioVariantId ? `Scenario: ${activeScenarioVariantId}` : null;

  const frames = useMemo(() => {
    if (runResult?.prediction) return runResult.prediction;
    const fallback = {
      gt_pose: Array.from({ length: 48 }, () =>
        Array.from({ length: 53 }, () => [0, 0, 0]),
      ),
      twin_pose: Array.from({ length: 48 }, () =>
        Array.from({ length: 53 }, () => [0, 0, 0]),
      ),
      ci_radius: Array.from({ length: 48 }, () => 0.1),
    };
    return fallback;
  }, [runResult]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingPoint) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPoints((prev) =>
      prev.map((point) => (point.id === draggingPoint ? { ...point, x, y } : point)),
    );
  };

  const handlePointerUp = () => setDraggingPoint(null);

  const handleSaveCorrection = () => {
    const clip = {
      id: `corr_${Date.now()}`,
      time_ms: Math.round(playhead),
      apply_mode: correctionApplyMode,
      points: points.map((point) => ({
        id: point.id,
        dx: Math.round(point.x - 80),
        dy: Math.round(point.y - 90),
      })),
    } as const;
    setCorrection(clip);
    if (correctionApplyMode === "calibrate_hint") {
      setCalibrationVersion(`calib_${Date.now()}`);
      pushToast({
        id: `toast_calib_${Date.now()}`,
        title: "Calibration hint saved",
        description: "Calibration version updated for future runs.",
        tone: "success",
      });
    } else {
      pushToast({
        id: `toast_correction_${Date.now()}`,
        title: "Correction saved",
        description: "Local pose fix stored in results.",
        tone: "success",
      });
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">3D Viewport</h2>
        <div className="flex items-center gap-3 text-xs">
          <Toggle label="Show GT" checked={showGt} onChange={setShowGt} />
          <Toggle label="Show Twin" checked={showTwin} onChange={setShowTwin} />
          <Toggle label="Show CI" checked={showCi} onChange={setShowCi} />
        </div>
      </div>
      <ViewportCanvas
        frames={frames}
        isPlaying={isPlaying}
        speed={speed}
        showGt={showGt}
        showTwin={showTwin}
        twinOpacity={twinOpacity}
        oodLevel={oodLevel}
        className={ciBorder}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {showCi && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full border border-cyan-400/40"
              style={{
                width: `${Math.max(120, (frames.ci_radius[Math.floor((playhead / 4000) * frames.ci_radius.length)] ?? 0.12) * 520)}px`,
                height: `${Math.max(120, (frames.ci_radius[Math.floor((playhead / 4000) * frames.ci_radius.length)] ?? 0.12) * 520)}px`,
              }}
            />
          </div>
        )}
        {correctionMode && (
          <div className="absolute inset-0 pointer-events-none">
            {points.map((point) => (
              <button
                key={point.id}
                type="button"
                className="pointer-events-auto absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
                style={{ left: point.x, top: point.y }}
                onPointerDown={() => setDraggingPoint(point.id)}
              />
            ))}
          </div>
        )}
        {scenarioLabel && (
          <div className="absolute left-3 top-3 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px]">
            {scenarioLabel}
          </div>
        )}
        {(oodLevel === "warning" || oodLevel === "high") && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-orange-500/40 bg-orange-500/10 px-2 py-1 text-[11px] text-orange-200">
            OOD level {oodLevel} — twin visualization degraded
          </div>
        )}
      </ViewportCanvas>
      <ViewportPlayback
        isPlaying={isPlaying}
        speed={speed}
        playhead={playhead}
        onTogglePlay={() => {
          setIsPlaying((value) => !value);
          pushToast({
            id: `toast_play_${Date.now()}`,
            title: isPlaying ? "Playback paused" : "Playback running",
            description: "Viewport playback toggled.",
            tone: "info",
          });
        }}
        onSpeedChange={(value) => {
          setSpeed(value);
          pushToast({
            id: `toast_speed_${Date.now()}`,
            title: "Playback speed",
            description: `Speed set to ${value}x.`,
            tone: "info",
          });
        }}
      />
      <ViewportCorrectionBar
        correctionMode={correctionMode}
        correctionApplyMode={correctionApplyMode}
        onToggleMode={setCorrectionMode}
        onApplyModeChange={setCorrectionApplyMode}
        onSave={handleSaveCorrection}
      />
      <div className="text-[11px] text-slate-500">
        Visibility: GT {showGt ? "on" : "off"}, Twin {showTwin ? "on" : "off"}, CI{" "}
        {showCi ? "on" : "off"}
      </div>
    </section>
  );
};

export default Viewport3D;
