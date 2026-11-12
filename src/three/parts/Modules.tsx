"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { earTip, type Side } from "../deviceConfig";
import { useParts } from "./context";

/*
 * Electronic modules. Each one is built in its own local frame: +z = the component side
 * (the side you see), +y = up when assembled, +x = along the temple (see deviceConfig).
 */

const AXIS_Z: [number, number, number] = [Math.PI / 2, 0, 0]; // cylinder Y axis → local Z
const AXIS_X: [number, number, number] = [0, 0, Math.PI / 2]; // cylinder Y axis → local X

/** Gold-plated mounting hole. */
function Hole({ x, y, z, r = 0.011 }: { x: number; y: number; z: number; r?: number }) {
  const { mats } = useParts();
  return (
    <group position={[x, y, z]}>
      <mesh material={mats.gold}>
        <torusGeometry args={[r, r * 0.38, 8, 20]} />
      </mesh>
      <mesh material={mats.port} position={[0, 0, -0.0005]}>
        <circleGeometry args={[r * 0.65, 16]} />
      </mesh>
    </group>
  );
}

/** Tiny surface-mount parts scattered on a board. */
function Smd({ at, z }: { at: [number, number][]; z: number }) {
  const { mats, quality } = useParts();
  if (quality === "low") return null;
  return (
    <>
      {at.map(([x, y], i) => (
        <mesh key={i} position={[x, y, z]} material={i % 3 === 0 ? mats.chip : mats.smd}>
          <boxGeometry args={[0.012, 0.007, 0.005]} />
        </mesh>
      ))}
    </>
  );
}

/** VL53L1X laser distance sensor: black board, gold mounting holes, dark lens with a purple tint. */
export function Sensor() {
  const { mats, quality } = useParts();
  const t = 0.008;
  return (
    <group>
      <mesh material={mats.pcbBlack}>
        <boxGeometry args={[0.122, 0.058, t]} />
      </mesh>
      <Hole x={0.044} y={0} z={t / 2 + 0.001} r={0.0105} />
      <Hole x={-0.044} y={0} z={t / 2 + 0.001} r={0.0105} />
      {/* lens housing */}
      <RoundedBox args={[0.034, 0.03, 0.014]} radius={0.004} smoothness={2} position={[0, -0.002, t / 2 + 0.007]} material={mats.chip} />
      <mesh material={mats.sensorLens} position={[0, -0.002, t / 2 + 0.0141]}>
        <circleGeometry args={[0.0085, quality === "high" ? 24 : 12]} />
      </mesh>
      <mesh material={mats.port} position={[0, -0.002, t / 2 + 0.014]}>
        <ringGeometry args={[0.0085, 0.0115, quality === "high" ? 24 : 12]} />
      </mesh>
      <Smd at={[[-0.012, 0.02], [0.004, 0.021], [0.016, 0.02]]} z={t / 2 + 0.0025} />
    </group>
  );
}

/** ESP32-C3 SuperMini: black board with a silver shield can and castellated gold edge pads. */
export function Controller() {
  const { mats, quality } = useParts();
  const w = 0.2;
  const h = 0.15;
  const t = 0.012;
  const pads = useMemo(() => Array.from({ length: 8 }, (_, i) => -0.08 + i * (0.16 / 7)), []);
  return (
    <group>
      <mesh material={mats.pcbBlack}>
        <boxGeometry args={[w, h, t]} />
      </mesh>
      <RoundedBox args={[0.085, 0.09, 0.016]} radius={0.003} smoothness={2} position={[0.025, 0, t / 2 + 0.008]} material={mats.silver} />
      {quality === "high"
        ? pads.map((x) =>
            [h / 2 - 0.006, -h / 2 + 0.006].map((y) => (
              <mesh key={`${x}-${y}`} position={[x, y, t / 2 + 0.0005]} material={mats.gold}>
                <boxGeometry args={[0.011, 0.012, 0.001]} />
              </mesh>
            )),
          )
        : null}
      {[
        [w / 2 - 0.016, h / 2 - 0.024],
        [-w / 2 + 0.016, h / 2 - 0.024],
        [w / 2 - 0.016, -h / 2 + 0.024],
        [-w / 2 + 0.016, -h / 2 + 0.024],
      ].map(([x, y]) => (
        <Hole key={`${x}-${y}`} x={x} y={y} z={t / 2 + 0.001} r={0.01} />
      ))}
      <mesh material={mats.chip} position={[-0.05, 0.012, t / 2 + 0.003]}>
        <boxGeometry args={[0.026, 0.026, 0.006]} />
      </mesh>
      <Smd at={[[-0.05, -0.03], [-0.03, -0.035], [-0.07, -0.03], [-0.065, 0.04], [0.075, 0.0]]} z={t / 2 + 0.0025} />
    </group>
  );
}

/** One MOSFET motor driver: small green board with the switch, a flyback diode and resistors. */
export function Driver() {
  const { mats } = useParts();
  const w = 0.105;
  const h = 0.1;
  const t = 0.01;
  return (
    <group>
      <mesh material={mats.pcbGreen}>
        <boxGeometry args={[w, h, t]} />
      </mesh>
      <mesh material={mats.chip} position={[0, 0.006, t / 2 + 0.004]}>
        <boxGeometry args={[0.036, 0.03, 0.008]} />
      </mesh>
      {/* flyback diode */}
      <group position={[0, -0.03, t / 2 + 0.005]}>
        <mesh material={mats.chip} rotation={AXIS_X}>
          <cylinderGeometry args={[0.005, 0.005, 0.024, 12]} />
        </mesh>
        <mesh material={mats.silver} rotation={AXIS_X} position={[0.008, 0, 0]}>
          <cylinderGeometry args={[0.0053, 0.0053, 0.004, 12]} />
        </mesh>
      </group>
      {[
        [w / 2 - 0.013, h / 2 - 0.013],
        [-w / 2 + 0.013, h / 2 - 0.013],
        [w / 2 - 0.013, -h / 2 + 0.013],
        [-w / 2 + 0.013, -h / 2 + 0.013],
      ].map(([x, y]) => (
        <Hole key={`${x}-${y}`} x={x} y={y} z={t / 2 + 0.001} r={0.008} />
      ))}
      <Smd at={[[0.028, 0.03], [-0.028, 0.03], [0.026, -0.012]]} z={t / 2 + 0.0025} />
    </group>
  );
}

