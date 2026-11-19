import Image from "next/image";
import { gallery as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

/** Optional strip of concept renders on a mannequin. Hidden until `gallery.enabled` is true. */
export function Gallery() {
  if (!t.enabled) return null;
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} title={t.title} intro={t.intro} />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {t.items.map((g) => (
            <li key={g.src} className="card overflow-hidden rounded-card border border-line bg-bg-soft">
              <div className="relative aspect-square">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">{t.note}</p>
      </Container>
    </section>
  );
}
