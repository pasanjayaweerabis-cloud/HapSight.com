import { smooth } from "./geometry";

/**
 * Maps scroll progress (0..1 over the three steps) to what the 3D view shows.
 * Steps: 0 sense (three cones scan left, ahead, right) · 1 decide (an obstacle appears on the
 * left and the left cone picks it up) · 2 feel (the left ear tip vibrates, faster as it gets closer).
 * The text column uses the same `stepIndex`, so words and pictures always agree.
 */
export const STEP_COUNT = 3;

export function stepIndex(p: number): number {
  return Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(p * STEP_COUNT)));
}

export interface HowItWorksState {
  cones: number; // 0..1 opacity of the three detection cones
  /** 0..1 extra brightness of each cone (left, ahead, right) when it sees something. */
  hit: readonly [number, number, number];
  motorLeft: number; // 0..1 vibration strength
  motorRight: number;
  pulseRate: number; // pulses per second
  obstacleLeft: number; // 0..1 visibility
  obstacleAhead: number;
  obstacleRight: number;
  distance: number; // scene units from the sensor to the obstacle
}

export function timeline(p: number): HowItWorksState {
  const s = Math.min(STEP_COUNT - 1e-4, Math.max(0, p * STEP_COUNT));
  const i = Math.floor(s);
  const local = s - i;

  const obstacle = i === 0 ? 0 : i === 1 ? smooth(local / 0.35) : 1;
  const hit = i === 0 ? 0 : i === 1 ? smooth((local - 0.25) / 0.35) : 1;
  const approach = i === 2 ? smooth(local / 0.85) : 0;

  return {
    cones: smooth(s / 0.55),
    hit: [hit, 0, 0],
    motorLeft: i === 2 ? smooth(local / 0.18) : 0,
    motorRight: 0,
    pulseRate: 1.2 + 2.8 * approach,
    obstacleLeft: obstacle,
    obstacleAhead: 0,
    obstacleRight: 0,
    distance: 1.9 - 0.95 * approach,
  };
}

/** A representative still for reduced motion: cones on, obstacle on the left, left motor active. */
export const STILL_PROGRESS = 2.55 / STEP_COUNT;
