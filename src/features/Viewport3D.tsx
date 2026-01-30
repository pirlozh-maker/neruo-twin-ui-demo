import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Toggle from "../components/Toggle";
import { useAppStore } from "../state/store";
import { useActiveRunResult } from "../state/selectors";

type Keypoint = {
  id: "RToe" | "RHeel";
  x: number;
  y: number;
};

const Viewport3D = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const {
    playhead,
    setPlayhead,
    correctionMode,
    setCorrectionMode,
    correctionApplyMode,
    setCorrectionApplyMode,
    setCorrection,
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

  const oodLevel = runResult?.twinScore.oodLevel ?? "low";
  const twinOpacity = oodLevel === "high" ? 0.35 : oodLevel === "warning" ? 0.6 : 1;
  const ciBorder =
    showCi && oodLevel === "high"
      ? "border-2"
      : showCi && oodLevel === "warning"
        ? "border"
        : "";
  const scenarioLabel = activeScenarioVariantId ? `Scenario: ${activeScenarioVariantId}` : null;

  // Keep refs for frequently-updated values so the animation loop does not
  // capture stale values or cause the effect to re-run on every frame.
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f172a");
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, 280);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(2, 4, 1);
    scene.add(light);

    const pointGeometry = new THREE.BufferGeometry();
    const points = new Float32Array(300 * 3);
    for (let i = 0; i < points.length; i += 3) {
      points[i] = (Math.random() - 0.5) * 2;
      points[i + 1] = (Math.random() - 0.5) * 1.5;
      points[i + 2] = (Math.random() - 0.5) * 2;
    }
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.03 });
    const cloud = new THREE.Points(pointGeometry, material);
    scene.add(cloud);

    const twinMaterial = new THREE.MeshStandardMaterial({ color: 0xf97316, wireframe: true });
    const twinMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.35, 0.12, 90, 12),
      twinMaterial,
    );
    twinMesh.position.set(0.8, 0.2, 0);
    scene.add(twinMesh);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (isPlayingRef.current) {
        const current = useAppStore.getState().playhead;
        const next = (current + 16 * speedRef.current) % 4000;
        useAppStore.getState().setPlayhead(next);
      }
      // Read latest values from store so visuals react to state changes without
      // re-creating the whole scene.
      const oodLevelNow = useAppStore.getState().runResult?.twinScore.oodLevel ?? "low";
      const twinOpacityNow = oodLevelNow === "high" ? 0.35 : oodLevelNow === "warning" ? 0.6 : 1;
      twinMaterial.opacity = twinOpacityNow;
      twinMaterial.transparent = twinOpacityNow < 1;
      twinMaterial.color.set(
        oodLevelNow === "high" ? "#64748b" : oodLevelNow === "warning" ? "#94a3b8" : "#f97316",
      );
      cloud.rotation.y += 0.002 * speedRef.current;
      twinMesh.rotation.x += 0.004 * speedRef.current;
      twinMesh.rotation.y += 0.002 * speedRef.current;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      renderer.setSize(width, 280);
      camera.aspect = width / 280;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

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
      <div
        className={`relative h-[280px] rounded-xl border border-slate-800 ${ciBorder}`}
        ref={mountRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
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
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-700 px-3 py-1"
            onClick={() => setIsPlaying((value) => !value)}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          {[0.5, 1, 2].map((value) => (
            <button
              key={value}
              className={`rounded-lg border border-slate-700 px-3 py-1 ${
                speed === value ? "bg-cyan-600 text-white" : "text-slate-300"
              }`}
              onClick={() => setSpeed(value)}
            >
              {value}x
            </button>
          ))}
        </div>
        <div>
          <span className="text-slate-400">Time</span> {Math.round(playhead)} ms
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <Toggle label="Edit Twin Pose" checked={correctionMode} onChange={setCorrectionMode} />
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
          value={correctionApplyMode}
          onChange={(event) =>
            setCorrectionApplyMode(event.target.value as "local_fix" | "calibrate_hint")
          }
        >
          <option value="local_fix">local_fix</option>
          <option value="calibrate_hint">calibrate_hint</option>
        </select>
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={handleSaveCorrection}
        >
          Save Correction
        </button>
      </div>
      <div className="text-[11px] text-slate-500">
        Visibility: GT {showGt ? "on" : "off"}, Twin {showTwin ? "on" : "off"}, CI{" "}
        {showCi ? "on" : "off"}
      </div>
    </section>
  );
};

export default Viewport3D;
