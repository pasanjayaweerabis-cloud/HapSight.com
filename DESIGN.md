# DESIGN.md – HapSight visual system

Updated after the impeccable design pass (branch `design/impeccable-pass`). Tokens live in
`src/app/globals.css`; all copy lives in `src/content/site.ts`.

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

High-contrast theme (`.hc`) swaps to pure black/white with solid borders. Windows forced-colors
mode has its own rules: buttons use ButtonFace/ButtonText with 2px edges, cards/inputs/radio
cards get CanvasText borders, focus uses Highlight, stills and the canvas keep their colours.
Text selection and caret use the accent colour.

## Type

Inter (next/font, swap), one family. Root size is fluid (16px → 22px from 1440 to 2560 px wide)
times `--font-scale` (1.2 with Large text). Body 1.125rem / 1.65.

- h1: 2.75rem → 4.5rem, weight 600, leading 1.0, tracking −0.04em (the floor)
- h2: 2.125rem → 3rem, weight 600, leading 1.08, tracking −0.035em
- Kicker: 0.9375rem, 600, sentence case, tracking 0.01em, with a 1.4rem rule before it
- Hero sub: 1.125rem → 1.375rem, max 34ch; section intros max 62ch, muted

## Space and layout

- Container: `max(72.5rem, 88vw)`, padding 1.25rem / 2rem.
- Section rhythm: `py-24 sm:py-32` (6rem / 8rem).
- Radii: cards 24px (`rounded-3xl`), inputs 12px, buttons pill.

## Components

- Buttons: pill, min-height 48px, 5 variants (primary, secondary, ghost, stagePrimary,
  stageSecondary). 200ms expo-out on colour/border/shadow, scale 0.97 on press.
- Glass card: `--stage-glass` + 1px `--stage-border` + 14px backdrop blur.
- Navbar: sticky, always solid stage navy (all themes and pages), stagePrimary CTA, 72px tall.
  The first screen reads as one dark surface.
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
