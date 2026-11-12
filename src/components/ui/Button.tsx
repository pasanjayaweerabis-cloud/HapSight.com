import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "stagePrimary" | "stageSecondary";

const base =
  "btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold leading-tight transition-colors duration-200 border";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-contrast border-accent hover:bg-accent-strong hover:border-accent-strong",
  secondary: "bg-transparent text-text border-line hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-text border-transparent hover:text-accent",
  stagePrimary: "bg-cyan text-navy-ink border-cyan hover:bg-white hover:border-white",
  stageSecondary: "bg-transparent text-stage-text border-stage-line hover:border-stage-accent hover:text-stage-accent",
};

export function buttonClass(variant: Variant = "primary", extra = ""): string {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={buttonClass(variant, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
