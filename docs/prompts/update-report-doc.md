# Prompt: update the SE-14 running report for Hapsight (v1.0)

Paste everything below the line into a Claude agent that has edit access to the Google Doc. Sign in as Pasan first.

---

## Your job

You are updating the ATP Group SE-14 running coursework report, a Google Doc with tabs:
https://docs.google.com/open?id=1OwW3bCxK4X6P8IsaJ6JCj43jqNi5nyEgQvtAkih9pl8

The doc is at v0.9 (12/11/2026) and still describes the product as "Waymark (working name)", an ear-hook headband, with a lot of leftover OminiWay (AI DM POS) content. The product is now **Hapsight**, low-cost haptic smart glasses. Bring the doc in line with the facts below. Make it accurate first and tidy second.

Read the whole doc (all five tabs) before you change anything. Then make the edits in Part C, tab by tab, and finish with the report in Part D.

## Part A: Rules. Read them twice.

1. **Keep the structure.** Don't rename, renumber, reorder or delete chapters, headings, tabs or tables. Chapter numbers follow the CW1 template and Jira, and they stay that way. You may add rows, short notes and new sub-headings inside the Archive tab only.
2. **Don't write other members' sections for them.** CW1 gives 0 to any member without their own Google Doc version history (SCRUM-12), and anything you type shows up as Pasan's edit. In sections owned by someone else:
   - fix factual admin lines (owner names, links, statuses, product name) and move superseded text to the Archive tab;
   - add a short **"Facts for the owner (from the Hapsight landing page, 12/11/2026)"** bullet list where Part C says so. Use bullet facts only, not finished prose;
   - add the grey line *"Owner to write this section in their own words for Hapsight."*;
   - **do not** write their paragraphs, analysis, user stories, diagrams, contribution summaries or signatures.
3. **Pasan's own sections** (2.3 software half, 3.3, Chapter 6 parts he still owns, 7.7.3, Appendix D, summary table, his 8.3) may get bullet notes marked *"Draft notes (AI-assisted) – Pasan to rewrite in his own words."* No polished final prose.
4. **Don't invent anything.** Use only the facts in Part B or what is already in the doc. If something is unknown, write **[TBC]**. If something is written down but needs confirming, write **[CHECK]**. Don't use any other tags. Dates are dd/mm/yyyy.
5. **Only real meetings.** Don't fill in minutes, attendance, feedback or marks for any meeting. Supervision Meeting 2's date and content are still [TBC]. Leave them like that.
6. **Keep history.** Don't delete superseded content (OminiWay, headband). Move it to the Archive tab under a clear heading, and leave a one-line pointer where it was.
7. **One home per fact.** Don't edit Jira, the log sheet or the risk register sheet. Where those are out of date, add [CHECK] in the doc and list the item in your final report.
8. **Wording rules from the product (keep them in every fact you add):** it is a student prototype in design. Say "is designed to" or "will", never claim proven results. No medical claims. Never say it makes crossing roads safe. It works **with** the white cane, not instead of it. No invented statistics.
9. Keep the existing formatting: bold headings, grey italic owner lines, "How to fill" lines, tables. Don't paste Markdown symbols into the doc.
10. If an edit would break one of these rules, skip it and list it in your final report.

## Part B: Current facts (checked in the repo on 12/11/2026)

Source priority: the repo (latest commit 329bc62, 12/11/2026 16:27) first, then Pasan's own statements, then the existing doc. If two sources disagree, write [CHECK].

### Product

