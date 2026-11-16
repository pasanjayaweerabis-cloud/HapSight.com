import { demo as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";

/** Clearly labelled space for the real prototype video. No fake footage. */
export function Demo() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-24 sm:py-32">
      <RangeMarker id="demo" />
      <Container>
        <div className="flex items-end justify-between gap-8">
          <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
          {/* the device parks here, small and slowly turning (desktop only) */}
          <StageSlot id="demo" className="hidden h-44 w-72 shrink-0 lg:block" />
        </div>
        <div className="glass mt-12 flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center">
          <span
            aria-hidden="true"
            className="inline-flex size-16 items-center justify-center rounded-full border border-stage-line text-stage-accent"
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
          <p className="text-2xl font-semibold tracking-[-0.03em]">{t.placeholder}</p>
          <p className="max-w-md text-base text-stage-muted">{t.placeholderNote}</p>
        </div>
      </Container>
    </section>
  );
}
