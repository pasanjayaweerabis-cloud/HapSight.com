"use client";

import { useCallback, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { howItWorks as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { HowItWorksVisual } from "@/components/visuals/HowItWorksVisual";
import { useReducedMotion } from "@/lib/a11yPrefs";
import { useWebGLSupport } from "@/lib/webgl";
import { useIsCompact } from "@/lib/useMediaQuery";
import { STILL_PROGRESS, stepIndex } from "@/three/howItWorksTimeline";

export function HowItWorks() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const compact = useIsCompact();
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative">
      <Container className="pt-24 sm:pt-32">
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
      </Container>
      {reduced || !webgl ? <StaticStory compact={compact} /> : <ScrollStory compact={compact} />}
    </section>
  );
}

/** Scroll-driven version: sticky 3D view, steps scroll past as normal text. */
function ScrollStory({ compact }: { compact: boolean }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(stepIndex(v)));
  const getProgress = useCallback(() => scrollYProgress.get(), [scrollYProgress]);

  return (
    <Container className="relative pb-24 sm:pb-32">
      <div className="grid lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* On phones the 3D view stays on top and the step cards scroll up underneath it. */}
        <div className="sticky top-[4.5rem] z-20 -mx-5 h-[42svh] bg-stage sm:mx-0 lg:z-0 lg:h-[calc(100svh-4.5rem)]">
          <HowItWorksVisual getProgress={getProgress} animate compact={compact} />
        </div>
        <ol ref={listRef} className="relative z-10 pb-[10svh] lg:py-[20vh]">
          {t.steps.map((s, i) => (
            <li
              key={s.id}
              aria-current={active === i ? "step" : undefined}
              className="flex min-h-[56svh] items-end pb-[4svh] lg:min-h-[78svh] lg:items-center lg:pb-0"
            >
              <div
                className={`card w-full rounded-3xl border p-6 transition-colors duration-300 sm:p-8 ${
                  active === i ? "border-stage-accent bg-stage" : "border-stage-line bg-stage/90"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-stage-accent">
                  {s.number} / {t.steps.length}
                </p>
                <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">{s.title}</h3>
                <p className={`mt-3 text-lg ${active === i ? "text-stage-text" : "text-stage-muted"}`}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

/** Reduced motion or no WebGL: one still view (cones on, left ear vibrating) and all steps as text. */
function StaticStory({ compact }: { compact: boolean }) {
  const getProgress = useCallback(() => STILL_PROGRESS, []);
  return (
    <Container className="pb-24 pt-12 sm:pb-32">
      <div className="aspect-[16/10] max-h-[70svh] w-full">
        <HowItWorksVisual getProgress={getProgress} animate={false} compact={compact} />
      </div>
      <p className="mt-4 text-base text-stage-muted">{t.reducedMotionNote}</p>
      <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.steps.map((s) => (
          <li key={s.id} className="card rounded-3xl border border-stage-line p-6">
            <p className="text-sm font-semibold tabular-nums text-stage-accent">
              {s.number} / {t.steps.length}
            </p>
            <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-base text-stage-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}
