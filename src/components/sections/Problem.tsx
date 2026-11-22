import { problem as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";

export function Problem() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-16 sm:py-20">
      <RangeMarker id="problem" />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading id={t.id} title={t.title} stage />
          <div className="mt-8 grid max-w-[65ch] gap-5 text-lg text-stage-muted sm:text-xl">
            {t.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="glass mt-10 rounded-card p-8 sm:p-10">
            <h3 className="text-xl font-semibold">{t.examplesTitle}</h3>
            <ul className="mt-6 grid list-disc gap-4 pl-5 text-lg marker:text-stage-accent">
              {t.examples.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* side view at head height: a branch ahead, and the low arc a cane can reach */}
        <StageSlot id="problem" className="aspect-[4/3] w-full" />
      </Container>
    </section>
  );
}
