# Design critique – HapSight landing page (`/`)

Date: 19 November 2026 · Build: `main` f49c81e · Mode: Persuade
Method: production build (`next start`), screenshots at 375 / 768 / 1440 px with normal and
reduced motion, Lighthouse 12 mobile (simulated Slow 4G, 4× CPU), code read of every section.

## Baseline numbers (Lighthouse mobile, measured)

| Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 78 | 100 | 100 | 100 | 3.7 s | 450 ms | 0 |

LCP element: the hero still (`/stills/hero.png` through `next/image`).

## Scores (0–4 per heuristic)

| Area | Score | Summary |
| --- | :-: | --- |
| First-screen clarity | 3 | Headline is strong. The sub-line is a 25-word sentence; "being designed to help … notice obstacles at head height" needs a second read. On phones the device is pushed below the fold. |
| 3D hero: helps or distracts | 3 | The model is restrained and on-brand. The orbit rings read as sci-fi decoration rather than information. On 768 px there is a ~200 px dead gap above the device. |
| Accessibility | 3 | Unusually strong: skip link, one h1, landmarks, error summary, settings panel, stills for reduced motion. Gaps: no `forced-colors` styles (glass cards, kicker rules, the pill buttons and radio cards lose their edges); the hero visual is `aria-hidden` without being tied to its written description; the "pending" status is a second live region alongside the button text. |
| Mobile | 2 | The hero on 375 px is all text; the device starts at ~690 px. The "See how it works" button wraps to its own row at a different width from the primary. |
| Copy | 3 | Honest and careful. Some sentences stack hedges ("being designed to help … is meant to add"). Part numbers (VL53L1X) appear in the How it works body, where plain words would do. |
| Trust signals | 3 | Team, course, supervisor, sourced comparison, privacy notice and a disclaimer are all present. The empty 16:9 "demo coming soon" box is the biggest single block on the page and draws the eye to what's missing. |
| CTA strength | 3 | "Join the waitlist" appears in the nav, the hero and the FAQ. The nav CTA is dark teal on white while the hero CTA is bright teal on navy, so the same action looks like two different buttons. |
| Visual cohesion | 2 | The white, theme-coloured navbar sits on top of a navy hero, which leaves a hard seam on the first screen. Kicker labels are uppercase with 0.18em tracking on every section, so they feel generic. |

**Total: 22 / 32**

## Priority fixes

P0 – must fix
1. **Forced-colors mode**: add `@media (forced-colors: active)` rules so buttons, cards, radio
   cards, focus rings and the kicker rule stay visible. (harden)
2. **Hero visual text alternative**: describe the hero visual to assistive tech (`role="img"` plus a
   label pointing to the written description) instead of only hiding it. (harden)

P1 – should fix
3. **Navbar seam**: on the home page, make the navbar a dark, translucent stage-coloured bar so
   the first screen reads as one surface. (polish/layout)
4. **Hero sub-line**: cut it to two short plain sentences. (clarify)
5. **Mobile hero**: show the device in the first screen on phones, with tighter spacing and
   equal-width stacked buttons. (adapt)
6. **Demo placeholder**: make it a compact, honest note instead of an empty 16:9 box. (layout)
7. **LCP**: give the poster image a high fetch priority, and trim the hero still's sizes and
   quality, so it isn't competing with JS. (optimize)
8. **Mobile DPR**: cap the canvas DPR at 1.5 on desktop too (it is 1.75 today), per the
   performance brief. (optimize)

P2 – nice to have
9. **Kicker style**: switch to sentence case with lighter tracking. It's calmer and easier to read with a
   magnifier. (typeset)
10. **Press feedback**: add a subtle scale-on-press to buttons and a gentle hero text entrance,
    both off with reduced motion. (animate)
11. **Plain language**: remove part numbers from How it works step text (they stay in the parts
    list). (clarify)

## What not to change

The persistent 3D stage architecture, the stills pipeline, the waitlist Server Action and its
privacy behaviour, the a11y settings panel, the sourced comparison, and every section's
content. They're well built, and the job here is to refine them.
