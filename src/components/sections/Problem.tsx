import { problem as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

export function Problem() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} />
          <div className="mt-8 grid max-w-2xl gap-5 text-lg text-muted sm:text-xl">
            {t.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="card self-end rounded-3xl border border-line bg-bg-soft p-8 sm:p-10">
          <h3 className="text-xl font-semibold">{t.examplesTitle}</h3>
          <ul className="mt-6 grid gap-4">
            {t.examples.map((e) => (
              <li key={e} className="flex items-start gap-4 text-lg">
                <span aria-hidden="true" className="mt-2.5 size-2.5 shrink-0 rounded-full bg-accent" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
