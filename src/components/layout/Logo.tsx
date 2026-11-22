/** Brand mark: the two lenses of the glasses with a sensor in each, and the vibration felt
 * behind both ears on either side. The lenses use the text colour, so the mark works on light
 * and dark backgrounds. Decorative. */
export function LogoMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={className} aria-hidden="true" focusable="false">
      <circle cx="18" cy="14" r="5.2" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="30" cy="14" r="5.2" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="18" cy="14" r="1.9" fill="#FF6A1A" />
      <circle cx="30" cy="14" r="1.9" fill="#FF6A1A" />
      <path
        d="M10.9 7.6a9.5 9.5 0 0 0 0 12.8M37.1 7.6a9.5 9.5 0 0 1 0 12.8M5.6 4.6a14 14 0 0 0 0 18.8M42.4 4.6a14 14 0 0 1 0 18.8"
        fill="none"
        stroke="#FF6A1A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
