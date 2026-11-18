# DESIGN.md – HapSight visual system (as found, before the design pass)

Documented from the shipped code on `main` (f49c81e). Tokens live in `src/app/globals.css`.

## World

"Product page at night." A deep navy stage carries the 3D glasses; light sections (white /
soft teal-grey) carry reading content. One persistent WebGL canvas floats the device from
section to section.

## Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | #ffffff | #080f1d | page |
| `--bg-soft` | #f1f6f6 | #0d1727 | alternating sections |
| `--text` | #0b1422 (18.5:1) | #f2f7fa (17.8:1) | body |
| `--text-muted` | #475569 (7.6:1) | #a1afbd (8.6:1) | secondary |
| `--accent` | #0a6b60 (6.4:1) | #14e0c8 (11.4:1) | links, primary button |
| `--stage-bg` | #080f1d always | | hero and 3D sections |
| `--stage-muted` | #a1afbd (8.6:1) | | stage body text |
| `--haptic` | #ffcb8a | | vibration only |

High-contrast theme (`.hc`) swaps to pure black/white with solid borders. No `forced-colors`
rules exist yet.

## Type

Inter (next/font, swap), one family. Root size is fluid (16px → 22px from 1440 to 2560 px wide)
times `--font-scale` (1.2 with Large text). Body 1.125rem / 1.65.

- h1: 3rem → 4.5rem, weight 600, leading 0.97, tracking −0.06em
- h2: 2.25rem → 3rem, weight 600, leading 1.06, tracking −0.045em
- Kicker: 0.8125rem, 700, uppercase, tracking 0.18em, with a 1.4rem rule before it
- Intro: 1.125rem → 1.25rem, muted

## Space and layout

- Container: `max(72.5rem, 88vw)`, padding 1.25rem / 2rem.
- Section rhythm: `py-24 sm:py-32` (6rem / 8rem).
- Radii: cards 24px (`rounded-3xl`), inputs 12px, buttons pill.

## Components

- Buttons: pill, min-height 48px, 5 variants (primary, secondary, ghost, stagePrimary,
  stageSecondary). Colour transitions only.
- Glass card: `--stage-glass` + 1px `--stage-border` + 14px backdrop blur.
- Navbar: sticky, theme-coloured (white in light theme), blur, 72px tall.
- Form: 52px inputs, radio cards, error summary with links, inline errors.

## Motion

- Framer Motion for scroll-progress text in pinned sections; R3F for the device.
- Canvas: `frameloop="demand"` while active, `"never"` off-screen; DPR 1.25 compact / 1.75
  desktop, stepped down by PerformanceMonitor.
- Reduced motion (OS or panel): no canvas, stills, all transitions 0.01ms.