/**
 * LiPo 3.7 V 500 mAh: silver pouch with a yellow kapton edge, red/black lead and a JST plug.
 * In the right temple local +x points forward, so the lead leaves from the −x (rear) end.
 */
export function Battery() {
  const { mats } = useParts();
  const w = 0.27;
  const h = 0.135;
  const t = 0.035;
  return (
    <group>
      <RoundedBox args={[w, h, t]} radius={0.008} smoothness={3} material={mats.pouch} />
      <RoundedBox args={[0.024, h + 0.002, t + 0.002]} radius={0.006} smoothness={2} position={[w / 2 - 0.012, 0, 0]} material={mats.kapton} />
      {[
        [0.012, mats.wireRed],
        [-0.004, mats.wireBlack],
      ].map(([y, m]) => (
        <mesh key={String(y)} material={m as THREE.Material} rotation={AXIS_X} position={[-w / 2 - 0.026, y as number, 0.004]}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.052, 8]} />
        </mesh>
      ))}
      <RoundedBox args={[0.026, 0.03, 0.016]} radius={0.003} smoothness={2} position={[-w / 2 - 0.062, 0.004, 0.004]} material={mats.connector} />
    </group>
  );
}

/** TP4056 USB-C charger with protection: blue board, the port at the rear (−x) end. */
export function Charger() {
  const { mats } = useParts();
  const w = 0.17;
  const h = 0.105;
  const t = 0.01;
  return (
    <group>
      <mesh material={mats.pcbBlue}>
        <boxGeometry args={[w, h, t]} />
      </mesh>
      <RoundedBox args={[0.056, 0.044, 0.02]} radius={0.007} smoothness={3} position={[-w / 2 - 0.03, 0, t / 2 + 0.01]} material={mats.silver} />
      <mesh material={mats.port} position={[-w / 2 - 0.0585, 0, t / 2 + 0.01]}>
        <boxGeometry args={[0.002, 0.03, 0.009]} />
      </mesh>
      <mesh material={mats.chip} position={[0.01, 0.01, t / 2 + 0.004]}>
        <boxGeometry args={[0.04, 0.03, 0.008]} />
      </mesh>
      <mesh material={mats.chip} position={[0.05, -0.025, t / 2 + 0.003]}>
        <boxGeometry args={[0.022, 0.018, 0.006]} />
      </mesh>
      {/* battery and output pads at the front end */}
      {[0.034, 0.012, -0.012, -0.034].map((y) => (
        <mesh key={y} position={[w / 2 - 0.012, y, t / 2 + 0.0005]} material={mats.gold}>
          <boxGeometry args={[0.014, 0.014, 0.001]} />
        </mesh>
      ))}
      <Smd at={[[-0.02, 0.035], [-0.035, -0.03], [0.03, 0.035], [-0.01, -0.035]]} z={t / 2 + 0.0025} />
    </group>
  );
}

/**
 * Coin vibration motor: silver disc, red lead, small connector. Its flat face (+z) presses
 * towards the head. The lead runs forward along the arm, which is local +x on the left side
 * and −x on the right, so it is built per side from a mirrored input.
 */
export function Motor({ side }: { side: Side }) {
  const { mats, quality } = useParts();
  const fwd = side === "left" ? 1 : -1;
  const seg = quality === "high" ? 36 : 20;
  // the lead runs back up the arm: opposite to the ear tip's direction, in the motor's frame
  const tip = earTip(side).dir;
  const along = new THREE.Vector2(fwd * -tip.z, -tip.y).normalize();
  const angle = Math.atan2(along.y, along.x);
  const at = (d: number, off = 0): [number, number, number] => [
    along.x * d - along.y * off,
    along.y * d + along.x * off,
    -0.004,
  ];
  return (
    <group>
      <mesh material={mats.silver} rotation={AXIS_Z}>
        <cylinderGeometry args={[0.04, 0.04, 0.024, seg]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0, -0.006]}>
        <torusGeometry args={[0.0395, 0.004, 8, seg]} />
      </mesh>
      <mesh material={mats.chip} position={[0, 0, 0.0122]}>
        <circleGeometry args={[0.031, seg]} />
      </mesh>
      {[
        [0.006, mats.wireRed],
        [-0.006, mats.wireBlack],
      ].map(([off, m]) => (
        <mesh
          key={String(off)}
          material={m as THREE.Material}
          rotation={[0, 0, angle - Math.PI / 2]}
          position={at(0.058, off as number)}
        >
          <cylinderGeometry args={[0.0032, 0.0032, 0.04, 8]} />
        </mesh>
      ))}
      <RoundedBox
        args={[0.024, 0.022, 0.014]}
        radius={0.003}
        smoothness={2}
        position={at(0.088)}
        rotation={[0, 0, angle]}
        material={mats.connector}
      />
    </group>
  );
}
