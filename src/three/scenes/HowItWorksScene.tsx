"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Device } from "../Device";
import { SCENES } from "../deviceConfig";
import { StageCanvas } from "../StageCanvas";
import { SensorCones, sensorDirections } from "../effects/SensorCones";
import { PulseRings } from "../effects/PulseRings";
import { timeline, type HowItWorksState } from "../howItWorksTimeline";
import type { StageSceneProps } from "@/components/visuals/LazyStage";

export interface HowItWorksSceneProps {
  /** Scroll progress 0..1, read every frame. */
  getProgress: () => number;
  /** False for reduced motion: rings do not animate and nothing eases. */
  animate: boolean;
  compact: boolean;
}

function Obstacle({ getState, which }: { getState: () => HowItWorksState; which: "left" | "ahead" | "right" }) {
  const ref = useRef<THREE.Group>(null);
  const box = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e6ecf5", roughness: 0.7, transparent: true, opacity: 0 }),
    [],
  );
  const cone = useMemo(() => sensorDirections()[which === "left" ? 0 : which === "ahead" ? 1 : 2], [which]);
  useFrame(() => {
    const s = getState();
    const v = which === "left" ? s.obstacleLeft : which === "right" ? s.obstacleRight : s.obstacleAhead;
    if (box.current) (box.current.material as THREE.MeshStandardMaterial).opacity = v * 0.92;
    if (!ref.current) return;
    ref.current.visible = v > 0.01;
    // a signboard at head height, in the middle of that sensor's view
    ref.current.position.copy(cone.origin).addScaledVector(cone.dir, s.distance);
    ref.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cone.dir);
  });
  return (
    <group ref={ref}>
      <RoundedBox ref={box} args={[0.42, 0.34, 0.05]} radius={0.02} smoothness={3} material={mat} />
    </group>
  );
}

export default function HowItWorksScene({
  active,
  onReady,
  getProgress,
  animate,
  compact,
}: HowItWorksSceneProps & StageSceneProps) {
  const s = SCENES.howItWorks;
  return (
    <StageCanvas
      active={active}
      onReady={onReady}
      camera={s.camera}
      target={s.target}
      fitAspect={1.05}
      fov={s.fov}
      compact={compact}
      demand={!animate}
    >
      <Story getProgress={getProgress} animate={animate} compact={compact} />
    </StageCanvas>
  );
}

function Story({ getProgress, animate, compact }: HowItWorksSceneProps) {
  const state = useRef<HowItWorksState>(timeline(getProgress()));
  const smoothP = useRef(-1);

  const getState = () => state.current;

  useFrame((_, dt) => {
    const target = getProgress();
    smoothP.current = animate && smoothP.current >= 0 ? THREE.MathUtils.damp(smoothP.current, target, 6, dt) : target;
    state.current = timeline(smoothP.current);
  });

  return (
    <>
      <Device quality={compact ? "low" : "high"} />
      <SensorCones getOpacity={() => getState().cones} getHighlight={() => getState().hit} />
      <PulseRings side="left" getStrength={() => getState().motorLeft} getRate={() => getState().pulseRate} animate={animate} />
      <PulseRings side="right" getStrength={() => getState().motorRight} getRate={() => getState().pulseRate} animate={animate} />
      <Obstacle getState={getState} which="left" />
      <Obstacle getState={getState} which="ahead" />
      <Obstacle getState={getState} which="right" />
    </>
  );
}
