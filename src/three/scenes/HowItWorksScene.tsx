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

function Obstacle({ getState, which }: { getState: () => HowItWorksState; which: "left" | "right" | "ahead" }) {
  const ref = useRef<THREE.Group>(null);
  const box = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e8ebe9", roughness: 0.7, transparent: true, opacity: 0 }),
    [],
  );
  const [dl, dr] = useMemo(() => sensorDirections(), []);
  useFrame(() => {
    const s = getState();
    const v = which === "left" ? s.obstacleLeft : which === "right" ? s.obstacleRight : s.obstacleAhead;
    if (box.current) (box.current.material as THREE.MeshStandardMaterial).opacity = v * 0.92;
    if (!ref.current) return;
    ref.current.visible = v > 0.01;
    if (which === "ahead") ref.current.position.set(0, 0.05, 0.9 + s.aheadDistance);
    else {
      const d = which === "left" ? dl : dr;
      ref.current.position.copy(d.origin).addScaledVector(d.dir, 1.55).setY(0.05);
    }
  });
  return (
    <group ref={ref}>
      {/* a simple signboard-like obstacle at head height */}
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
  const wearer = useRef<THREE.Group>(null);
  const smoothP = useRef(-1);

  const getState = () => state.current;

  useFrame((_, dt) => {
    const target = getProgress();
    smoothP.current = animate && smoothP.current >= 0 ? THREE.MathUtils.damp(smoothP.current, target, 6, dt) : target;
    state.current = timeline(smoothP.current);
    const st = state.current;
    if (wearer.current) {
      wearer.current.rotation.y = -0.5 * st.turn;
      wearer.current.position.x = -0.35 * st.turn;
    }
  });

  return (
    <>
      <group ref={wearer}>
        <Device quality={compact ? "low" : "high"} />
        <SensorCones getOpacity={() => getState().cones} />
        <PulseRings side="left" getStrength={() => getState().padLeft} getRate={() => getState().pulseRate} animate={animate} />
        <PulseRings side="right" getStrength={() => getState().padRight} getRate={() => getState().pulseRate} animate={animate} />
      </group>
      <Obstacle getState={getState} which="left" />
      <Obstacle getState={getState} which="right" />
      <Obstacle getState={getState} which="ahead" />
    </>
  );
}
