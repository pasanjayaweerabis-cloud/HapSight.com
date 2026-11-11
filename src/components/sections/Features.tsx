import { features as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

export function Features() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="bg-bg-soft py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((f) => (
            <li key={f.title} className="card rounded-3xl border border-line bg-surface p-7">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon name={f.icon} className="size-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-base text-muted sm:text-lg">{f.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
