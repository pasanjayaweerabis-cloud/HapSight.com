import { Container } from "@/components/ui/Section";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: readonly { heading: string; body: readonly string[] }[];
}) {
  return (
    <Container className="py-20 sm:py-28">
      <article className="prose-legal max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base text-muted">{updated}</p>
        {sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </article>
    </Container>
  );
}
