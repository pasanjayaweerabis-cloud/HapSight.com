"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { design, type LabelId } from "@/content/site";
import type { StageSceneProps } from "@/components/visuals/LazyStage";
import { Device } from "./Device";
import { PARTS } from "./deviceConfig";
import { pointAt } from "./explode";
import type { V3 } from "./geometry";
import type { ActionId, ExploreSceneProps } from "./exploreConfig";
import { SensorCones } from "./effects/SensorCones";
import { Obstacles } from "./effects/Obstacles";
import { PulseRings } from "./effects/PulseRings";
import { SignalDots } from "./effects/SignalDots";

const FOV = 30;
const ACTION = CameraControlsImpl.ACTION;

/** Camera spots (wearer faces +z, wearer's left = +x). */
const HOME = { pos: [-2.75, 1.25, 2.95] as V3, target: [0, 0, -0.12] as V3 };
/** Demos: from above and behind the wearer, so left is left and the beams run away from you. */
/* Framed to hold the ear tips (pulse rings, nearest the camera) and the obstacles (furthest away). */
const DEMO = { pos: [0, 4.75, -2.55] as V3, target: [0, -0.2, 0.8] as V3 };

/** Extra parts that belong with a label (the label itself sits on one part only). */
const EXTRA: Partial<Record<LabelId, string[]>> = {
  frame: ["frame", "templeShellL", "templeShellR", "templeCoverL", "templeCoverR", "earCapL", "earCapR"],
  lenses: ["lensL", "lensR"],
  drivers: ["driverA", "driverB"],
};

function partsFor(label: LabelId): string[] {
  return EXTRA[label] ?? PARTS.filter((p) => p.label === label).map((p) => p.id);
}

/**
 * Picking a part opens up just its area: these parts come out (explode 1) while the rest of the
 * glasses stay as they are. A board inside an arm brings its cover and neighbours with it.
 */
const LEFT_BAY = ["templeCoverL", "controller", "driverA", "driverB"];
const RIGHT_BAY = ["templeCoverR", "battery", "charger"];
const REVEAL: Record<LabelId, string[]> = {
  tofLeft: ["sensorL"],
  tofFront: ["sensorFront"],
  tofRight: ["sensorR"],
  lenses: ["lensL", "lensR"],
  controller: LEFT_BAY,
  drivers: LEFT_BAY,
  motorLeft: ["earCapL", "motorL"],
  motorRight: ["earCapR", "motorR"],
  battery: RIGHT_BAY,
  charger: RIGHT_BAY,
  frame: [],
  wiring: [],
};

/** Clicking any mesh of the model picks the label for that area (unlabelled parts included). */
const PICK: Record<string, LabelId> = {
  ...Object.fromEntries(PARTS.filter((p) => p.label).map((p) => [p.id, p.label as LabelId])),
  lensR: "lenses",
  driverA: "drivers",
  templeShellL: "controller",
  templeCoverL: "controller",
  templeShellR: "battery",
  templeCoverR: "battery",
  earCapL: "motorLeft",
  earCapR: "motorRight",
  nosePad: "frame",
};

/** Direction the camera looks at a part from, by where the part sits. */
const FOCUS_DIR: Record<string, V3> = {
  front: [0, 0.32, 1],
  leftArm: [1, 0.6, 0.15],
  rightArm: [-1, 0.6, 0.15],
  whole: [-0.9, 0.45, 1],
};

/** What each demo lights up: beams, which beam sees something, obstacles and motors (L, R). */
const DEMO_FX: Record<ActionId, { hits: V3; motors: [number, number]; signals: number }> = {
  sensors: { hits: [0, 0, 0], motors: [0, 0], signals: 0 },
  left: { hits: [1, 0, 0], motors: [1, 0], signals: 1 },
  ahead: { hits: [0, 1, 0], motors: [1, 1], signals: 1 },
  right: { hits: [0, 0, 1], motors: [0, 1], signals: 0 },
};

const tmp = new THREE.Vector3();
const ease = (cur: number, to: number, k: number) => cur + (to - cur) * k;

