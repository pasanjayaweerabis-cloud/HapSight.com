import { skipLink } from "@/content/site";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-accent px-5 py-3 font-semibold text-accent-contrast shadow-lg"
    >
      {skipLink}
    </a>
  );
}
