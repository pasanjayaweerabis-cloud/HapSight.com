"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import type { LabelId } from "@/content/site";
import type { StageSceneProps } from "@/components/visuals/LazyStage";
import { Device } from "./Device";
import { ExplodeArrows } from "./effects/ExplodeArrows";
import { SensorCones } from "./effects/SensorCones";
import { PulseRings } from "./effects/PulseRings";
import { Obstacles } from "./effects/Obstacles";
import { ProblemProps } from "./effects/ProblemProps";
import { SignalDots } from "./effects/SignalDots";
import { OrbitRings } from "./effects/OrbitRings";
import { LABELLED_PARTS, partArrival } from "./explode";
import { smooth } from "./geometry";
import { layoutRing, projectToScreen, type ScreenAnchor } from "./labelProjection";
import { FOCUS_PARTS, mix, pageTimeline, type DeviceState, type SectionRange } from "./pageTimeline";
import { stageBus } from "./stageBus";

const FOV = 30;
const NO_HITS = [0, 0, 0] as const;
/** How much of the slot the device should fill. */
const FILL = 0.86;

export interface PersistentStageProps {
  compact: boolean;
}

/** Measures every registered section's scroll range in page progress units. */
function measure(): { ranges: SectionRange[]; max: number; vh: number } {
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const ranges = stageBus
    .sections()
    .map(({ id, el, mode }) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const start = mode === "pin" ? top : top - vh / 2;
      const end = mode === "pin" ? top + r.height - vh : top + r.height - vh / 2;
      return { id, start: start / max, end: Math.max(start + 1, end) / max };
    })
    .sort((a, b) => a.start - b.start);
  return { ranges, max, vh };
}

type Rect = { x: number; y: number; w: number; h: number };
const rectOf = (id: string | null): Rect | null => {
  const el = id ? stageBus.slot(id as never) : null;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 2 && r.height > 2 ? { x: r.left, y: r.top, w: r.width, h: r.height } : null;
};

function partOpacity(s: DeviceState, id: string): number {
  // highlight: the focused groups stay solid, the rest dim to ~35%
  let dim = 0;
  let mine = 0;
  for (const f of s.focus) {
    dim += f.amount;
    if (FOCUS_PARTS[f.group].includes(id)) mine += f.amount;
  }
  let o = 1 - 0.65 * Math.max(0, Math.min(1, dim) - Math.min(1, mine));
  // X-ray the temple shells and covers
  if (id === "templeShellL" || id === "templeCoverL") o = Math.min(o, 1 - 0.85 * s.xray[0]);
  if (id === "templeShellR" || id === "templeCoverR") o = Math.min(o, 1 - 0.85 * s.xray[1]);
  return o;
}

/** Aims the camera so the device fills `rect` (viewport px) from the state's viewing angle. */
function placeCamera(camera: THREE.PerspectiveCamera, s: DeviceState, rect: Rect, vw: number, vh: number, target: THREE.Vector3) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  camera.fov = FOV;
  camera.setViewOffset(vw, vh, vw / 2 - cx, vh / 2 - cy, vw, vh);
  const tanV = Math.tan((FOV * Math.PI) / 360);
  const dH = s.size / (2 * tanV * (rect.h / vh) * FILL);
  const dW = s.size / (2 * tanV * (vw / vh) * (rect.w / vw) * FILL);
  // tall, narrow slots (phones): let the widest unlabelled parts touch the edges
  const d = Math.max(dH, rect.w / rect.h < 0.75 ? dW * 0.7 : dW);
  target.set(...s.target);
  camera.position.set(
    target.x + Math.sin(s.azimuth) * Math.cos(s.elevation) * d,
    target.y + Math.sin(s.elevation) * d,
    target.z + Math.cos(s.azimuth) * Math.cos(s.elevation) * d,
  );
  camera.near = Math.max(0.05, d - 6);
  camera.far = d + 8;
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}

