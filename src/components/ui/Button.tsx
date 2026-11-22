import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "stagePrimary" | "stageSecondary";

const base =
  "btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold leading-tight border transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-contrast border-accent hover:bg-accent-strong hover:border-accent-strong",
  secondary: "bg-transparent text-text border-line hover:bg-bg-soft hover:border-line-strong",
  ghost: "bg-transparent text-text border-transparent hover:text-accent",
  // CTA: ink on brand orange in both themes (6.8:1). Hover lightens the orange.
  stagePrimary: "bg-stage-cta text-stage-cta-text border-stage-cta hover:bg-[var(--hs-cta-hover)] hover:border-[var(--hs-cta-hover)]",
  stageSecondary: "bg-transparent text-stage-text border-stage-line hover:bg-stage-surface-2 hover:border-stage-line-strong",
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
