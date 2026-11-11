import type { FeatureIcon } from "@/content/site";

type IconName = FeatureIcon | "menu" | "close" | "a11y" | "check" | "arrow" | "plus" | "alert";

const paths: Record<IconName, React.ReactNode> = {
  direction: (
    <>
      <path d="M9 7 4 12l5 5" />
      <path d="m15 7 5 5-5 5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  distance: (
    <>
      <path d="M4 12h2" />
      <path d="M9 9v6" />
      <path d="M13 7v10" />
      <path d="M17 5v14" />
    </>
  ),
  approach: (
    <>
      <path d="M3 12h11" />
      <path d="m10 8 4 4-4 4" />
      <path d="M18 6v12" />
      <path d="M21 9v6" />
    </>
  ),
  range: (
    <>
      <path d="M4 18a8 8 0 0 1 16 0" />
      <path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
      <path d="M12 18v-1" />
    </>
  ),
  filter: (
    <>
      <path d="M7 4c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5Z" />
      <path d="M4 20 20 4" />
      <path d="M14 13c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5Z" />
    </>
  ),
  pause: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6" />
      <path d="M14 9v6" />
    </>
  ),
  sos: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="0.8" />
      <circle cx="12" cy="10" r="0.8" />
      <circle cx="15" cy="10" r="0.8" />
      <circle cx="10.5" cy="13.5" r="0.8" />
      <circle cx="13.5" cy="13.5" r="0.8" />
    </>
  ),
  light: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  voice: (
    <>
      <path d="M4 15V9h3l5-4v14l-5-4H4Z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
      <path d="M19 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  a11y: (
    <>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M5 8.5 12 10l7-1.5" />
      <path d="M12 10v4.5" />
      <path d="m8.5 21 3.5-6.5 3.5 6.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.2v.3" />
    </>
  ),
};

export function Icon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
