import type { LabelId } from "@/content/site";

/**
 * Shared between the Explore section (DOM controls) and its 3D scene. No three.js imports here,
 * so the section can use it without pulling the 3D bundle into the page.
 */

/** Short demos of how a warning works: the sensors on, or an obstacle on one side. */
export type ActionId = "sensors" | "left" | "ahead" | "right";
export const ACTION_IDS: ActionId[] = ["sensors", "left", "ahead", "right"];

export type LayerId = "assembled" | "half" | "full";
export const LAYER_IDS: LayerId[] = ["assembled", "half", "full"];
export const LAYER_EXPLODE: Record<LayerId, number> = { assembled: 0, half: 0.5, full: 1 };

export interface ExploreSceneProps {
  /** The demo playing, or null. Demos show the glasses assembled, seen from behind the wearer. */
  action: ActionId | null;
  explode: number;
  /** The part opened up and flown to, or null for the whole device. */
  focus: LabelId | null;
  /** Each zoom button press bumps `n`; `dir` 1 = closer, −1 = further. */
  zoom: { n: number; dir: 1 | -1 };
  /** Bumped by the reset button so the camera returns even if nothing else changed. */
  resetN: number;
  compact: boolean;
  /** A part was clicked or tapped on the model (not dragged). */
  onPick?: (label: LabelId) => void;
}
