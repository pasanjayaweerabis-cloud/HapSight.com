"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { design, type LabelId } from "@/content/site";
import type { StageSceneProps } from "@/components/visuals/LazyStage";
import { Device } from "./Device";
import { PARTS } from "./deviceConfig";
import { pointAt } from "./explode";
import type { V3 } from "./geometry";
import type { ExploreSceneProps, ViewId } from "./exploreConfig";

const FOV = 30;
const ACTION = CameraControlsImpl.ACTION;

/** Camera presets around the device (wearer faces +z, wearer's left = +x). */
const VIEWS: Record<ViewId, { pos: V3; target: V3 }> = {
  // from the wearer's front right, like the three-quarter render: sensors, right arm, switch
  angle: { pos: [-2.75, 1.25, 2.95], target: [0, 0, -0.12] },
  front: { pos: [0, 0.18, 4.3], target: [0, 0, -0.1] },
  // the right arm side on: USB-C port and slide switch
  side: { pos: [-4.4, 0.3, -0.15], target: [0, 0.06, -0.15] },
  top: { pos: [0, 4.4, 0.35], target: [0, 0, -0.15] },
};

/** Extra parts that belong with a label (the label itself sits on one part only). */
const EXTRA: Partial<Record<LabelId, string[]>> = {
  frame: ["frame", "templeShellL", "templeShellR", "templeCoverL", "templeCoverR", "earCapL", "earCapR"],
  lenses: ["lensL", "lensR"],
  drivers: ["driverA", "driverB"],
};

function partsFor(label: LabelId): string[] {
  return EXTRA[label] ?? PARTS.filter((p) => p.label === label).map((p) => p.id);
}

/** Direction the camera looks at a part from, by where the part sits. */
const FOCUS_DIR: Record<string, V3> = {
  front: [0, 0.32, 1],
  leftArm: [1, 0.6, 0.15],
  rightArm: [-1, 0.6, 0.15],
  whole: [-0.9, 0.45, 1],
};

const tmp = new THREE.Vector3();

function Rig({ view, explode, focus, zoom, resetN, compact, onReady }: ExploreSceneProps & { onReady: () => void }) {
  const controls = useRef<CameraControlsImpl>(null);
  const live = useRef(explode);
  const target = useRef(explode);
  const dim = useRef(0);
  const focusIds = useRef<Set<string>>(new Set());
  const ready = useRef(false);
  const { size, gl } = useThree();

  useEffect(() => {
    focusIds.current = new Set(focus ? partsFor(focus) : []);
  }, [focus]);
  useEffect(() => {
    target.current = explode;
  }, [explode]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 3.2);
    live.current += (target.current - live.current) * k;
    dim.current += ((focus ? 1 : 0) - dim.current) * k;
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  // mouse: left turns, right pans; the wheel keeps scrolling the page (zoom with buttons or pinch)
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.mouseButtons.left = ACTION.ROTATE;
    c.mouseButtons.right = ACTION.TRUCK;
    c.mouseButtons.middle = ACTION.DOLLY;
    c.mouseButtons.wheel = ACTION.NONE;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
    c.touches.three = ACTION.NONE;
  }, []);

  // trackpad pinch arrives as a wheel event with ctrlKey: zoom instead of zooming the page
  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      controls.current?.dolly(-e.deltaY * 0.012, false);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [gl]);

  // fly to the chosen view or part
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const aspect = size.width / Math.max(1, size.height);
    const fit = Math.max(1, 1.45 / aspect) * (1 + 0.42 * explode);
    if (focus) {
      const ids = partsFor(focus);
      const centre = new THREE.Vector3();
      for (const id of ids) {
        const p = PARTS.find((x) => x.id === id);
        if (p) centre.add(pointAt(p, [0, 0, 0], explode, tmp));
      }
      centre.divideScalar(Math.max(1, ids.length));
      const d = FOCUS_DIR[design.labels[focus].group];
      const dir = new THREE.Vector3(...d).normalize();
      const wide = focus === "frame" || focus === "lenses" || focus === "wiring";
      const dist = (wide ? 3.6 : 1.55) * Math.max(1, 1.3 / aspect);
      const pos = centre.clone().addScaledVector(dir, dist);
      void c.setLookAt(pos.x, pos.y, pos.z, centre.x, centre.y, centre.z, true);
      return;
    }
    const v = VIEWS[view];
    const t = new THREE.Vector3(...v.target);
    const pos = new THREE.Vector3(...v.pos).sub(t).multiplyScalar(fit).add(t);
    void c.setLookAt(pos.x, pos.y, pos.z, t.x, t.y, t.z, true);
  }, [view, focus, explode, resetN, size.width, size.height]);

  useEffect(() => {
    if (zoom.n > 0) void controls.current?.dolly(zoom.dir * 0.7, true);
  }, [zoom]);

  return (
    <>
      <CameraControls
        ref={controls}
        makeDefault
        minDistance={0.5}
        maxDistance={11}
        smoothTime={0.5}
        draggingSmoothTime={0.12}
      />
      <Device
        quality={compact ? "low" : "high"}
        getExplode={() => live.current}
        getGlow={() => 0.35}
        getPartOpacity={(id) => (focusIds.current.size === 0 || focusIds.current.has(id) ? 1 : 1 - 0.82 * dim.current)}
      />
      {compact ? null : (
        <ContactShadows position={[0, -0.36, -0.15]} scale={4.5} blur={2.4} far={1.4} opacity={0.55} resolution={256} color="#000814" />
      )}
    </>
  );
}

/** The Explore section's own canvas: an orbitable copy of the device. Loaded lazily by LazyStage. */
export default function ExploreScene({ active, onReady, ...props }: ExploreSceneProps & StageSceneProps) {
  const dpr = useMemo(() => Math.min(window.devicePixelRatio || 1, props.compact ? 1.5 : 2), [props.compact]);
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [-3, 1.3, 3.2], fov: FOV, near: 0.05, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.setClearColor(0x000000, 0);
      }}
      tabIndex={-1}
      className="cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[-2.5, 3, 3]} intensity={1.7} color="#f4f7ff" />
      <directionalLight position={[2.5, 1.5, -3.5]} intensity={2.3} color="#9ff5e9" />
      <directionalLight position={[-3, 0.5, -2.5]} intensity={1.3} color="#9db8ff" />
      <directionalLight position={[3, 1.2, 2]} intensity={0.6} color="#ffffff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 1]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.3} position={[-4, 1, 2]} scale={[2, 4, 1]} rotation-y={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1.8} color="#7fb2ff" position={[4, 1, -3]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2.5} />
        <Lightformer form="ring" intensity={0.8} color="#c7d8ff" position={[0, -3, 3]} scale={3} />
      </Environment>
      <Suspense fallback={null}>
        <Rig {...props} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