function Rig({ action, explode, focus, zoom, resetN, compact, onPick, onReady }: ExploreSceneProps & { onReady: () => void }) {
  const controls = useRef<CameraControlsImpl>(null);
  const live = useRef(explode);
  const target = useRef(explode);
  const dim = useRef(0);
  const focusIds = useRef<Set<string>>(new Set());
  /** Per-part "opened" amount (0..1), eased towards 1 for the picked area. */
  const opened = useRef(new Map<string, number>());
  const revealIds = useRef<Set<string>>(new Set());
  /** Demo effects, eased so they fade in and out instead of popping. */
  const fx = useRef({ cones: 0, hits: [0, 0, 0] as [number, number, number], motors: [0, 0] as [number, number], signals: 0, t: 0 });
  const ready = useRef(false);
  const onPickRef = useRef(onPick);
  const { size } = useThree();

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);
  useEffect(() => {
    focusIds.current = new Set(focus ? partsFor(focus) : []);
    revealIds.current = new Set(focus ? REVEAL[focus] : []);
  }, [focus]);
  useEffect(() => {
    target.current = explode;
  }, [explode]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 3.2);
    live.current = ease(live.current, target.current, k);
    dim.current = ease(dim.current, focus ? 1 : 0, k);
    for (const p of PARTS) {
      const cur = opened.current.get(p.id) ?? 0;
      const to = revealIds.current.has(p.id) ? 1 : 0;
      if (cur !== to) opened.current.set(p.id, Math.abs(to - cur) < 1e-3 ? to : ease(cur, to, k));
    }
    const f = fx.current;
    const demo = action ? DEMO_FX[action] : null;
    f.t += dt;
    f.cones = ease(f.cones, demo ? 1 : 0, k);
    for (let i = 0; i < 3; i++) f.hits[i] = ease(f.hits[i], demo ? demo.hits[i] : 0, k);
    for (let i = 0; i < 2; i++) f.motors[i] = ease(f.motors[i], demo ? demo.motors[i] : 0, k);
    f.signals = ease(f.signals, demo ? demo.signals : 0, k);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  /** The obstacle drifts closer and back (about 8 s a round), and the pulses speed up as it nears. */
  const closeness = () => 0.5 - 0.5 * Math.cos(fx.current.t * 0.8);
  const obstacleDistance = () => 1.6 - 0.65 * closeness();
  const pulseRate = () => 1.4 + 2.6 * closeness();

  // mouse: left turns, right pans, wheel zooms (only while the pointer is over the viewer;
  // camera-controls stops the page from scrolling then). Trackpad pinch arrives as ctrl+wheel.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.mouseButtons.left = ACTION.ROTATE;
    c.mouseButtons.right = ACTION.TRUCK;
    c.mouseButtons.middle = ACTION.DOLLY;
    c.mouseButtons.wheel = ACTION.DOLLY;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY_TRUCK;
    c.touches.three = ACTION.NONE;
  }, []);

  // fly to the picked part, the demo spot or home
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const aspect = size.width / Math.max(1, size.height);
    if (focus) {
      const ids = partsFor(focus);
      const reveal = new Set(REVEAL[focus]);
      const centre = new THREE.Vector3();
      for (const id of ids) {
        const p = PARTS.find((x) => x.id === id);
        // aim at where the part ends up once its area is open
        if (p) centre.add(pointAt(p, [0, 0, 0], reveal.has(id) ? 1 : explode, tmp));
      }
      centre.divideScalar(Math.max(1, ids.length));
      const dir = new THREE.Vector3(...FOCUS_DIR[design.labels[focus].group]).normalize();
      const wide = focus === "frame" || focus === "lenses" || focus === "wiring";
      const opens = reveal.size > 0 && !wide;
      const dist = (wide ? 3.6 : opens ? 1.9 : 1.55) * Math.max(1, 1.3 / aspect);
      const pos = centre.clone().addScaledVector(dir, dist);
      void c.setLookAt(pos.x, pos.y, pos.z, centre.x, centre.y, centre.z, true);
      return;
    }
    const v = action ? DEMO : HOME;
    const fit = Math.max(1, 1.45 / aspect) * (action ? 1 : 1 + 0.42 * explode);
    const t = new THREE.Vector3(...v.target);
    const pos = new THREE.Vector3(...v.pos).sub(t).multiplyScalar(fit).add(t);
    void c.setLookAt(pos.x, pos.y, pos.z, t.x, t.y, t.z, true);
  }, [action, focus, explode, resetN, size.width, size.height]);

  useEffect(() => {
    if (zoom.n > 0) void controls.current?.dolly(zoom.dir * 0.7, true);
  }, [zoom]);

  // click or tap a part (a drag that turns the glasses is not a click)
  const pick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    for (let o: THREE.Object3D | null = e.object; o; o = o.parent) {
      const label = PICK[o.name];
      if (label) {
        onPickRef.current?.(label);
        return;
      }
    }
  };
  // hand cursor over the model (set on the canvas itself: its grab cursor class would win otherwise)
  const setCursor = (e: ThreeEvent<PointerEvent>, c: string) => {
    const el = e.nativeEvent.target as HTMLElement | null;
    if (el) el.style.cursor = c;
  };

  return (
    <>
      <CameraControls
        ref={controls}
        makeDefault
        minDistance={1}
        maxDistance={9}
        dollySpeed={0.3}
        smoothTime={0.5}
        draggingSmoothTime={0.12}
      />
      <group
        onClick={pick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setCursor(e, "pointer");
        }}
        onPointerOut={(e) => setCursor(e, "")}
      >
        <Device
          quality={compact ? "low" : "high"}
          getExplode={() => live.current}
          getPartExplode={(id, e) => Math.max(e, opened.current.get(id) ?? 0)}
          getGlow={() => 0.35}
          getPartOpacity={(id) => (focusIds.current.size === 0 || focusIds.current.has(id) ? 1 : 1 - 0.82 * dim.current)}
        />
      </group>
      <SensorCones getOpacity={() => fx.current.cones} getHighlight={() => fx.current.hits} />
      <Obstacles getVisible={(i) => fx.current.hits[i]} getDistance={obstacleDistance} />
      <PulseRings side="left" getStrength={() => fx.current.motors[0]} getRate={pulseRate} animate />
      <PulseRings side="right" getStrength={() => fx.current.motors[1]} getRate={pulseRate} animate />
      <SignalDots getAmount={() => fx.current.signals} animate />
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
      <directionalLight position={[2.5, 1.5, -3.5]} intensity={2.3} color="#ffd2b0" />
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
