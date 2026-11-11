export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  stage = false,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  stage?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${stage ? "text-stage-accent" : "text-accent"}`}>
        {eyebrow}
      </p>
      <h2 id={`${id}-title`} className="mt-3 text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
        {title}
      </h2>
      {intro ? (
        <p className={`mt-5 text-pretty text-lg sm:text-xl ${stage ? "text-stage-muted" : "text-muted"}`}>{intro}</p>
      ) : null}
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}
