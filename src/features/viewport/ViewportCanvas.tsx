import type { PointerEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useAppStore } from "../../state/store";

type Frames = {
  gt_pose: number[][][];
  twin_pose: number[][][];
};

type Props = {
  frames: Frames;
  isPlaying: boolean;
  speed: number;
  showGt: boolean;
  showTwin: boolean;
  twinOpacity: number;
  oodLevel: "normal" | "warning" | "high";
  className?: string;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLDivElement>) => void;
  children?: ReactNode;
};

const ViewportCanvas = ({
  frames,
  isPlaying,
  speed,
  showGt,
  showTwin,
  twinOpacity,
  oodLevel,
  className,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  children,
}: Props) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number>();
  const setPlayhead = useAppStore((state) => state.setPlayhead);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f172a");
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, 320);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(2, 4, 1);
    scene.add(light);

    const gtGeometry = new THREE.BufferGeometry();
    const twinGeometry = new THREE.BufferGeometry();
    const gtPositions = new Float32Array(frames.gt_pose[0].length * 3);
    const twinPositions = new Float32Array(frames.twin_pose[0].length * 3);
    gtGeometry.setAttribute("position", new THREE.BufferAttribute(gtPositions, 3));
    twinGeometry.setAttribute("position", new THREE.BufferAttribute(twinPositions, 3));
    const gtMaterial = new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.04 });
    const twinMaterial = new THREE.PointsMaterial({ color: 0xf97316, size: 0.045, transparent: true });
    const gtCloud = new THREE.Points(gtGeometry, gtMaterial);
    const twinCloud = new THREE.Points(twinGeometry, twinMaterial);
    scene.add(gtCloud);
    scene.add(twinCloud);

    const twinMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.35, 0.12, 90, 12),
      new THREE.MeshStandardMaterial({ color: 0xf97316, wireframe: true }),
    );
    twinMesh.position.set(0.8, 0.2, 0);
    scene.add(twinMesh);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (isPlaying) {
        const current = useAppStore.getState().playhead;
        const next = (current + 16 * speed) % 4000;
        setPlayhead(next);
      }
      twinMaterial.opacity = twinOpacity;
      twinMaterial.transparent = twinOpacity < 1;
      twinMaterial.color.set(
        oodLevel === "high" ? "#64748b" : oodLevel === "warning" ? "#94a3b8" : "#f97316",
      );
      const frameIndex = Math.floor((useAppStore.getState().playhead / 4000) * frames.gt_pose.length);
      const gtFrame = frames.gt_pose[frameIndex] ?? frames.gt_pose[0];
      const twinFrame = frames.twin_pose[frameIndex] ?? frames.twin_pose[0];
      gtFrame.forEach((point, index) => {
        gtPositions[index * 3] = point[0];
        gtPositions[index * 3 + 1] = point[1];
        gtPositions[index * 3 + 2] = point[2];
      });
      twinFrame.forEach((point, index) => {
        twinPositions[index * 3] = point[0];
        twinPositions[index * 3 + 1] = point[1];
        twinPositions[index * 3 + 2] = point[2];
      });
      gtGeometry.attributes.position.needsUpdate = true;
      twinGeometry.attributes.position.needsUpdate = true;
      gtCloud.visible = showGt;
      twinCloud.visible = showTwin;
      twinMesh.rotation.x += 0.004 * speed;
      twinMesh.rotation.y += 0.002 * speed;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      renderer.setSize(width, 320);
      camera.aspect = width / 320;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [frames, isPlaying, oodLevel, setPlayhead, showGt, showTwin, speed, twinOpacity]);

  return (
    <div
      className={`relative h-[320px] rounded-xl border border-slate-800 ${className ?? ""}`}
      ref={mountRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
};

export default ViewportCanvas;
