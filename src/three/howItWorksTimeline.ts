import { smooth } from "./geometry";

/**
 * Maps scroll progress (0..1 over the five steps) to what the 3D view shows.
 * Steps: 0 sense · 1 feel left · 2 feel right · 3 feel ahead · 4 move.
 * The text column uses the same `stepIndex`, so words and pictures always agree.
 */
export const STEP_COUNT = 5;

export function stepIndex(p: number): number {
  return Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(p * STEP_COUNT)));
}

/** Smooth bump: 0 at the edges of a step, 1 in its middle. */
function bump(local: number): number {
  return smooth(local / 0.18) * smooth((1 - local) / 0.18);
}

export interface HowItWorksState {
  cones: number; // 0..1 opacity of the sensing cones
  padLeft: number; // 0..1 vibration strength
  padRight: number;
  pulseRate: number; // pulses per second
  obstacleLeft: number; // 0..1 visibility
  obstacleRight: number;
  obstacleAhead: number;
  aheadDistance: number; // scene units
  turn: number; // 0..1 how far the wearer has turned/stepped
}

export function timeline(p: number): HowItWorksState {
  const s = Math.min(STEP_COUNT - 1e-4, Math.max(0, p * STEP_COUNT));
  const i = Math.floor(s);
  const local = s - i;
  const at = (k: number) => (i === k ? bump(local) : 0);

  const ahead = i === 3 ? smooth(local / 0.18) : i === 4 ? 1 - smooth((local - 0.35) / 0.45) : 0;
  const turn = i === 4 ? smooth(local / 0.7) : 0;
  const aheadDistance = i === 3 ? 2.3 - 0.8 * smooth(local) : 1.5;

  return {
    cones: smooth(s / 0.5),
    padLeft: Math.max(at(1), i === 3 ? ahead : 0, i === 4 ? ahead * (1 - turn) : 0),
    padRight: Math.max(at(2), i === 3 ? ahead : 0, i === 4 ? ahead * (1 - turn) : 0),
    pulseRate: i === 3 ? 1.4 + 2.2 * smooth(local) : 1.6,
    obstacleLeft: at(1),
    obstacleRight: at(2),
    obstacleAhead: ahead,
    aheadDistance,
    turn,
  };
}

/** A representative still for reduced motion: cones on, obstacle ahead, both pads active. */
export const STILL_PROGRESS = 3.55 / STEP_COUNT;
