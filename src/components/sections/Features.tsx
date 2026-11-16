"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { features as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { StageSlot, useStageEnabled, useStageSection } from "@/components/visuals/StageSlot";
import { useIsCompact } from "@/lib/useMediaQuery";
import { featureIndex } from "@/three/pageTimeline";

type Item = (typeof t.items)[number];

function Card({ f, active }: { f: Item; active?: boolean }) {
  return (
    <div className={`glass card rounded-3xl p-7 transition-colors duration-300 ${active ? "border-stage-accent!" : ""}`}>
      <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-stage-line text-stage-accent">
        <Icon name={f.icon} className="size-7" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{f.title}</h3>
      <p className={`mt-2 text-base sm:text-lg ${active === false ? "text-stage-muted" : "text-stage-text"}`}>{f.body}</p>
    </div>
  );
}

/**
 * With 3D: the cards scroll past a sticky view of the device, which turns to the part each
 * card is about (sensors, motors, battery and charger…). Without 3D: a plain grid.
 */
export function Features() {
  const enabled = useStageEnabled();
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative">
      <Container className="pt-24 sm:pt-32">
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
      </Container>
      {enabled ? (
        <ScrollFeatures />
      ) : (
        <Container className="pb-24 pt-14 sm:pb-32">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.items.map((f) => (
              <li key={f.title}>
                <Card f={f} />
              </li>
            ))}
          </ul>
        </Container>
      )}
    </section>
  );
}

function ScrollFeatures() {
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(featureIndex(v)));
  useStageSection("features", listRef, "center");
  const compact = useIsCompact();
  return (
    <Container className="pb-24 sm:pb-32">
      <div className="grid lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <StageSlot
          id="features"
          front={compact}
          className="sticky top-[4.5rem] z-20 -mx-5 h-[38svh] sm:mx-0 lg:order-2 lg:z-0 lg:h-[calc(100svh-4.5rem)]"
        />
        <ul ref={listRef} className="relative z-10 pb-[10svh] lg:order-1 lg:py-[18vh]">
          {t.items.map((f, i) => (
            <li
              key={f.title}
              aria-current={active === i ? "true" : undefined}
              className="flex min-h-[48svh] items-end pb-[4svh] lg:min-h-[62svh] lg:items-center lg:pb-0"
            >
              <Card f={f} active={active === i} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
