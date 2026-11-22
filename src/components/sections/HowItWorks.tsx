"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { howItWorks as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { StageSlot, useStageEnabled, useStageSection } from "@/components/visuals/StageSlot";
import { useIsCompact } from "@/lib/useMediaQuery";
import { STILLS, Still } from "@/components/visuals/Still";
import { howStep } from "@/three/pageTimeline";

export function HowItWorks() {
  const enabled = useStageEnabled();
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative">
      <Container className="pt-24 sm:pt-32">
        <SectionHeading id={t.id} title={t.title} intro={t.intro} stage />
      </Container>
      {enabled ? <ScrollStory /> : <StaticStory />}
    </section>
  );
}

/**
 * Scroll-driven version: the shared 3D device sits in the sticky slot, steps scroll past as
 * normal text. The list's scroll range drives both the text and the 3D (same offsets).
 */
function ScrollStory() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(howStep(v)));
  useStageSection("how-it-works", listRef, "center");
  const compact = useIsCompact();

  return (
    <Container className="relative pb-24 sm:pb-32">
      <div className="grid lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* On phones the 3D view stays on top and the step cards scroll up underneath it. */}
        <StageSlot
          id="how-it-works"
          still={STILLS.howItWorks}
          front={compact}
          className="sticky top-[4.5rem] z-(--z-sticky) -mx-5 h-[42svh] sm:mx-0 lg:z-0 lg:h-[calc(100svh-4.5rem)]"
        />
        {/* z-10: local stacking, above the sticky slot on phones only */}
        <ol ref={listRef} className="relative z-10 pb-[10svh] lg:py-[12vh]">
          {t.steps.map((s, i) => (
            <li
              key={s.id}
              aria-current={active === i ? "step" : undefined}
              className="flex min-h-[56svh] items-end pb-[4svh] lg:min-h-[64svh] lg:items-center lg:pb-0"
            >
              <div
                className={`card w-full rounded-card border p-6 transition-colors duration-300 sm:p-8 ${
                  active === i ? "glass border-stage-accent!" : "glass"
                }`}
              >
                <h3 className="text-2xl font-semibold sm:text-3xl">{s.title}</h3>
                <p className={`mt-3 text-lg ${active === i ? "text-stage-text" : "text-stage-muted"}`}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

/** Reduced motion or no WebGL: one still picture and all steps as text. */
function StaticStory() {
  return (
    <Container className="pb-24 pt-12 sm:pb-32">
      <div aria-hidden="true" className="relative aspect-[16/10] max-h-[70svh] w-full">
        <Still src={STILLS.howItWorks} sizes="(min-width: 1024px) 80vw, 100vw" />
      </div>
      <p className="mt-4 text-base text-stage-muted">{t.reducedMotionNote}</p>
      <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.steps.map((s) => (
          <li key={s.id} className="card rounded-card border border-stage-line p-6">
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-base text-stage-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}
