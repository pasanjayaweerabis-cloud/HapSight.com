"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { V3 } from "./geometry";

/** Calls onReady once, after the first rendered frame. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => onReady());
  });
  return null;
}

/**
 * Points the camera at the target and, on narrow (portrait) canvases, pulls it back along its
 * view direction so the whole model still fits.
 */
function FitCamera({ position, target, fitAspect }: { position: V3; target: V3; fitAspect: number }) {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const aspect = width / Math.max(1, height);
    const k = aspect < fitAspect ? fitAspect / aspect : 1;
    const t = new THREE.Vector3(...target);
    const p = new THREE.Vector3(...position).sub(t).multiplyScalar(k).add(t);
    camera.position.copy(p);
    camera.lookAt(t);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, width, height, position, target, fitAspect, invalidate]);
  return null;
}

/**
 * Shared canvas setup for every 3D stage: capped pixel ratio, ACES tone mapping,
 * a procedural studio environment (no HDR download) and a soft teal rim light.
 */
export function StageCanvas({
  active,
  onReady,
  camera,
  target,
  fitAspect = 1,
  fov,
  compact,
  children,
  demand = false,
}: {
  active: boolean;
  onReady: () => void;
  camera: V3;
  target: V3;
  /** Below this canvas aspect ratio (width / height) the camera moves back to keep the model in view. */
  fitAspect?: number;
  fov: number;
  compact: boolean;
  children: React.ReactNode;
  /** Render only when invalidated (used for still, reduced-motion views). */
  demand?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, compact ? 1.25 : 1.6]}
      frameloop={active ? (demand ? "demand" : "always") : "never"}
      camera={{ position: camera as [number, number, number], fov, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
      style={{ touchAction: "pan-y" }}
      tabIndex={-1}
    >
      <FitCamera position={camera} target={target} fitAspect={fitAspect} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[-2.5, 3, 3]} intensity={1.7} color="#f4f7ff" />
      {/* rim light from behind */}
      <directionalLight position={[2.5, 1.5, -3.5]} intensity={2.2} color="#9ff5e9" />
      <directionalLight position={[-3, 0.5, -2.5]} intensity={1.1} color="#c9d6ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 1]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[-4, 1, 2]} scale={[2, 4, 1]} rotation-y={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1.6} color="#8af5e7" position={[4, 1, -3]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2.5} />
        <Lightformer form="ring" intensity={0.8} color="#c7d8ff" position={[0, -3, 3]} scale={3} />
      </Environment>
      <Suspense fallback={null}>
        {children}
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