/** Design callouts: project each labelled part and lay the labels out inside the Design slot. */
function writeLabels(
  s: DeviceState,
  visible: boolean,
  camera: THREE.Camera,
  vw: number,
  vh: number,
  parts: Map<string, THREE.Object3D> | null,
  target: THREE.Vector3,
  compact: boolean,
) {
  const h = stageBus.overlay();
  if (!h || !h.container || !parts) return;
  const box = rectOf("design");
  const o = box && visible ? s.labels * s.opacity : 0;
  h.setOpacity(o);
  if (o <= 0.001 || !box) return;
  const world = new THREE.Vector3();
  const anchors: ScreenAnchor[] = [];
  for (const part of LABELLED_PARTS) {
    const g = parts.get(part.id);
    if (!g) continue;
    // each label fades in as its own part arrives, so the eye follows one group at a time
    const item = h.items.get(part.label as LabelId);
    if (item) {
      const v = smooth((partArrival(part, s.explode) - 0.55) / 0.35).toFixed(3);
      if (item.label.style.opacity !== v) {
        item.label.style.opacity = v;
        item.line.style.opacity = v;
        item.dot.style.opacity = v;
      }
    }
    world.set(...((part.anchor ?? [0, 0, 0]) as [number, number, number]));
    g.localToWorld(world);
    const sp = projectToScreen(world, camera, vw, vh);
    anchors.push({ id: part.label as LabelId, x: sp.x - box.x, y: sp.y - box.y, visible: sp.visible });
  }
  if (compact || h.mode === "dots") {
    for (const a of anchors) {
      const item = h.items.get(a.id);
      if (item) item.dot.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, -50%)`;
    }
    return;
  }
  // read sizes first, then write, to avoid layout thrashing
  const sizes = new Map<LabelId, { w: number; h: number }>();
  for (const a of anchors) {
    const el = h.items.get(a.id)?.label;
    sizes.set(a.id, { w: el?.offsetWidth ?? 0, h: el?.offsetHeight ?? 0 });
  }
  const ring = layoutRing(anchors, box.w, box.h, { margin: 4, top: 16, bottom: 72, gap: 14 }, sizes);
  for (const a of anchors) {
    const item = h.items.get(a.id);
    const p = ring.get(a.id);
    if (!item || !p) continue;
    item.label.style.transform = `translate(${p.cx}px, ${p.cy}px) translate(-50%, -50%)`;
    item.dot.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, -50%)`;
    item.line.setAttribute("d", p.d);
  }
}

/** Slow turntable while parked; unwinds to front-on (the short way) when a section stops it. */
function turntable(angle: number, spin: number, dt: number) {
  if (spin > 0.5) return angle + dt * 0.35 * spin;
  const a = Math.atan2(Math.sin(angle), Math.cos(angle));
  return a * Math.exp(-dt * 3 * (1 - spin));
}

/** The whole canvas fades out on sections without a slot (light sections). */
function fadeCanvas(el: HTMLCanvasElement, o: number, front: boolean) {
  const v = o.toFixed(3);
  if (el.style.opacity !== v) el.style.opacity = v;
  const host = el.closest<HTMLElement>("[data-stage-host]");
  const z = front ? "3" : "1"; // above the section content (z 2) only for "front" slots
  if (host && host.style.zIndex !== z) host.style.zIndex = z;
}

/** Float, slow turntable and pointer tilt (≤ 6°) on the group that holds the device. */
function moveRig(g: THREE.Group | null, s: DeviceState, t: number, spin: number, px: number, py: number) {
  if (!g) return;
  const tilt = 0.105 * s.tilt;
  g.position.y = Math.sin(t * 1.1) * 0.025 * s.float;
  g.rotation.set(py * tilt, spin + px * tilt, 0);
}