- **Name: Hapsight** (commit 1b5b3ca "change project name to Hapsight", 12/11/2026). Name history: SmartSight → Waymark (working name, headband) → Heedband (briefly, 12/11/2026) → Hapsight. Final name and logo ticket: SCRUM-65 [CHECK: close it in Jira].
- **Tagline:** "Feel the path ahead."
- **What it is:** low-cost haptic smart glasses being designed to help blind and visually impaired people notice obstacles at head height, silently and hands-free. They work with the white cane, not instead of it.
- **Problem framing (from the site):** the cane checks the ground. It can miss obstacles that are higher up or to the side: low branches, shop signboards and awnings, open shutters, parked tuk-tuk mirrors and roofs, poles and wires at an angle. Sri Lankan pavements are often uneven, narrow and crowded. No statistics yet: Chapter 1 still needs referenced statistics [TBC].
- **Design change:** headband / ear-hook → glasses. Reason (Pasan): lecturer feedback asked for a low-budget device that every member can build and that works correctly (commit ca6b1f7 "device design change due to budget"; brief: docs/prompts/glasses-redesign.md). Date of the lecturer feedback [CHECK].
- **Removed from scope with the redesign:** SOS button, pause button, speaker/buzzer, light sensor, LED strip, 3.3 V regulator. Fall detection dropped [CHECK]. Bluetooth, phone app, cloud and family app [CHECK]: Pasan's tracker still lists "headband → Bluetooth → phone app → cloud → family app" for 6.2. The current site describes a standalone device with no app. Confirm before anyone draws the architecture.
- **How it works:** three VL53L1X laser time-of-flight sensors in open windows in the top bar (left corner, centre, right corner; the corner sensors turn about 27° outward; they are not behind the lenses) measure distance. The ESP32-C3 SuperMini decides how close the obstacle is and which side it is on. A coin vibration motor behind the matching ear pulses: left, right, or both for straight ahead, and faster as the obstacle gets closer. There is no sound.
- **Hardware (per arm):** left temple: ESP32-C3 SuperMini and 2 MOSFET driver boards with flyback diodes. Right temple: LiPo 3.7 V 500 mAh, TP4056 USB-C charger with protection, and a slide power switch on top. Ear tips: one coin vibration motor each, under a rubber cap. Frame: 3D-printed PLA/PETG with clear non-prescription lenses and a rubber nose pad. No separate 3.3 V regulator: the SuperMini's onboard regulator runs from the battery through its 5V pin.
- **Sensor facts:** Class 1 (eye-safe) laser, about 4 cm to about 4 m indoors, shorter range in bright sunlight.
- **Battery:** 3–5 hours of continuous use is an early estimate, not tested.
- **Prototype parts cost (approximate Sri Lankan retail, November 2026; some are estimates), LKR:** 3× VL53L1X 5,250 · ESP32-C3 SuperMini 800 · LiPo 500 mAh 950 · TP4056 USB-C 120 · 2× coin motor 240 · 2× MOSFET drivers + diodes/resistors 300 · 3D-printed frame 3,000 · wiring, switch, perfboard 500 · **total ≈ 11,160**.
- **Target users (site):** people born blind; people who lost their sight later in life; families and carers. Waitlist roles: blind or VI person, family member or carer, organisation, other.
- **Competitors (prices checked 11/11/2026; exclude shipping, duty and tax):**
  - WeWALK Smart Cane 2: US$850 (https://floridareading.com/products/wewalk-smart-cane-2); RRP £599 excl. VAT (https://www.sightandsound.co.uk/product/wewalk-smart-cane-2-smart-cane-2-ai-smart-navigation-cane-for-blind-visually-impaired-users/)
  - Envision Glasses: US$1,899 (Read), US$2,499 (Home), US$3,499 (Professional) (https://shop.letsenvision.com/collections/envision-glasses)
  - Hapsight's comparison points: price, local support, no language barrier (vibration only), repairability with local parts.

### Landing page (B8), owner Pasan

- **Built:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4, three.js via @react-three/fiber and drei (procedural 3D model with exploded view), framer-motion, Supabase waitlist (server action, zod validation, honeypot, Row Level Security on with no policies), Vercel Web Analytics (cookieless).
- **Pages:** home (problem, how it works, features, design with an exploded 3D view, parts list and budget table, who it's for, comparison, team, FAQ, waitlist), /privacy, /accessibility, a 404 page, an icon and an Open Graph image.
- **Accessibility:** target WCAG 2.2 AA; skip link, keyboard-only use, settings for high contrast, larger text and reduced motion, light and dark themes, still images when WebGL is missing. Screen reader checks are planned (VoiceOver, NVDA, TalkBack) [CHECK: not yet done].
- **Privacy:** consent-based waitlist (name, email, role, consent version, time); kept until the project ends and no more than 12 months; deletion requests answered within 14 days; refers to Sri Lanka PDPA No. 9 of 2022; data in Supabase, site hosted on Vercel.
- **Not done yet:** not deployed; no domain bought (it must be our own .lk/.com over HTTPS by A4 and at the viva). Pasan is thinking about free hosting such as Netlify instead of buying a .com [CHECK: this may not meet B8]. Supabase keys are not set, so the form says "the waitlist is not switched on yet". The contact email is a placeholder (team@hapsight.example). Social links say "coming soon". The gallery is off. There are no Figma prototype screenshots yet (they come from Vinod). Logo: icon.svg only [CHECK]. A real-device photo is still [TBC].
- **Design reference renders** (docs/design-reference/) show extra sensors on the lower lens corners that the real device does not have. Don't use them as product images.

### Repository

- https://github.com/pasanjayaweerabis-cloud/ATP-SE-14. This replaces every HomeMaker repo link in the doc.
- 14 commits, all by Pasan, all on 12/11/2026. Branches: main, stage-one-structure, stage-one-design, project-data-update, project-issues-fix. Other members and the supervisor still need to be added as collaborators [CHECK], and every member still needs their own commits.
- .env.example still has old AI DM POS variables (Meta, LLM, payment). This is cleanup for Pasan, not doc content.

### Team (site team section and Pasan's statement, 12/11/2026)

| Name | Role now |
| --- | --- |
| Pasan Jayaweera | Team Leader; Technical Lead; Developer; design and web implementation (landing page) |
| Vidurath Jayaweera | Product Owner; Developer (gave the product idea) |
| Haziq Shafie | Scrum Master (current, Sprint 1); Developer |
| Krishan Wijeyesekera | Developer; requirements lead |
| Aynkaran Selvarajan (Vinod) | Developer; UX and ethics lead |

The Scrum Master rotation for Sprints 2–4 is still [CHECK].

### Section allocation (Team Checklist in docs/ATP_CW1_Tracker_Pasan.xlsx, plus Pasan's later changes)

Ch1 Vidurath, except 1.8 rich picture (Vinod) · 2.1, 2.2, 2.4 Krishan · 2.3 hardware Vidurath, software Pasan · 3.1, 3.2, team roles, 3.4–3.6, 3.8.3, 3.9–3.11 Haziq · 3.3 Pasan · 3.7, 3.7.1 personas Vinod · 3.7.2 user stories (compiles) and 3.8–3.8.2 backlog Vidurath · Ch4 Krishan (compiles 4.6; interviews only after ethics approval) · Ch5 Vinod (ethics form approved BEFORE any interview or user test) · Ch6 Pasan (6.1–6.3, 6.5, 6.6, Table 23), with 6.4 wireframes, Figma and Table 22 by Vinod · 7.1–7.6, 7.8 Haziq · 7.7 Vidurath · Ch8 compile, Appendices A, B and E, final export Haziq · Appendix C Vidurath · Appendix D Pasan · references check Vinod · summary table, cover and footer "Group 14" Pasan · everyone writes their own 8.3, user stories, use case descriptions, one sequence or activity diagram, meeting logs and presentation part.

**Later reassignments by Pasan [CHECK]:** 6.1–6.2 overview and architecture → Vidurath; 6.3.1 class diagram/DFD → Haziq; the user stories, use case descriptions and diagram for Pasan's own feature → Vidurath. Pasan's own feature is [CHECK]: the tracker says "connectivity/SOS", which the redesign removed.

### Dates and status

- Today 12/11/2026, 11 days to the CW1 deadline (23/11/2026, 13:00). Vivas from 26/11/2026.
- 2 supervision meetings held (A1 on 18/10/2026; A2 date [TBC]). None in the week of 09/11/2026. A3 and A4 still to be held before 23/11/2026.
- Jira still shows the earlier OminiWay plan. Pasan has postponed Jira updates until after November [CHECK]. Don't edit Jira. Mark the mismatches.
- Pasan's CW1 tracker: 30 tasks. In progress: summary table, landing page live, Git team access, own meeting logs. Everything else is not started.

## Part C: Edits, tab by tab

### Tab 1: Start here

1. Subtitle: "Waymark (working name)" → "Hapsight". In the Tabs list, "The product is now Waymark (working name) [CHECK]" → "The product is now Hapsight (final name, 12/11/2026)."
2. Key dates: keep everything. Remove "[CHECK whether roles rotate]" after Haziq for Sprint 1, because he is confirmed as the current Scrum Master. Add "[CHECK]" to the rotation for later sprints only.
3. Project timeline: add rows (keep them in date order and renumber the # column) for "Design change: headband → glasses (lecturer feedback, budget)", actual date [CHECK], Done, evidence "commit ca6b1f7; docs/prompts/glasses-redesign.md", and "Product named Hapsight", 12/11/2026, Done, evidence "commit 1b5b3ca". Row 8, landing page live: status "In progress – built, not deployed; domain not bought".
4. Sprint overview: Sprint 1 Scrum Master "Haziq" (no [CHECK]). Leave the goal as is.
5. Deliverables register: Git repository link → https://github.com/pasanjayaweerabis-cloud/ATP-SE-14, status "In progress – 14 commits (Pasan only); members + supervisor to add [CHECK]". Landing page row: Link [TBC], status "In progress – built and runs locally; not deployed; no domain; waitlist not connected".
6. Section owners table: heading "(Waymark allocation, 12/11/2026)" → "(Hapsight allocation, 12/11/2026)". Check every row against the Part B allocation and correct names only. Add one line under the table: "Later changes [CHECK]: 6.1–6.2 → Vidurath; 6.3.1 → Haziq; Pasan's own feature stories, use cases and diagram → Vidurath."
7. Semester 2, Implementation plan by device feature: replace the [TBC] feature names with these candidate features, keep Owner as [TBC] and add "[CHECK: team to assign]": three-direction ToF sensing (3× VL53L1X) · haptic feedback and motor driving (2 MOSFET drivers, pulse rate by distance) · power and charging (LiPo, TP4056 USB-C, switch) · controller firmware (ESP32-C3) · 3D-printed frame and enclosure. Delete the per-member placeholder rows only if they become duplicates, otherwise keep them.
8. Key links: GitHub repository → ATP-SE-14 (replace the HomeMaker link).
9. Version history: add **v1.0 | 12/11/2026 | Updated for Hapsight (haptic smart glasses): product name, design change from headband to glasses, current roles, Hapsight allocation, repo links, landing page status, facts-for-owner notes, OminiWay and headband content moved to Archive, idea history, backlog change log, risk snapshot, AI-use log. | Pasan Jayaweera (AI-assisted edit, Claude agent)**. Then name the version in File → Version history as "v1.0".

### Tab 2: Report – CW1 chapters

**Cover block**

- Title "Waymark (working name)" → "Hapsight". Version line → "v1.0 (12/11/2026)".

**Owner lines under chapter and section headings (grey italics)**

- Correct the owner names to the Part B allocation. Keep the Jira keys. Where the Jira ticket still shows the old owner, add " [CHECK: Jira shows the earlier plan]" once per chapter, not on every line.

**Chapter 1**

- 1.1: Move the whole OminiWay overview (the description, "Limits we have set", "Channels", "Pilot area", "Draft tech stack") to the Archive tab under "OminiWay (superseded)". Replace it with the owner line plus "Facts for the owner": what it is, tagline, who it is for, works with the cane, how it works in one bullet, the design change and its reason, student-prototype wording rule. Remove the "Superseded – owner to rewrite for Waymark" note.
- Idea history list: item 4 → "OminiWay → Waymark (working name) ([TBC] date): IoT assistive wearable for blind and visually impaired people (earlier name SmartSight), designed as an ear-hook headband. Reason for leaving OminiWay: [TBC]." Add item 5: "Headband → haptic smart glasses ([CHECK] date): lecturer feedback asked for a low-budget device every member can build and that works correctly. SOS, speaker, light sensor and LED features were removed." Add item 6: "Name: Waymark → Heedband (briefly) → Hapsight (12/11/2026)."
- Decision table: add matching rows (date, decision, reason, evidence). For the glasses change, evidence is "commit ca6b1f7; docs/prompts/glasses-redesign.md". For the name, evidence is "commit 1b5b3ca". Leave the existing [TBC] reason for the OminiWay → wearable switch.
- 1.2: Move the OminiWay client search text, In scope and Out of scope to the Archive. Keep "Client: [TBC]". Add: "Client search for Hapsight: [TBC] (SCRUM-74 was written for OminiWay [CHECK])." Out of scope facts for the owner: no SOS, no audio, no phone app [CHECK], not a medical device, not for sale.
- 1.9: Facts for the owner: the prototype parts cost table from Part B (as a table, with the source line "Approximate Sri Lankan retail prices, November 2026; some are estimates").

**Chapter 2**

- 2.1–2.2: Facts for the owner: the competitor list with prices, dates and URLs from Part B, plus Hapsight's comparison points. Note "Turnitin and Harvard references needed".
- 2.3: Replace "Start from the draft tech stack in 1.1…" with two labelled parts. **Hardware (Vidurath):** facts for the owner (components list). **Software (Pasan):** draft notes (AI-assisted) listing the landing page stack and, per item, a one-line "why", taken from Part B only. Add "[TBC] firmware language/framework for the ESP32-C3" and "[TBC] alternatives compared (required by B2)".

**Chapter 3**

- 3.1–3.2: the Jira link line is fine. Don't edit the reasons.
- 3.4 Team roles table: update the Scrum role and responsibility columns to the Part B team table, and remove the OminiWay responsibilities (LangGraph, Meta webhook, PayHere and so on). Scrum Master sprint column: Pasan Sprint 0, Haziq Sprint 1, others [CHECK]. Replace the long [CHECK] paragraph about SCRUM-76/78 with: "Scrum Master rotation for Sprints 2–4: [CHECK] (Jira still shows the earlier plan)." Under the table, change "The Product Owner owns the backlog priorities" only if needed to stay true (the PO is now Vidurath).
- Sprint structure table: Sprint 1 Scrum Master "Haziq Shafie" (no [CHECK]). Sprint 2–4 goals that say "[CHECK: written for OminiWay]" → "[TBC] (Hapsight build goals to be planned at Sprint 1 review)". Move the old goals to the Archive.
- Working agreement and signatures: don't touch.
- 3.5: GitHub → https://github.com/pasanjayaweerabis-cloud/ATP-SE-14. Remove "rename to the product name pending". Add: "Landing page hosting: Vercel [CHECK: Netlify being considered]; waitlist database: Supabase." Screenshots stay [TBC].
- 3.7: Move the OminiWay persona table, story counts and epics E1–E11 to the Archive. Keep the owner line and add facts for the owner: the three audience groups from the site and the four waitlist role options. Remove the "Superseded – owner to rewrite" note.
- 3.8 Backlog change log: add rows (don't edit the old ones):
  - "[TBC] | Backlog rebuilt for the Waymark headband | Idea switch | [TBC]"
  - "[CHECK] date | Hardware scope cut for the glasses: SOS, pause button, speaker, light sensor and LED removed; fall detection dropped [CHECK]; 3 ToF sensors + 2 vibration motors only | Lecturer feedback: low budget, buildable by every member, works correctly | commit ca6b1f7; docs/prompts/glasses-redesign.md"
- Release plan: Sprints 2–4 OminiWay goals → "[TBC]". Move the old wording to the Archive.
- 3.10 Risk snapshot: retitle "Snapshot 12/11/2026 (open risks)". Move R3 (Meta), R4 (payments/escrow), R13 (AI reply accuracy) and R14 (customer messages) to the Archive under "Closed risks (OminiWay)". Update R7: "Product name final (Hapsight, 12/11/2026); domain not bought; logo [CHECK]". Update R6: "Two of four supervision sessions held; none in week of 09/11/2026; A3 and A4 before 23/11/2026". Add proposed risks, each ending with " [CHECK: add to the risk register sheet]":
  - Landing page not live on own domain over HTTPS by A4 (B8). Action: buy domain, deploy, connect DNS. Owner Pasan.
  - Waitlist not connected (no Supabase keys). Owner Pasan.
  - Parts availability and cost in Sri Lanka (VL53L1X is the largest cost). Owner [TBC].
  - ToF range is shorter in bright sunlight, so outdoor detection may be weaker. Owner [TBC].
  - Battery life is untested (3–5 h estimate). Owner [TBC].
  - Only one member has Git commits. Action: everyone commits through branches and PRs. Owner Pasan.
  - Testing with blind or VI users needs ethics approval first. Owner Vinod.
  - Jira does not match the current plan. Owner Haziq.

**Chapter 4**

- 4.3–4.4: "it is not OminiWay evidence" → "it is not Hapsight evidence". Remove the "Superseded – owner to rewrite for Waymark" note and add the standard owner line. Add: "No elicitation with blind or VI users before ethics approval (Chapter 5)."

**Chapter 5**

- 5.1 and 5.3: facts for the owner (Vinod and the SLEP sub-owners): the waitlist privacy facts (PDPA No. 9 of 2022, consent, 12-month retention, 14-day deletion, data minimisation with no health data and no stored IP, cookieless analytics); Class 1 laser; no medical or safety claims; works with the cane; accessibility target WCAG 2.2 AA; sustainability points (local parts, repairable, 3D-printed frame, rechargeable). Put each fact under the matching sub-heading. Don't write analysis.

**Chapter 6** (Pasan, with reassignments)

- 6.1–6.2: owner line → Vidurath [CHECK]. Facts for the owner: the hardware data flow, one item per line: 3× VL53L1X → ESP32-C3 SuperMini → 2 MOSFET drivers → left/right coin motors; power: LiPo → TP4056 (USB-C) → slide switch → SuperMini 5V pin. Add "[CHECK] Is there a phone app, Bluetooth or cloud part? The tracker says yes; the current design says standalone." Add the technical note "[CHECK] Three VL53L1X share the same default I2C address, so the wiring needs a way to give each one its own address (for example, XSHUT pins)."
- 6.3: replace the OminiWay diagram bullets (DM → order, webhook, AI slot-filling, product matching, merchant dashboard) with one bullet per member: "Name – diagram for own Hapsight feature: [TBC]". 6.3.1 → Haziq [CHECK]. Move the old bullets to the Archive.
- 6.4: add "The landing page is not the hi-fi prototype. The Figma prototype (Vinod) is still [TBC]."
- 6.5–6.6 / Table 23 (design decisions): draft notes (AI-assisted, Pasan to rewrite) with candidate decisions, one row each. Use only reasons stated in the repo, and write [TBC] where no reason is recorded:
  - Form factor glasses vs headband. Reason: lecturer feedback on budget and buildability.
  - Haptic only vs audio. Reason: doesn't cover the traffic sounds users listen for (site copy).
  - Sensors in open windows in the top bar, not behind the lenses.
  - No separate regulator (SuperMini onboard regulator).
  - 3D-printed frame. Reason: local manufacture and repair.
  - VL53L1X ToF vs alternatives (for example ultrasonic). Reason [TBC].

**Chapter 7**

- 7.2 Evidence (links): GitHub link → ATP-SE-14, and keep "(superseded: HomeMaker repo)" as text.
- 7.3: leave the goal row and its [CHECK]. Change the note to "[CHECK: set before the switch to the Hapsight glasses]". In 7.3.4 add candidate increment items marked [CHECK]: "Hapsight landing page built (repo ATP-SE-14, 12/11/2026), not yet deployed"; "Glasses hardware design and parts list (≈ LKR 11,160)".
- Sprints 2–4 plan summary: goals → [TBC]; move the old ones to the Archive.
- 7.7.3 (Pasan): draft notes from the repo: TypeScript strict, ESLint (`npm run lint`), type check (`npm run typecheck`), .editorconfig, feature branches exist (list them), commit messages should start with the Jira key per 3.4 [CHECK: current commits don't].

**Chapter 8**

- 8.3 headings: update the role in each member's heading to the Part B team table (for example "Vidurath Jayaweera — Product Owner, Developer"), with [CHECK]. Don't write anything under other members' names.
- Pasan's 8.3 draft bullets: keep the existing ones. Add "Led the redesign from headband to glasses on the landing page and built the Hapsight landing page (Next.js, 3D exploded model, accessibility settings, privacy and accessibility pages, waitlist)" and "Maintained this report v0.8–v1.0". Retitle "Pasan Jayaweera — Team Leader; Technical Lead". Keep "Pasan to rewrite in his own words".

### Tab 3: Appendix B – Meeting minutes

- Don't add or fill any meeting. Only change "OminiWay" or "Waymark" where a placeholder heading names the product. Don't touch real minutes.

### Tab 4: Appendices, evidence and AI-use log

- Appendix D (Pasan): add evidence rows with Link [TBC] where unknown: GitHub repo (ATP-SE-14) and commit history screenshot; landing page screenshots (home, design exploded view, privacy, accessibility; stills exist in public/stills/); live URL [TBC]; Lighthouse report [TBC]; Supabase table screenshot [TBC].
- Evidence index: add docs/prompts/glasses-redesign.md (design change brief, 12/11/2026); docs/design-reference/ renders ("concept only; show sensors the device does not have, not for publication"); docs/ATP_CW1_Tracker_Pasan.xlsx (Pasan's CW1 tracker). Use the naming rule yyyy-mm-dd_TYPE_short-title when you suggest file names for SE14 Evidence.
- Supervision tracker here: keep it at "2 of 4". No new content.
- AI-use log: add two rows, both dated 12/11/2026, both by Pasan:
  - "Claude Code (AI coding assistant): built and redesigned the Hapsight landing page and 3D model from Pasan's brief (docs/prompts/glasses-redesign.md); Pasan reviewed and committed the code."
  - "Claude agent: updated this report to v1.0 (facts, links, statuses, archive moves, facts-for-owner notes); no member's own sections were written."

### Tab 5: Archive

- Add a heading **"OminiWay / AI DM POS (superseded, 03/11–[TBC]/2026)"** with sub-headings for everything you moved: overview and limits, tech stack, client brief, personas and epics, Sprint 2–4 goals, design diagram list, and "Closed risks (OminiWay)".
- Add a heading **"Waymark headband (superseded design)"** with a short factual note: ear-hook headband concept (earlier name SmartSight), replaced by the glasses after lecturer feedback on budget; removed features listed in Part B.
- Keep "Do not edit" on the HomeMaker material.

## Part D: When you finish, report back to Pasan

Reply with:

1. A list of every change, grouped by tab (one line each).
2. Every [CHECK] you added or left in place, as a list Pasan can work through.
3. Edits you skipped and why.
4. Items to fix outside the doc: Jira (SCRUM-65, SCRUM-74, the Scrum Master rotation tickets, the OminiWay owners), the risk register sheet (new risks), the GitHub collaborators, .env.example cleanup, the domain and the Supabase keys.
5. A suggested comment (select text → Comment → +email → Assign) for each section owner whose section has new "Facts for the owner". Don't post the comments yourself unless Pasan says so.
