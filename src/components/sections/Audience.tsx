import { audience as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

type Illustration = (typeof t.items)[number]["illustration"];

/** Simple line illustrations (decorative; the card text says who each card is for). */
function Art({ name }: { name: Illustration }) {
  const common = {
    viewBox: "0 0 160 96",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-24 w-full text-accent",
    "aria-hidden": true,
    focusable: false,
  };
  if (name === "cane")
    return (
      <svg {...common}>
        <path d="M10 88h140" opacity=".35" />
        <circle cx="70" cy="22" r="8" />
        <path d="M64 19h12" strokeWidth="3" />
        <path d="M70 30v28l-8 30M70 58l8 30M70 40l14 10" />
        <path d="M84 50l18 38" />
        <path d="M60 22c-14-6-24 0-30 10M80 22c14-6 24 0 30 10" opacity=".5" strokeDasharray="3 4" />
      </svg>
    );
  if (name === "street")
    return (
      <svg {...common}>
        <path d="M10 88h140" opacity=".35" />
        <path d="M150 14c-20 2-34 8-44 18M118 24c-4 6-10 9-18 10" />
        <circle cx="62" cy="30" r="8" />
        <path d="M56 27h12" strokeWidth="3" />
        <path d="M62 38v24l-7 26M62 62l7 26M62 46l12 8l10 34" />
        <path d="M70 30c10-2 18-1 26 2" opacity=".55" strokeDasharray="3 4" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M10 88h140" opacity=".35" />
      <circle cx="58" cy="26" r="8" />
      <path d="M58 34v26l-7 28M58 60l7 28M58 42l16 6" />
      <circle cx="100" cy="30" r="7" />
      <path d="M95 27h10" strokeWidth="3" />
      <path d="M100 37v23l-6 28M100 60l6 28M100 44l-16 4M100 44l10 10l8 34" />
    </svg>
  );
}

export function Audience() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {t.items.map((a) => (
            <li key={a.title} className="card overflow-hidden rounded-3xl border border-line">
              <div className="border-b border-line bg-accent-soft px-8 py-6">
                <Art name={a.illustration} />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{a.title}</h3>
                <p className="mt-3 text-lg text-muted">{a.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
