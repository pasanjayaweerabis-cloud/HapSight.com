"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { insideArms as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { StageSlot, useStageEnabled, useStageSection } from "@/components/visuals/StageSlot";
import { insideSide } from "@/three/pageTimeline";

type Side = (typeof t.sides)[number];

function SideCard({ s, active }: { s: Side; active?: boolean }) {
  return (
    <div className={`glass card rounded-card p-7 transition-colors duration-300 ${active ? "border-stage-accent!" : ""}`}>
      <h3 className="text-card font-semibold tracking-[-0.01em]">{s.title}</h3>
      <ul className="mt-4 grid list-disc gap-2 pl-5 text-base text-stage-text marker:text-stage-accent">
        {s.parts.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="mt-4 text-base text-stage-muted">{s.body}</p>
    </div>
  );
}

/**
 * A short beat after the exploded view: the temple shells turn see-through, first the left arm
 * (controller, drivers, signal dots travelling to the motor), then the right (battery, charger).
 */
export function InsideArms() {
  const enabled = useStageEnabled();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [side, setSide] = useState<"left" | "right">("left");
  useMotionValueEvent(scrollYProgress, "change", (v) => setSide(insideSide(v)));
  useStageSection("inside", track, "pin");

  const signal = (
    <p className="mt-6 text-base text-stage-muted">
      <span className="font-semibold text-stage-text">{t.signalLabel}:</span> {t.signal}
    </p>
  );

  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative">
      <Container className="pt-24 sm:pt-32">
        <SectionHeading id={t.id} title={t.title} intro={t.intro} stage />
      </Container>
      {enabled ? (
        <div ref={track} className="h-[200svh]">
          <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)]">
            <Container className="grid h-full content-center gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-center">
              <div className="order-2 lg:order-1">
                {/* both cards stay in the DOM (reading order); the inactive one is quieter */}
                <div className="grid gap-4">
                  {t.sides.map((s) => (
                    <SideCard key={s.id} s={s} active={side === s.id} />
                  ))}
                </div>
                {signal}
              </div>
              <StageSlot id="inside" className="order-1 h-[34svh] lg:order-2 lg:h-[70svh]" />
            </Container>
          </div>
        </div>
      ) : (
        <Container className="grid gap-5 pb-24 pt-12 sm:pb-32 md:grid-cols-2">
          {t.sides.map((s) => (
            <SideCard key={s.id} s={s} />
          ))}
          <div className="md:col-span-2">{signal}</div>
        </Container>
      )}
    </section>
  );
}
