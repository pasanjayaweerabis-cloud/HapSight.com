# Claude Code brief: HapSight taste-skill polish pass

Paste everything below the line into Claude Code, opened in the `ATP-SE-14` folder.

---

## 0. Before you start (read all of this)

### Git rules (hard, from Pasan)
- **Never commit, push, create branches, stash, reset or check out.** Pasan does all git work himself.
- Only edit files in the working tree. When a phase is done, stop and print a short summary of the changed files so Pasan can review and commit.

### Branch check
- This brief was written against **`main` at `78b294d`** (HapSight name, persistent 3D stage, CI, team photos).
- Run `git branch --show-current` and `git log --oneline -1`. If you are **not** on an up-to-date branch made from `main`, stop and tell Pasan. Do not switch branches yourself.
- The old `REDESIGN_PROMPT.md` (Waymark, headband to glasses) is out of date. Ignore it.

### Next.js warning
- Read `AGENTS.md`. Next 16.4.6 has breaking changes, so check `node_modules/next/dist/docs/` before touching any Next API (fonts, metadata, Image).

### Design read
> **Reading this as:** an accessibility-first student hardware landing page for blind and visually impaired people, their families, and lecturers/assessors, with a calm, trust-first "dark tech product" language, leaning toward Tailwind v4 tokens, one hyperlegible sans, restrained motion, and the existing persistent 3D device as the hero asset.

**Mode: Redesign, preserve.** Keep the brand (navy + teal, glasses logo), the information architecture, every section `id`, the nav labels, the form field names and order, the copy rules at the top of `src/content/site.ts`, and all accessibility features. This is a polish pass, not a rebuild.

**Dials:** `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 5`, `VISUAL_DENSITY 4`.
(Trust-first / accessibility-critical audience pulls them down from the landing-page default. The 3D scroll story already carries the motion budget, so the UI around it should stay quiet.)

### Do NOT touch (unless a task below says so)
- `src/three/**` geometry, `deviceConfig.ts`, materials, explode logic, `pageTimeline.ts` math.
- `src/app/actions/waitlist.ts`, `src/lib/waitlistSchema.ts`, `src/lib/supabaseServer.ts`, `supabase/`.
- Form field `name`s, ids (`wl-*`), order, honeypot, error-summary focus behaviour.
- `A11yPanel`, `SkipLink`, `bootScript`, the `.hc`, `.large-text`, `.reduce-motion` classes.
- Route slugs (`/privacy`, `/accessibility`), section `id`s, anchor hrefs.
- Copy meaning. Wording fixes listed below are allowed; new claims, numbers or features are not.

---

## 1. Audit findings (what is wrong today and where)

Severity: **H** = clear taste-skill violation that a reviewer will notice, **M** = worth fixing, **L** = optional polish.

