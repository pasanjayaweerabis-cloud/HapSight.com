"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { BAND, DIMS, HOOK_LEFT, STRAP, type Side } from "../deviceConfig";
import { bandSweep, curveSweep, mirrorX, roundedRectProfile, sweep, v3 } from "../geometry";
import { useParts } from "./context";

export function BandShell() {
  const { mats, quality } = useParts();
  const geo = useMemo(
    () =>
      bandSweep(BAND, {
        offset: 0,
        thickness: DIMS.band.thickness,
        height: DIMS.band.height,
        radius: DIMS.band.radius,
        taper: DIMS.band.taper,
        segments: quality === "high" ? 120 : 64,
      }),
    [quality],
  );
  return <mesh geometry={geo} material={mats.teal} castShadow receiveShadow />;
}

export function BandLining() {
  const { mats, quality } = useParts();
  const geo = useMemo(
    () =>
      bandSweep(BAND, {
        offset: DIMS.lining.offset,
        thickness: DIMS.lining.thickness,
        height: DIMS.lining.height,
        radius: DIMS.lining.radius,
        taper: 0.5,
        thetaMax: DIMS.lining.thetaMax,
        segments: quality === "high" ? 96 : 56,
      }),
    [quality],
  );
  return <mesh geometry={geo} material={mats.silicone} />;
}

export function RibbonCable() {
  const { mats } = useParts();
  const geo = useMemo(
    () =>
      bandSweep(BAND, {
        offset: DIMS.ribbon.offset,
        thickness: DIMS.ribbon.thickness,
        height: DIMS.ribbon.height,
        radius: 0.001,
        thetaMax: DIMS.ribbon.thetaMax,
        segments: 64,
      }),
    [],
  );
  return <mesh geometry={geo} material={mats.ribbon} />;
}

/** Ear hook: generated for each side from mirrored control points (no negative scale). */
export function EarHook({ side }: { side: Side }) {
  const { mats, quality } = useParts();
  const geo = useMemo(() => {
    const pts = side === "left" ? HOOK_LEFT : HOOK_LEFT.map(mirrorX);
    const out = new THREE.Vector3(side === "left" ? 1 : -1, 0, 0);
    return curveSweep(
      pts,
      () => out,
      roundedRectProfile(DIMS.hook.thickness, DIMS.hook.width, 0.018, 4),
      quality === "high" ? 48 : 28,
      (t) => [1, t < 0.12 ? 1 + (1 - t / 0.12) * 0.03 : 1],
    );
  }, [side, quality]);
  return <mesh geometry={geo} material={mats.teal} castShadow />;
}

export function SensorMount() {
  const { mats } = useParts();
  return <RoundedBox args={[0.175, 0.16, 0.05]} radius={0.024} smoothness={4} material={mats.teal} castShadow />;
}

/** Points along the back strap, plus the outward direction at each point. */
function strapPath(offset: number, dy: number, segments: number) {
  const curve = new THREE.CatmullRomCurve3(STRAP.map(v3), false, "centripetal");
  const raw = curve.getPoints(segments);
  const facing = raw.map((pt) => new THREE.Vector3(pt.x, 0, pt.z + 0.05).normalize());
  const points = raw.map((pt, i) => pt.clone().addScaledVector(facing[i], offset).add(new THREE.Vector3(0, dy, 0)));
  return { points, facing };
}

export function Strap() {
  const { mats, quality } = useParts();
  const geo = useMemo(() => {
    const { points, facing } = strapPath(0, 0, quality === "high" ? 96 : 48);
    return sweep({ points, facing, profile: roundedRectProfile(DIMS.strap.thickness, DIMS.strap.width, 0.005, 3) });
  }, [quality]);
  return <mesh geometry={geo} material={mats.fabric} />;
}

/** One continuous warm white LED strip along the top of the back strap. */
export function LedStrip() {
  const { mats, quality } = useParts();
  const geo = useMemo(() => {
    const { points, facing } = strapPath(DIMS.strap.thickness / 2 + 0.002, 0.024, quality === "high" ? 96 : 48);
    // keep the strip on the strap, away from the pods
    const n = points.length;
    const trim = Math.round(n * 0.05);
    return sweep({
      points: points.slice(trim, n - trim),
      facing: facing.slice(trim, n - trim),
      profile: roundedRectProfile(0.006, 0.014, 0.003, 2),
    });
  }, [quality]);
  return <mesh geometry={geo} material={mats.ledStrip} />;
}
