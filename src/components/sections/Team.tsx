import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { team as t, type TeamMember } from "@/content/site";

const PHOTO_EXTS = [".jpg", ".jpeg", ".webp", ".png"];

/** Explicit `photo` wins; otherwise use public/team/<file>.<jpg|jpeg|webp|png> if it exists. */
function photoSrc(m: TeamMember): string | undefined {
  if (m.photo) return m.photo;
  const dir = path.join(process.cwd(), "public", "team");
  for (const ext of PHOTO_EXTS) {
    if (existsSync(path.join(dir, m.file + ext))) return `/team/${m.file}${ext}`;
  }
  return undefined;
}
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

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
  const src = photoSrc(m);
  if (src) {
    return (
      <Image
        src={src}
        alt={t.photoAlt(m.name)}
        width={400}
        height={400}
        sizes="(min-width: 1280px) 120px, 112px"
        className="size-28 rounded-xl object-cover"
      />
    );
  }
  // Placeholder until the real photo is added: initials only.
  return (
    <span
      aria-hidden="true"
      className="flex size-28 items-center justify-center rounded-xl bg-[linear-gradient(145deg,var(--teal-deep),var(--navy))] text-3xl font-semibold tracking-[-0.01em] text-white"
    >
      {initials(m.name)}
    </span>
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
  const anyMissingPhoto = t.members.some((m) => !photoSrc(m));
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-16 sm:py-20">
      <Container>
        <SectionHeading id={t.id} title={t.title} intro={t.intro} />
        {/* phone 1 · tablet 2 · desktop 3, last row of 2 centred */}
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {t.members.map((m, i) => (
            <li
              key={m.name}
              className={`lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""} ${
                i === 4 ? "sm:col-span-2 sm:w-1/2 sm:justify-self-center lg:col-span-2 lg:w-auto lg:justify-self-stretch" : ""
              }`}
            >
              <Reveal index={i} className="card h-full rounded-card border border-line bg-surface p-7 text-center">
                <div className="flex justify-center">
                  <Photo m={m} />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{m.name}</h3>
                <p className="mt-1 text-base text-muted">{m.role}</p>
                <Links m={m} />
              </Reveal>
            </li>
          ))}
        </ul>
        {anyMissingPhoto ? <p className="mt-6 text-center text-sm text-muted">{t.photosNote}</p> : null}
        <div className="mt-10 grid gap-1 text-center text-sm text-muted">
          {t.course.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p>{t.supervisor}</p>
        </div>
      </Container>
    </section>
  );
}
