# DESIGN.md – HapSight visual system

Updated for the orange/charcoal palette (branch `ui-ux-enhancing`). Tokens live in
`src/app/globals.css`; all copy lives in `src/content/site.ts`.

## World

"Product page at night." The stage (hero and 3D sections) follows the theme: charcoal in dark
mode, cool light grey in light mode, with a soft orange glow behind the glasses. One persistent
WebGL canvas floats the device from section to section.

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` / `--stage-bg` | #f2f3f5 | #111111 | page and stage |
| `--surface` | #ffffff | #1a1a1a | cards, form |
| `--bg-soft` | #fff1e7 | #221913 | tinted sections (comparison, FAQ) |
| `--text` | #161616 (16.3:1) | #f5f5f5 (17.4:1) | body |
| `--text-muted` | #4f535a (7.1:1) | #c4c6ca (11.0:1) | secondary |
| `--accent` | #b33a08 (5.4:1) | #ff8a3d (8.1:1) | links, orange text |
| CTA fill / text | #ff6a1a / #111111 (6.8:1) | same | primary button |
| `--haptic` | #ffcb8a | | vibration effects in 3D |

The `--brand-teal`, `--teal*` and `--navy*` names are legacy: they hold the orange and charcoal
values so older components keep working. Use the semantic names (`--accent`, `--bg`, ...) in
new code.

High-contrast theme (`.hc`) swaps to pure black/white, with deep orange (#7c2d12) or light
orange (#ffb27a) as the accent, and solid borders. Windows forced-colors mode has its own rules:
buttons use ButtonFace/ButtonText with 2px edges, cards/inputs/radio cards get CanvasText
borders, focus uses Highlight, stills and the canvas keep their colours. Text selection and
caret use the accent colour.

## Type

Atkinson Hyperlegible Next (next/font, swap), one family, plus Atkinson Hyperlegible Mono for
code-like text. Root size is fluid (16px → 22px from 1440 to 2560 px wide) times
`--font-scale` (1.2 with Large text). Body 1.125rem / 1.65.

- h1: 2.75rem → 4.5rem, weight 600, leading 1.05, tracking −0.03em
- h2: 2.125rem → 3rem, weight 600, leading 1.08, tracking −0.035em
- Shared sizes (Tailwind classes from `@theme` in globals.css), use these, not ad-hoc sizes:
  `text-card` 1.5rem/1.25 (big cards, steps, arms), `text-card-sm` 1.25rem/1.35 (feature,
  roadmap, team, list titles), `text-lead` 1.25rem/1.55 (section intros), `text-label`
  1rem/1.5 (labels, notes, footnotes). Nothing a reader needs is below 16px.
- Reading width: `max-w-measure` (31em, about 60–70 characters). Do not use `ch` widths:
  Atkinson's narrow "0" makes 65ch about 95 characters.
- Kicker: 1rem, 600, sentence case, tracking 0.01em, with a 1.4rem rule before it. No other
  all-caps labels.
- Hero sub: 1.125rem → 1.375rem, max 34ch (short on purpose)
- Dark mode body weight 380 (not in high contrast)
- Prices and other figures: normal font with `tabular-nums` (not monospace)
- Touch targets: every button and link control at least 44×44px

## Space and layout

- Container: `max(72.5rem, 88vw)`, padding 1.25rem / 2rem.
- Section rhythm: `py-24 sm:py-32` (6rem / 8rem).
- Radii: cards 24px (`rounded-3xl`), inputs 12px, buttons pill.

## Components

- Buttons: pill, min-height 48px, 5 variants (primary, secondary, ghost, stagePrimary,
  stageSecondary). 200ms expo-out on colour/border/shadow, scale 0.97 on press.
- Glass card: `--stage-glass` + 1px `--stage-border` + 14px backdrop blur.
- Navbar: sticky, solid stage colour, stagePrimary CTA, 72px tall. Links and the CTA never wrap;
  at 1024–1279px links tighten and the theme switch collapses to one button (the full choice
  stays in the accessibility panel). Below 1024px the links move to the menu.
- Hero: grid. Phones/tablets stack headline → device (16:9 / 2:1) → sub + CTAs, so the glasses
  are on the first screen; CTAs are full-width stacked on phones. Desktop: text left, device right.
  The hero slot is `role="img"` with a label pointing to the written description.
- Demo: compact glass note (icon + text) until a real video exists.
- Form: 52px inputs, radio cards, error summary with links, inline errors.

## Motion

- Framer Motion for scroll-progress text in pinned sections; R3F for the device.
- One authored entrance: hero text "rises" (opacity 0.35→1, 14px, 3px blur, 900ms expo-out,
  second block +120ms). CSS only, visible by default.
- Canvas: `frameloop="demand"` while active, `"never"` off-screen; DPR capped at
  min(screen, 1.25 compact / 1.5 desktop), stepped down by PerformanceMonitor. Fades in over the
  poster still (700ms). Context loss or a scene error brings the stills back.
- Reduced motion (OS or panel): no canvas, stills, all transitions 0.01ms.
