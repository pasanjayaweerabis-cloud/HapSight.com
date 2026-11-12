"use client";

import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Device } from "../Device";
import { SCENES } from "../deviceConfig";
import { StageCanvas } from "../StageCanvas";
import type { StageSceneProps } from "@/components/visuals/LazyStage";

export interface HeroSceneProps {
  reducedMotion: boolean;
  compact: boolean;
  touch: boolean;
}

export default function HeroScene({ active, onReady, reducedMotion, compact, touch }: HeroSceneProps & StageSceneProps) {
  const s = SCENES.hero;
  return (
    <StageCanvas active={active} onReady={onReady} camera={s.camera} target={s.target} fitAspect={1.1} fov={s.fov} compact={compact}>
      <Device quality={compact ? "low" : "high"} />
      <ContactShadows position={[0, -0.36, -0.1]} opacity={0.5} scale={3.4} blur={2.6} far={1} frames={1} resolution={256} />
      <OrbitControls
        target={s.target as [number, number, number]}
        enablePan={false}
        enableZoom={false}
        enableRotate={!touch}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.7}
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.56}
      />
    </StageCanvas>
  );
}
