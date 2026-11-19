import type { LabelId } from "@/content/site";

/**
 * Shared between the Explore section (DOM controls) and its 3D scene. No three.js imports here,
 * so the section can use it without pulling the 3D bundle into the page.
 */
export type ViewId = "angle" | "front" | "side" | "top";
export const VIEW_IDS: ViewId[] = ["angle", "front", "side", "top"];

export type LayerId = "assembled" | "half" | "full";
export const LAYER_IDS: LayerId[] = ["assembled", "half", "full"];
export const LAYER_EXPLODE: Record<LayerId, number> = { assembled: 0, half: 0.5, full: 1 };

/** Parts that sit inside a temple or ear tip: picking one opens the glasses up first. */
export const INTERNAL_PARTS: LabelId[] = ["controller", "drivers", "battery", "charger", "motorLeft", "motorRight"];

export interface ExploreSceneProps {
  view: ViewId;
  explode: number;
  focus: LabelId | null;
  /** Each zoom button press bumps `n`; `dir` 1 = closer, −1 = further. */
  zoom: { n: number; dir: 1 | -1 };
  /** Bumped by the reset button so the camera returns even if the view did not change. */
  resetN: number;
  compact: boolean;
}
