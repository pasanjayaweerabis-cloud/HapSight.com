import type { FeatureIcon } from "@/content/site";

type IconName = FeatureIcon | "menu" | "close" | "a11y" | "check" | "arrow" | "plus" | "alert";

const paths: Record<IconName, React.ReactNode> = {
  directions: (
    <>
      <path d="M12 19V6" />
      <path d="m9 9 3-3 3 3" />
      <path d="M12 19 5.5 8.5" />
      <path d="M4.6 12 5.5 8.5l3.4 1" />
      <path d="M12 19 18.5 8.5" />
      <path d="M19.4 12l-.9-3.5-3.4 1" />
    </>
  ),
  haptic: (
    <>
      <rect x="9" y="7" width="6" height="10" rx="2" />
      <path d="M6 9.5v5" />
      <path d="M3 8v8" />
      <path d="M18 9.5v5" />
      <path d="M21 8v8" />
    </>
  ),
  handsFree: (
    <>
      <path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 10V5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M14 10.5V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a5.5 5.5 0 0 1-4.6-2.5L4 14.5a1.5 1.5 0 0 1 2.4-1.8L8 14.5" />
    </>
  ),
  cane: (
    <>
      <path d="M9 4a3 3 0 0 1 6 0v.5" />
      <path d="M15 4.5 10 21" />
      <path d="M7 21h6" />
    </>
  ),
  charge: (
    <>
      <rect x="3" y="7" width="16" height="10" rx="2.5" />
      <path d="M21 10.5v3" />
      <path d="m11.5 9-2 3h3l-2 3" />
    </>
  ),
  parts: (
    <>
      <path d="M14.5 6.5a3.5 3.5 0 0 0-4.6 4.4L4 16.8 7.2 20l5.9-5.9a3.5 3.5 0 0 0 4.4-4.6l-2.2 2.2-2.6-.6-.6-2.6Z" />
    </>
  ),
  glasses: (
    <>
      <path d="M2.5 8.5h19" />
      <path d="M4 8.5v4.5a2.5 2.5 0 0 0 2.5 2.5h2.5a2 2 0 0 0 2-2v-2a1 1 0 0 1 2 0v2a2 2 0 0 0 2 2h2.5a2.5 2.5 0 0 0 2.5-2.5V8.5" />
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
