/** Brand mark: the glasses from the front, with the three sensors in the top bar. Decorative. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#080F1D" />
      <rect x="3.5" y="9" width="25" height="4" rx="1.6" fill="#14E0C8" />
      <path
        d="M5.75 12.5v4a3.5 3.5 0 0 0 3.5 3.5h2.25a3 3 0 0 0 3-3v-4.5M17.5 12.5V17a3 3 0 0 0 3 3h2.25a3.5 3.5 0 0 0 3.5-3.5v-4"
        fill="none"
        stroke="#14E0C8"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="6.6" cy="11" r="0.95" fill="#080F1D" />
      <circle cx="16" cy="11" r="0.95" fill="#080F1D" />
      <circle cx="25.4" cy="11" r="0.95" fill="#080F1D" />
    </svg>
  );
}
