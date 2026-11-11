"use client";

import { createContext, useContext } from "react";
import type * as THREE from "three";
import type { MaterialKey } from "../materials";

export interface PartsContextValue {
  mats: Record<MaterialKey, THREE.Material>;
  /** "low" on phones: fewer segments, no tiny details. */
  quality: "high" | "low";
}

export const PartsContext = createContext<PartsContextValue | null>(null);

export function useParts(): PartsContextValue {
  const v = useContext(PartsContext);
  if (!v) throw new Error("useParts must be used inside <Device>");
  return v;
}
