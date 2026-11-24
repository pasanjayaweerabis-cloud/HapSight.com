import { demo as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";

/**
 * Clearly labelled space for the real prototype video. No fake footage.
 * Hidden until `demo.enabled` is true (see src/content/site.ts).
 */
export function Demo() {
  if (!t.enabled) return null;
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-16 sm:py-20">
      <RangeMarker id="demo" />
      <Container>
        <div className="flex items-end justify-between gap-8">
          <SectionHeading id={t.id} title={t.title} intro={t.intro} stage />
          {/* the device parks here, small and slowly turning (desktop only) */}
          <StageSlot id="demo" className="hidden h-44 w-72 shrink-0 lg:block" />
        </div>
        <div className="glass mt-10 flex w-full flex-col items-start gap-5 rounded-card p-6 sm:flex-row sm:items-center sm:p-8">
          <span
            aria-hidden="true"
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-stage-line text-stage-accent"
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
          <div>
            <p className="text-xl font-semibold tracking-[-0.02em]">{t.placeholder}</p>
            <p className="mt-1 max-w-measure text-base text-stage-muted">{t.placeholderNote}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
