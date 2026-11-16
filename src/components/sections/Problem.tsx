import { problem as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";

export function Problem() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-24 sm:py-32">
      <RangeMarker id="problem" />
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} stage />
          <div className="mt-8 grid max-w-2xl gap-5 text-lg text-stage-muted sm:text-xl">
            {t.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="grid content-end gap-6">
          {/* side view at head height: a branch ahead, and the low arc a cane can reach */}
          <StageSlot id="problem" className="aspect-[4/3] w-full" />
          <div className="glass rounded-3xl p-8 sm:p-10">
            <h3 className="text-xl font-semibold">{t.examplesTitle}</h3>
            <ul className="mt-6 grid gap-4">
              {t.examples.map((e) => (
                <li key={e} className="flex items-start gap-4 text-lg">
                  <span aria-hidden="true" className="mt-2.5 size-2.5 shrink-0 rounded-full bg-stage-accent" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
