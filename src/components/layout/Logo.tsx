/** Brand mark: the forehead band seen from above, with its two sensors. Decorative. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#0F6E56" />
      <path d="M7 19c2.5-5 6-7 9-7s6.5 2 9 7" fill="none" stroke="#E1F5EE" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12.5" cy="13.6" r="2.1" fill="#FFE2B8" />
      <circle cx="19.5" cy="13.6" r="2.1" fill="#FFE2B8" />
    </svg>
  );
}
