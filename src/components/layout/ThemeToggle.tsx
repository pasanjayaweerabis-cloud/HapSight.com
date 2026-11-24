"use client";

import { themeToggle as t } from "@/content/site";
import { setPrefs, useA11yPrefs, useResolvedTheme, type ThemePref } from "@/lib/a11yPrefs";
import { Icon } from "@/components/ui/Icon";

const icons = { light: "sun", dark: "moon", system: "monitor" } as const;

/**
 * Light / Dark / System switch in the navbar. Wider screens get a three-way segmented control
 * (a radio group of real buttons with aria-pressed); phones get one button that flips between
 * light and dark. "Match my device" is also in the accessibility panel. The choice is saved and
 * restored by the same store as the other display settings, and applied before paint.
 */
export function ThemeToggle() {
  const { theme } = useA11yPrefs();
  const resolved = useResolvedTheme();
  const next = resolved === "dark" ? "light" : "dark";

  return (
    <>
      <div
        role="group"
        aria-label={t.label}
        className="hidden h-12 items-center gap-0.5 rounded-full border border-stage-line p-1 sm:inline-flex lg:hidden xl:inline-flex"
      >
        {t.options.map((o) => {
          const active = theme === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              title={o.label}
              onClick={() => setPrefs({ theme: o.value as ThemePref })}
              className={`inline-flex size-10 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-stage-cta text-stage-cta-text"
                  : "text-stage-muted hover:bg-stage-surface-2 hover:text-stage-text"
              }`}
            >
              <Icon name={icons[o.value]} className="size-5" />
              <span className="sr-only">{o.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setPrefs({ theme: next })}
        title={next === "dark" ? t.switchToDark : t.switchToLight}
        className="inline-flex size-12 items-center justify-center rounded-full border border-stage-line text-stage-text transition-colors hover:border-stage-line-strong hover:bg-stage-surface-2 sm:hidden lg:inline-flex xl:hidden"
      >
        <Icon name={resolved === "dark" ? "moon" : "sun"} />
        <span className="sr-only">{next === "dark" ? t.switchToDark : t.switchToLight}</span>
      </button>
    </>
  );
}