| # | Sev | Finding | Where |
|---|---|---|---|
| 1 | H | **Theme flips mid-page in light mode.** Stage sections are always dark; Audience, Comparison, Team and FAQ follow the page theme. In light mode the page goes dark ×7, light ×2, **dark (Roadmap)**, light ×2, **dark (Waitlist)**, light footer. That is 4 inversions; the skill allows one deliberate switch. | `page.tsx` order; `.stage` on `Roadmap.tsx`, `Waitlist.tsx` |
| 2 | H | **Eyebrow overuse.** 14 `kicker` labels (one per section). Rule: max 1 per 3 sections, and most of them repeat the title ("FAQ" above "Questions", "Waitlist" above "Join the waitlist"). | `SectionHeading` in `ui/Section.tsx`, every `eyebrow:` in `site.ts` |
| 3 | H | **Section-number labels** `1 / 3`, `2 / 3` on the How it works cards (banned "01 / 4" pattern; the `<ol>` and `aria-current="step"` already convey sequence). | `HowItWorks.tsx` (both ScrollStory and StaticStory) |
| 4 | H | **Three equal cards with hand-drawn SVG stick figures** in "Who it's for". Both are listed AI tells. | `Audience.tsx` |
| 5 | H | **Empty Demo section.** A full-width `aspect-video` box that says "No video yet", plus a hand-rolled play icon. A whole section spent on nothing. | `Demo.tsx`, `site.ts → demo` |
| 6 | H | **En/em dashes in visible copy** (5 places): meta title, `design.note`, two price ranges, battery range. | `site.ts` lines ~33, ~297, ~441, ~442, ~549 |
| 7 | M | **Middle-dot chains.** Team roles have 2 dots per line, the course line has 6, footer credit has 2, hero eyebrow has 1. Rule: max 1 per line. | `site.ts → team`, `footer.credit`, `hero.eyebrow` |
| 8 | M | **Inter font** (the #1 default AI font). For this audience there is a better, motivated choice: Atkinson Hyperlegible Next, designed by the Braille Institute for low-vision readers. Both it and its Mono are in Next's font list (checked in `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`). | `layout.tsx`, `globals.css --font-sans` |
| 9 | M | **Headline tracking too tight for low-vision readers**: hero `tracking-[-0.06em] leading-[0.97]`, h2 `tracking-[-0.045em]`, cards `-0.03em`. | `Hero.tsx`, `ui/Section.tsx`, cards |
| 10 | M | **No pressed/active state on buttons**, only `transition-colors`. Primary stage button hovers to **pure white** and has a teal outer glow (both banned). | `ui/Button.tsx` |
| 11 | M | **Radius drift**: `rounded-3xl` (17×), `rounded-2xl` (5×), `rounded-xl` (6×), `rounded-lg` (1×), `rounded-full` (21×). A `--radius: 24px` / `rounded-card` token exists but is never used. | all components |
| 12 | M | **Ad-hoc z-index**: `z-0`, `z-[1]`, `z-10`, `z-20`, `z-50`, `z-[100]` with no scale. | `globals.css`, `Navbar`, `HowItWorks`, `Features`, `SkipLink`, `StageHost` |
| 13 | M | **Features fallback grid orphans a card**: 7 items in `sm:grid-cols-2 lg:grid-cols-3` leaves 1 alone on the last row (shown with reduced motion or no WebGL, i.e. to exactly the users this site is for). | `Features.tsx` static branch |
| 14 | M | **Team uses flexbox percentage math** (`w-[calc(33.333%-0.84rem)]`), circle avatars, and repeats "Photo coming soon" under 4 of 5 people. | `Team.tsx` |
| 15 | M | **Roadmap is 5 equal columns from `md` (768px)**, so each card is ~130px wide and the text gets cramped. Status uses text glyphs `✓ ● ○`. | `Roadmap.tsx` |
| 16 | M | **Decorative dots** before list items (custom `<span>` circles). | `Problem.tsx`, `InsideArms.tsx`, `PartsList.tsx` |
| 17 | M | **Parts list is a 12-item wall** in two columns, each with name + where + description. Long lists should be grouped. | `PartsList.tsx`, `site.ts → design.labels` |
| 18 | M | **Hardcoded colours outside tokens**: team placeholder gradient `#0a6b60, #063e38`; `shadow-[0_8px_34px_rgba(20,224,200,0.18)]`. | `Team.tsx`, `Button.tsx` |
| 19 | L | **Hand-rolled icon set** (116 lines of SVG paths, plus inline LinkedIn/GitHub/camera/play paths). The skill wants an icon library (Phosphor). | `ui/Icon.tsx`, `Team.tsx`, `Demo.tsx` |
| 20 | L | Body paragraphs have no `max-w-[65ch]`; the hero device description runs ~115 words at near full width. | `Hero.tsx`, `Problem.tsx`, `PartsList.tsx` |
| 21 | L | No "current section" state in the nav. | `Navbar.tsx` |
| 22 | L | 404 page is a bare white block with no brand styling. | `app/not-found.tsx` |
| 23 | L (info) | `PersistentStage.tsx` uses `window.addEventListener("scroll")`. The skill bans this, **but here it is passive and only calls R3F `invalidate()`; no React state changes**. That is the correct pattern for a demand frame loop. **Leave it alone.** | `three/PersistentStage.tsx` |

Things that are already good (keep them): one `h1`, ordered headings, skip link, focus rings, error summary, honeypot, reduced-motion stills, dark-mode tokens with documented contrast ratios, `min-h-dvh`, `text-balance`/`text-pretty`, no fake numbers (prices are sourced), no fake testimonials, one CTA label per intent ("Join the waitlist" everywhere), sticky scroll stories built on `useScroll` instead of scroll listeners, Lighthouse a11y/BP/SEO 100.

---

## 2. Tasks, in order

Do the phases in this order. After **each** phase run `npm run lint && npm run typecheck && npm run build`, fix anything that breaks, then stop and summarise the changed files for Pasan.

### Phase 1: Typography (biggest win, lowest risk)

1. In `src/app/layout.tsx` replace Inter:
   ```ts
   import { Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono } from "next/font/google";
   const sans = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" });
   const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });
   ```
   Check the exact export names and whether `weight` is required by reading `font-data.json` for these two families (if they are variable, no `weight` is needed). Put both `.variable` classes on `<html>`.
2. In `globals.css` `@theme inline`: `--font-sans: var(--font-sans-face), ui-sans-serif, system-ui, sans-serif;` and add `--font-mono: var(--font-mono-face), ui-monospace, monospace;`. Remove `--font-inter`.
3. Loosen tracking (Atkinson already has wide letterforms; tight tracking hurts it):
   - Hero `h1`: `leading-[1.02] tracking-[-0.03em]` (was `0.97` / `-0.06em`).
   - `SectionHeading` h2: `leading-[1.08] tracking-[-0.025em]` (was `-0.045em`).
   - Card h3s: change `tracking-[-0.03em]` to `tracking-[-0.01em]` everywhere.
4. Weights: use 400 body, 500 for labels/nav, 600 for headings, 700 only for the hero `h1`. Replace stray `font-bold` / `font-[650]` / `font-weight: 650` (`.prose-legal h2`) with 600.
5. Add `max-w-[65ch]` to body paragraphs: hero `deviceDescription`, Problem paragraphs, `SectionHeading` intro, FAQ answers, PartsList descriptions.
6. Comparison table prices and any number-heavy text: add `font-mono tabular-nums` only to the **value cells of the price row**, not the whole table.

**Fallback:** if Pasan doesn't like how Atkinson looks in the screenshots, use `Geist` + `Geist_Mono` instead (also in the font list). Do not go back to Inter.

### Phase 2: Theme lock and section order

**Decision for Pasan (default = Option A).** Ask him which one before you do this phase, if he hasn't already said.

- **Option A (recommended): one deliberate switch.** New order in `src/app/page.tsx`:
  `Hero → Problem → HowItWorks → Features → Design → InsideArms → Roadmap → (Demo, hidden) → Audience → Comparison → Team → Faq → Waitlist`
  - Everything up to and including **Roadmap** stays `.stage` (always dark, the 3D story).
  - Audience, Comparison, Team, FAQ **and Waitlist** follow the page theme.
  - Remove `stage` from the `Waitlist` section class. Keep its `RangeMarker` / `StageSlot` so the device still returns and pulses on success. **Then check the device on a light background** (light theme). If the charcoal glasses look wrong on white, keep the slot but add a soft `bg-bg-soft rounded-card` panel behind it. Do not edit 3D materials.
  - Add one visible transition at the end of the stage block: a `h-24` divider after Roadmap with `background: linear-gradient(to bottom, var(--stage-bg), var(--bg))`. In dark mode it is invisible (same colours), and that's fine.
  - Remove the `on-surface` light-card workaround from `Waitlist.tsx` / `globals.css` if it is no longer needed once the section follows the theme (check focus ring colour still passes).
- **Option B:** keep the current order and only make Roadmap follow the theme. Fewer changes, but light mode still flips twice (into Waitlist).

Moving Roadmap is an IA change, so it needs Pasan's OK. Nav links don't change (Roadmap isn't in the nav).

**Check after:** `pageTimeline` sorts ranges by measured start, so the device should follow the new order. Scroll the whole page top to bottom and back with WebGL on, in both themes, and confirm the device never jumps or disappears between Roadmap and Audience.

### Phase 3: Remove the AI tells in structure and copy

1. **Eyebrows down to 2.** Make `eyebrow` optional in `SectionHeading` (`eyebrow?: string`, render nothing when missing). Keep `hero.eyebrow` and `roadmap.eyebrow` ("Project status"); delete every other `eyebrow:` from `site.ts`. The headline alone does the job.
2. **Hero eyebrow:** `"Student prototype, in design"` (no middle dot).
3. **How it works:** delete the `{s.number} / {t.steps.length}` kicker lines in both ScrollStory and StaticStory. Keep the `number` field in `site.ts` only if something else uses it; otherwise remove it.
4. **Dashes:** fix all 5:
   - `meta.title`: `` `${brand.name}: haptic glasses that feel the path ahead` ``
   - `design.note`: `"Concept design. The final prototype may differ."`
   - `"About US$600-850 ..."`, `"About US$1,900-3,500 ..."`, `"about 3-5 hours ..."` (plain hyphen).
   - Then run `grep -rn "—\|–" src/` and fix anything else visible to users (code comments can stay).
5. **Middle dots:** team roles use commas (`"Team Leader, Technical Lead, Developer (design and web implementation)"`). Split `team.course` into two strings rendered on two lines: `"Group 14, ATP SE-14, Agile Team Project (5COSC021C)"` and `"BEng (Hons) Software Engineering, Informatics Institute of Technology (IIT), Sri Lanka, affiliated with the University of Westminster"`. Footer credit: `` `© 2026 ${brand.name}. ATP Group 14 (SE-14), IIT Sri Lanka.` `` Also check `Comparison.tsx` sources separator: replace `" · "` with a comma.
6. **Demo:** add `enabled: false` to `site.ts → demo` (same pattern as `gallery`) and `if (!t.enabled) return null;` in `Demo.tsx`. Before that, make sure `pageTimeline` / `PersistentStage` work when the `"demo"` range is never registered (it should, since ranges come from mounted markers; test by scrolling). The roadmap "Prototype" step already says it's being built. Add a README note: flip `demo.enabled` when the real video exists.
7. **Decorative dots:** in `Problem.tsx`, `InsideArms.tsx`, `PartsList.tsx` (other parts list) remove the custom dot `<span>`s. Use `list-disc pl-5 marker:text-stage-accent` (Problem examples, InsideArms parts) or plain stacked text with `gap-3` (other parts). Native markers are announced correctly and are not "decorative status dots".

### Phase 4: Component polish

1. **Buttons** (`ui/Button.tsx`):
   - `base`: replace `transition-colors duration-200` with `transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:translate-y-px active:scale-[0.98]`. The existing reduced-motion CSS already zeroes transitions; check `.reduce-motion` still kills the transform transition.
   - `stagePrimary`: drop the `shadow-[...]` glow; hover `hover:bg-stage-accent-2 hover:border-stage-accent-2` (was white). Check `navy-ink` text on `#8af5e7` is still ≥ 4.5:1 and note the ratio in a comment like the other tokens.
   - Disabled submit: add `disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100`.
2. **Radius system:** document it in a comment at the top of `globals.css` and apply it everywhere:
   - Interactive (buttons, icon buttons, nav pills, status chips): `rounded-full`
   - Containers (cards, glass panels, table wrapper, form card, FAQ wrapper): `rounded-card` (the existing 24px token; register it as `--radius-card` already exists, so the utility is `rounded-card`)
   - Inner elements (inputs, radio tiles, consent box, error summary, icon tiles, avatars): `rounded-xl` (12px)
   - Replace every `rounded-3xl` with `rounded-card`, every `rounded-2xl` / `rounded-lg` with `rounded-xl`. Keep `rounded-full` only for interactive things and the numbered callout circles.
3. **z-index scale:** add to `globals.css` `@theme inline`: `--z-index-canvas: 1; --z-index-content: 2; --z-index-sticky: 20; --z-index-nav: 50; --z-index-skip: 100;` (check Tailwind 4.3 picks these up as `z-canvas` etc.; if not, use CSS variables in arbitrary values `z-(--z-nav)`). Replace the raw values in `globals.css` (`:where(main section) > *`), `Navbar`, `HowItWorks`, `Features`, `SkipLink`, `StageHost`. Behaviour must stay identical.
4. **Tokens for stray colours:** Team placeholder gradient becomes `bg-[linear-gradient(145deg,var(--teal-deep),var(--navy))]` or a new `--avatar-from/--avatar-to` pair in `:root`. No raw hex in components except `LogoMark` (brand mark, fine).

### Phase 5: Layout fixes per section

1. **Features static fallback (7 items, bento):** `grid gap-5 lg:grid-cols-6`.
   Rows: items 1-2 `lg:col-span-3`, items 3-5 `lg:col-span-2`, items 6-7 `lg:col-span-3`. On `sm` use `sm:grid-cols-2` with item 7 `sm:col-span-2`. Exactly 7 cells, no orphan, no empty cell. Give the two large first cells (Three directions, Silent haptic feedback) a little visual weight: a faint teal radial gradient in the glass card (`bg-[radial-gradient(80%_60%_at_0%_0%,rgba(20,224,200,0.08),transparent)]` layered on `.glass`). Not on all 7.
2. **Audience ("Who it's for"):** delete the `Art` component and the `illustration` field. New layout (no 3 equal cards):
   - `lg:grid-cols-[1.1fr_1fr]`: left column = section title + the first audience (People born blind) set large (`text-3xl font-semibold` title, `text-xl` body); right column = the other two stacked, separated by `divide-y divide-line`, no card borders.
   - Mobile: single column, same order.
3. **Team:**
   - Replace the flex/calc layout with `grid gap-5 sm:grid-cols-2 lg:grid-cols-6`; each card `lg:col-span-2`; the 4th card `lg:col-start-2` so the last row of 2 is centred. On `sm` the 5th card `sm:col-span-2 sm:justify-self-center sm:w-1/2` (or leave it left-aligned, check screenshot).
   - Avatars: `rounded-xl` squircle (photos and placeholders), not circles.
   - Placeholder: initials only. Remove the camera badge and the per-card "Photo coming soon" text. If any member has no photo, render one line under the grid: `team.photosNote` = "Team photos are being added." Keep `photoAlt` for real photos.
4. **Roadmap:** `grid gap-4 lg:grid-cols-5` (was `md:`). Below `lg`, render as a vertical timeline: `relative pl-8` list with a 1px `bg-stage-line` line at `left-3`, and each status as a small node on the line (filled teal = done, teal ring = now, muted ring = next). Keep the visible status text (`Done` / `In progress` / `Planned`); replace the `✓ ● ○` characters with the node graphic (`aria-hidden`).
5. **Parts list grouping** (`PartsList.tsx` + `site.ts`):
   - Add `group: "front" | "leftArm" | "rightArm" | "whole"` to each `PartLabel`, plus `design.groups = { front: "In the front frame", leftArm: "In the left arm", rightArm: "In the right arm", whole: "Through the whole frame" }`.
   - Reorder the keys of `design.labels` so each group's parts are next to each other: front (`tofLeft`, `tofFront`, `tofRight`, `lenses`), left arm (`controller`, `drivers`, `motorLeft`), right arm (`battery`, `charger`, `motorRight`), whole (`frame`, `wiring`).
   - **Important:** `ExplodeOverlay` numbers callouts from `Object.keys(design.labels)` order, so the 3D numbers and list numbers will stay in sync automatically. After reordering, scroll the exploded view on desktop and at 390px and check the callouts don't collide more than before. If they clearly get worse, revert the key order and only add group headings with the original numbers.
   - Render 4 small groups (`h4` per group, `grid gap-6 md:grid-cols-2` of groups), each a plain `ol` with `start={n}` so numbering continues across groups and screen readers still hear the right numbers.
6. **Hero:** keep the device description visible (it's how screen-reader and low-vision users get the 3D content), but `max-w-[65ch]` and `text-base`. Nothing else in the hero changes: it already has 4 text elements, a short headline and a 20-word sub.
7. **FAQ:** keep the WAI-ARIA accordion (it's correct). Only restyle: remove the outer `border` + `bg-surface` card, keep `divide-y divide-line`, so it sits on the section background.
8. **404 page:** wrap in the stage look: `section.stage.stage-gradient min-h-[70dvh] grid place-items-center`, `LogoMark` at `size-12`, same copy, primary button. No new copy.

### Phase 6: Motion (small, motivated)

Every animation below must use the project hook `useReducedMotion()` from `src/lib/a11yPrefs.ts` (it covers both the OS setting and the A11yPanel toggle). **Do not** use framer-motion's own `useReducedMotion` (it ignores the panel). Keep using the installed `framer-motion` package; do not add `motion` or GSAP.

1. **Reveal on enter** for the theme-following block only (Audience items, Comparison wrapper, Team cards, Roadmap steps): a small client component `src/components/ui/Reveal.tsx`:
   - `initial={reduce ? false : { opacity: 0, y: 16 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.25 }}`, `transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}`.
   - Reason: these sections are the only static part of the page and they appear right after the 3D story; a short stagger keeps the rhythm. Don't add it to stage sections (the 3D already moves there) or to the form.
   - Server components stay server components: only `Reveal` is `"use client"`; wrap children.
2. Nothing infinite, no marquee, no parallax, no cursor effects, no grain overlay (a fixed noise layer on top of a fixed WebGL canvas costs GPU on phones for no gain).

### Phase 7 (optional, ask Pasan first): icon library

Only if Pasan says yes, because it adds a dependency.
- `npm install @phosphor-icons/react`
- Rewrite `ui/Icon.tsx` as a thin map from the existing `IconName` union to Phosphor components imported from `@phosphor-icons/react/dist/ssr` (works in Server Components). Keep the same `<Icon name="..." className="..." />` API so no call sites change. Use `weight="regular"` everywhere for one stroke weight.
- Suggested mapping (verify each name exists in `node_modules/@phosphor-icons/react` before using it): glasses → `Eyeglasses`, haptic → `Vibrate`, charge → `BatteryCharging`, parts → `Wrench`, handsFree → `HandPalm`, cane → `PersonSimpleWalk`, directions → `ArrowsSplit`, menu → `List`, close → `X`, plus → `Plus`, check → `Check`, arrow → `ArrowRight`, alert → `WarningCircle`, a11y → `PersonArmsSpread`. Team links → `LinkedinLogo`, `GithubLogo`.
- If any glyph doesn't exist, pick the closest real one. Never hand-draw a replacement.
- All icons stay `aria-hidden` with visible or sr-only text next to them, as now.

### Phase 8 (optional): nav current section

- In `Navbar.tsx`, a single `IntersectionObserver` (not a scroll listener) on the 5 nav target sections; set `aria-current="true"` and `text-text font-semibold` on the matching link. Only on the home page. Nothing else changes.

---

## 3. Copy self-audit (do this after Phase 3)

Re-read every string in `src/content/site.ts` and check:
- Zero `—` and `–` in user-visible strings.
- Max one `·` per line (ideally zero).
- No "seamless / elevate / unleash / next-gen / revolutionary", no exclamation marks, no "Oops".
- Still follows the file's own rules: design-stage language ("is designed to", "will"), no medical claims, no road-crossing safety claims, no invented numbers.
- Don't rewrite anything else. If a string reads fine, leave it.

---

## 4. Done criteria

Run and pass:
- `npm run lint`, `npm run typecheck`, `npm run build`.
- `grep -rn "—\|–" src/content src/components src/app` returns only code comments.
- `grep -rn "rounded-3xl\|rounded-2xl\|rounded-lg\|z-\[" src/components src/app` returns nothing.
- `grep -rn "kicker" src/components` matches only Hero and Roadmap.

Then `npm run build && npm start` and take screenshots of the whole page at **390, 768, 1024, 1440 px** in:
1. light theme, 2. dark theme, 3. high contrast (light and dark), 4. reduced motion (panel toggle), 5. larger text.

Check in the screenshots:
- Light theme: exactly one dark-to-light switch (Option A).
- Nav fits on one line at 1024px; nav height ≤ 80px.
- No CTA label wraps at ≥ 1024px.
- Features fallback grid (reduced motion) has no orphan card.
- Team last row centred at `lg`; roadmap readable at 768px.
- Exploded view callouts still readable at 390px.
- Focus ring visible on every button, link, input, radio and accordion button (tab through once).

Lighthouse (mobile, production build) must stay at **Accessibility 100, Best Practices 100, SEO 100** and **CLS 0.00** like `docs/evidence/lighthouse/README.md`. If the font swap moves LCP above 2.5 s, report it rather than hiding it.

Finally, print: the list of changed files, which option was used for Phase 2, whether Phases 7/8 were done, and anything you were unsure about. **Do not commit.**

---

## 5. Pre-flight checklist (taste-skill, only the items that apply here)

- [ ] Design read and dials stated (Section 0)
- [ ] Redesign-preserve: IA, ids, nav labels, form fields, legal copy unchanged (except the approved Roadmap move)
- [ ] Zero em/en dashes in visible copy
- [ ] One theme switch max in light mode
- [ ] One accent (teal); orange `--haptic` used only for vibration visuals, as documented in `globals.css`
- [ ] One radius system, documented and applied
- [ ] Every button readable (≥ 4.5:1), has hover, pressed and focus states, no pure-white hover
- [ ] Eyebrows ≤ 2
- [ ] No section-number labels, no decorative dots, no middle-dot chains
- [ ] No 3 equal cards, no hand-drawn illustrations, no empty placeholder sections
- [ ] Bento has exactly 7 cells for 7 features
- [ ] Grid instead of flex percentage math
- [ ] Every new animation respects the project `useReducedMotion()`
- [ ] Fonts loaded with `next/font`, no `<link>` to Google Fonts
- [ ] Lighthouse a11y/BP/SEO still 100, CLS 0