function Director({ compact, onReady }: { compact: boolean; onReady: () => void }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  const live = useRef<DeviceState | null>(null);
  const measured = useRef<{ ranges: SectionRange[]; max: number; vh: number; version: number } | null>(null);
  const rig = useRef<THREE.Group>(null);
  const parts = useRef<Map<string, THREE.Object3D> | null>(null);
  const clock = useRef({ t: 0, spin: 0 });
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const pulse = useRef(0);
  const ready = useRef(false);
  const target = useMemo(() => new THREE.Vector3(), []);

  // re-measure on resize / layout changes; follow the pointer for the hero tilt
  useEffect(() => {
    const remeasure = () => {
      measured.current = null;
      invalidate();
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    const onScroll = () => invalidate();
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const unsub = stageBus.subscribe(remeasure);
    const unPulse = stageBus.onPulse(() => {
      pulse.current = 1;
      invalidate();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      unsub();
      unPulse();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [invalidate]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    if (!measured.current || measured.current.version !== stageBus.version()) {
      measured.current = { ...measure(), version: stageBus.version() };
    }
    const m = measured.current;
    const p = Math.min(1, Math.max(0, window.scrollY / m.max));
    const goal = pageTimeline(p, m.ranges, (0.35 * m.vh) / m.max);
    // ease towards the scroll state so fast scrolling still looks smooth
    const prev = live.current;
    const s = { ...(prev ? mix(prev, goal, 1 - Math.exp(-dt * 6)) : goal), slot: goal.slot };
    live.current = s;

    // place the camera so the device sits in the current slot (travelling between slots)
    const ra = rectOf(s.slot.a);
    const rb = rectOf(s.slot.b);
    const rect: Rect | null =
      ra && rb
        ? {
            x: ra.x + (rb.x - ra.x) * s.slot.t,
            y: ra.y + (rb.y - ra.y) * s.slot.t,
            w: ra.w + (rb.w - ra.w) * s.slot.t,
            h: ra.h + (rb.h - ra.h) * s.slot.t,
          }
        : (ra ?? rb);
    const opacity = rect ? s.opacity : 0;
    fadeCanvas(gl.domElement, opacity, stageBus.isFront(s.slot.t < 0.5 ? s.slot.a : s.slot.b));
    const vw = size.width;
    const vh = size.height;
    if (rect) placeCamera(camera, s, rect, vw, vh, target);

    // time-based motion: float, slow turntable, pointer tilt (≤ 6°), one-shot waitlist pulse
    clock.current.t += dt;
    clock.current.spin = turntable(clock.current.spin, s.spin, dt);
    const pt = pointer.current;
    pt.x += (pt.tx - pt.x) * (1 - Math.exp(-dt * 4));
    pt.y += (pt.ty - pt.y) * (1 - Math.exp(-dt * 4));
    pulse.current = Math.max(0, pulse.current - dt / 1.6);
    moveRig(rig.current, s, clock.current.t, clock.current.spin, pt.x, pt.y);
    writeLabels(s, Boolean(rect), camera, vw, vh, parts.current, target, compact);

    // render on demand: keep going while visible, otherwise only when something changes
    if (opacity > 0.004 && !document.hidden) invalidate();
    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => {
        stageBus.setReady(true);
        onReady();
      });
    }
  });

  const onParts = useCallback((m: Map<string, THREE.Object3D>) => {
    parts.current = m;
  }, []);


  return (
    <group ref={rig}>
      <Device
        quality={compact ? "low" : "high"}
        onParts={onParts}
        getExplode={() => live.current?.explode ?? 0}
        getPartOpacity={(id) => (live.current ? partOpacity(live.current, id) : 1)}
        getGlow={() => (live.current ? live.current.glow * (0.5 + 0.5 * Math.sin(clock.current.t * 1.6)) : 0)}
      />
      <ExplodeArrows getExplode={() => {
        const e = live.current?.explode ?? 0;
        return smooth((e - 0.02) / 0.1) * e;
      }} />
      <SensorCones getOpacity={() => live.current?.cones ?? 0} getHighlight={() => live.current?.hits ?? NO_HITS} />
      <Obstacles getVisible={(i) => live.current?.obstacles[i] ?? 0} getDistance={() => live.current?.obstacleDistance ?? 1.8} />
      <PulseRings
        side="left"
        getStrength={() => Math.max(live.current?.motors[0] ?? 0, pulse.current)}
        getRate={() => live.current?.pulseRate ?? 1.4}
        animate
      />
      <PulseRings
        side="right"
        getStrength={() => Math.max(live.current?.motors[1] ?? 0, pulse.current)}
        getRate={() => live.current?.pulseRate ?? 1.4}
        animate
      />
      <ProblemProps getAmount={() => live.current?.problem ?? 0} />
      <SignalDots getAmount={() => live.current?.signals ?? 0} animate />
      <OrbitRings getAmount={() => live.current?.rings ?? 0} animate />
    </group>
  );
}

/** The one persistent canvas. Loaded lazily by StageHost through LazyStage. */
export default function PersistentStage({ active, onReady, compact }: PersistentStageProps & StageSceneProps) {
  // DPR cap: 1.25 on phones, 1.5 elsewhere (sharp enough, far fewer pixels than 2–3× screens).
  const max = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5);
  const [dpr, setDpr] = useState(max);
  useEffect(() => () => stageBus.setReady(false), []);
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "demand" : "never"}
      camera={{ position: [0, 0, 6], fov: FOV, near: 0.1, far: 30 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
        gl.domElement.style.transition = "opacity 200ms linear";
        // GPU reset or too many contexts: bring the stills back until the context is restored.
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          stageBus.setReady(false);
        });
        gl.domElement.addEventListener("webglcontextrestored", () => stageBus.setReady(true));
      }}
      tabIndex={-1}
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[-2.5, 3, 3]} intensity={1.7} color="#f4f7ff" />
      <directionalLight position={[2.5, 1.5, -3.5]} intensity={2.1} color="#9ff5e9" />
      <directionalLight position={[-3, 0.5, -2.5]} intensity={1.1} color="#c9d6ff" />
      <directionalLight position={[3, 1.2, 2]} intensity={0.6} color="#ffffff" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 1]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[-4, 1, 2]} scale={[2, 4, 1]} rotation-y={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1.6} color="#8af5e7" position={[4, 1, -3]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2.5} />
        <Lightformer form="ring" intensity={0.8} color="#c7d8ff" position={[0, -3, 3]} scale={3} />
      </Environment>
      <Suspense fallback={null}>
        <Director compact={compact} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
