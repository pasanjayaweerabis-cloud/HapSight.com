"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { hasWebGL } from "@/lib/webgl";

export interface StageSceneProps {
  /** False while the stage is off-screen: the scene stops rendering frames. */
  active: boolean;
  /** Called after the first frame is drawn, so the placeholder can fade out. */
  onReady: () => void;
}

/**
 * Lazy 3D stage:
 * - the scene module (three.js, R3F) is only downloaded when the stage comes near the viewport
 *   (and, for `deferUntilIdle`, after the page has loaded and the browser is idle);
 * - rendering pauses while the stage is off-screen;
 * - without WebGL, the static `fallback` stays.
 * The whole stage is decorative (aria-hidden); everything it shows is also written as text.
 */
export function LazyStage<P extends object>({
  load,
  sceneProps,
  fallback,
  deferUntilIdle = false,
  deferUntilInteraction = false,
  className = "",
}: {
  load: () => Promise<{ default: ComponentType<P & StageSceneProps> }>;
  sceneProps: P;
  fallback: React.ReactNode;
  deferUntilIdle?: boolean;
  /** Phones: keep the still until the visitor first touches, scrolls or presses a key. */
  deferUntilInteraction?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<ComponentType<P & StageSceneProps> | null>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const loadRef = useRef(load);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasWebGL()) return;
    let cancelled = false;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      const go = () =>
        loadRef.current().then((m) => {
          if (!cancelled) setScene(() => m.default);
        });
      if (deferUntilInteraction) {
        const events = ["pointerdown", "touchstart", "scroll", "keydown", "wheel"] as const;
        const once = () => {
          events.forEach((ev) => window.removeEventListener(ev, once));
          go();
        };
        events.forEach((ev) => window.addEventListener(ev, once, { passive: true }));
        return;
      }
      if (!deferUntilIdle) return void go();
      const idle = () =>
        "requestIdleCallback" in window ? window.requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 600);
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    };

    const near = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && start(), {
      rootMargin: "600px 0px",
    });
    const visible = new IntersectionObserver((entries) => setActive(entries.some((e) => e.isIntersecting)), {
      rootMargin: "100px 0px",
    });
    near.observe(el);
    visible.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      visible.disconnect();
    };
  }, [deferUntilIdle, deferUntilInteraction]);

  return (
    <div ref={ref} aria-hidden="true" className={`relative size-full ${className}`}>
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
        {fallback}
      </div>
      {Scene ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Scene {...sceneProps} active={active} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
