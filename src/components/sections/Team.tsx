import Image from "next/image";
import { team as t, type TeamMember } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Photo({ m }: { m: TeamMember }) {
  if (m.photo) {
    return (
      <Image
        src={m.photo}
        alt={t.photoAlt(m.name)}
        width={400}
        height={400}
        sizes="(min-width: 1280px) 120px, 112px"
        className="size-28 rounded-full object-cover"
      />
    );
  }
  // Placeholder until the real photo is added: initials, a camera icon and visible text.
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        aria-hidden="true"
        className="relative flex size-28 items-center justify-center rounded-full bg-[linear-gradient(145deg,#0a6b60,#063e38)] text-3xl font-semibold tracking-[-0.03em] text-white"
      >
        {initials(m.name)}
        <span className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-surface bg-teal-deep">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false">
            <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.2" />
          </svg>
        </span>
      </span>
      <span className="text-sm text-muted">{t.photoComingSoon}</span>
    </div>
  );
}

function Links({ m }: { m: TeamMember }) {
  if (!m.linkedin && !m.github) return null;
  const cls =
    "inline-flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent";
  return (
    <div className="mt-4 flex justify-center gap-2">
      {m.linkedin ? (
        <a href={m.linkedin} aria-label={t.linkedinLabel(m.name)} className={cls} rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.3 9h3.4v11.5H3.3zM9 9h3.3v1.6h.05c.46-.87 1.6-1.8 3.3-1.8 3.5 0 4.15 2.3 4.15 5.3v6.4h-3.4v-5.7c0-1.36-.03-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3v5.8H9z" />
          </svg>
        </a>
      ) : null}
      {m.github ? (
        <a href={m.github} aria-label={t.githubLabel(m.name)} className={cls} rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}

export function Team() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        {/* phone 1 · tablet 2 · desktop 3 + 2 centred */}
        <ul className="mt-14 flex flex-wrap justify-center gap-5">
          {t.members.map((m) => (
            <li
              key={m.name}
              className="card w-full rounded-3xl border border-line bg-surface p-7 text-center sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
            >
              <div className="flex justify-center">
                <Photo m={m} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{m.name}</h3>
              <p className="mt-1 text-base text-muted">{m.role}</p>
              <Links m={m} />
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-1 text-center text-sm text-muted">
          <p>{t.course}</p>
          <p>{t.supervisor}</p>
        </div>
      </Container>
    </section>
  );
}
