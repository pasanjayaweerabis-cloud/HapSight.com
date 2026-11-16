import { comparison as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

export function Comparison() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="bg-bg-soft py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} />

        {/* Desktop and tablet: a real table. */}
        <div className="mt-12 hidden overflow-hidden rounded-3xl border border-line bg-surface md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{t.caption}</caption>
            <thead>
              <tr className="border-b border-line">
                <td className="w-1/4 p-6" />
                {t.columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-6 text-lg font-semibold ${i === 0 ? "bg-accent-soft text-accent" : ""}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="p-6 align-top text-base font-semibold">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`p-6 align-top text-base text-muted ${i === 0 ? "bg-accent-soft/60 font-medium text-text" : ""}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: one card per product, so nothing needs sideways scrolling at 200% zoom. */}
        <div className="mt-10 grid gap-5 md:hidden">
          {t.columns.map((c, ci) => (
            <section
              key={c}
              aria-labelledby={`cmp-${ci}`}
              className={`card rounded-3xl border p-6 ${ci === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface"}`}
            >
              <h3 id={`cmp-${ci}`} className="text-xl font-semibold">
                {c}
              </h3>
              <dl className="mt-4 grid gap-4">
                {t.rows.map((r) => (
                  <div key={r.label}>
                    <dt className="text-sm font-semibold">{r.label}</dt>
                    <dd className="mt-1 text-base text-muted">{r.values[ci]}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">{t.footnote}</p>
        <p className="mt-2 text-sm text-muted">
          {t.sourcesLabel}:{" "}
          {t.sources.map((src, i) => (
            <span key={src.href}>
              {i > 0 ? " · " : null}
              <a href={src.href} className="text-accent underline underline-offset-4" rel="noopener noreferrer">
                {src.label}
              </a>
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
