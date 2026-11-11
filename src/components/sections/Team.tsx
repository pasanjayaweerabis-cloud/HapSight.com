import { team as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

export function Team() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {t.members.map((m) => (
            <li key={m.name} className="card rounded-3xl border border-line p-6">
              {/* Placeholder avatar: initial on a teal disc. Decorative; the name is the text below. */}
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-teal text-2xl font-semibold text-teal-light"
              >
                {m.name.charAt(0)}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{m.name}</h3>
              <p className="mt-1 text-base text-muted">{m.role}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
