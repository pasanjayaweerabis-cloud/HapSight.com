/**
 * All text on the site lives here: the name, tagline, every section, form copy,
 * labels for the 3D exploded view and the legal pages.
 *
 * "Waymark" is a working name, not final. Change `brand.name` and it updates everywhere.
 *
 * Copy rules (keep them when editing):
 * - This is a student prototype in the design stage. Describe planned behaviour
 *   ("is designed to", "will"), never proven results.
 * - No medical claims, no claim that it makes crossing roads safe, no invented statistics.
 */

export const brand = {
  name: "Waymark",
  workingNameNote: "Working name",
  tagline: "Feel the path ahead.",
  shortDescription:
    "Low-cost haptic glasses being designed to help blind and visually impaired people notice obstacles at head height, silently and hands-free.",
  contactEmail: "team@waymark.example",
  siteUrl: "https://waymark.example",
} as const;

export const meta = {
  title: `${brand.name} – haptic glasses that feel the path ahead`,
  description:
    "Waymark is a student-designed pair of low-cost haptic glasses for blind and visually impaired people. Three laser sensors in the frame look left, ahead and right, and a gentle vibration behind the matching ear tells you where an obstacle is. It works with the white cane, not instead of it.",
  ogAlt:
    "The Waymark glasses in matte charcoal on a dark navy background: a flat-topped frame with clear lenses and three small sensors in the top bar.",
} as const;

export const skipLink = "Skip to main content";

export const nav = {
  label: "Main",
  homeLabel: `${brand.name} home`,
  links: [
    { href: "#how-it-works", label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#design", label: "Design" },
    { href: "#team", label: "Team" },
    { href: "#faq", label: "FAQ" },
  ],
  cta: { href: "#waitlist", label: "Join the waitlist" },
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuTitle: "Menu",
} as const;

export const a11yPanel = {
  open: "Accessibility settings",
  close: "Close accessibility settings",
  title: "Accessibility settings",
  intro: "These settings are saved on this device.",
  theme: {
    legend: "Colour theme",
    options: [
      { value: "system", label: "Match my device" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
  },
  highContrast: {
    label: "High contrast",
    hint: "Stronger colours and borders.",
  },
  largeText: {
    label: "Larger text",
    hint: "Makes all text about 20% bigger.",
  },
  reduceMotion: {
    label: "Reduce motion",
    hint: "Stops rotation and scroll animations. Shows still pictures instead.",
  },
  reset: "Reset to defaults",
} as const;

export const hero = {
  eyebrow: "Student prototype · in design",
  headline: brand.tagline,
  sub: brand.shortDescription,
  primaryCta: { href: "#waitlist", label: "Join the waitlist" },
  secondaryCta: { href: "#how-it-works", label: "See how it works" },
  deviceDescriptionTitle: "What the device is like",
  deviceDescription:
    "Waymark looks like a pair of chunky, flat-topped glasses in matte charcoal plastic with clear lenses. The thick top bar of the frame has three small open windows: one at each outer corner and one in the middle, above the nose. Each window holds a tiny laser distance sensor; the two corner sensors are angled slightly outward. A soft rubber nose pad sits under the bridge. The left arm holds the controller and the two motor drivers. The right arm holds the battery and the USB-C charger, with the charging port at the back of the wide part of the arm and a small slide switch on top. Each arm ends in a curved ear tip with a soft rubber cap, and a small vibration motor inside rests behind the ear.",
  canvasHint: "Drag to turn the 3D model.",
} as const;

export const problem = {
  id: "problem",
  eyebrow: "The problem",
  title: "The cane finds the ground. Not everything is on the ground.",
  paragraphs: [
    "A white cane is the best tool for checking the path at your feet: steps, kerbs, holes and objects on the ground.",
    "But some obstacles are higher up or off to the side, where a cane can miss them: low tree branches, shop signboards, open shutters, the side mirror or roof of a parked tuk-tuk.",
    "On many Sri Lankan pavements, the path is also uneven, narrow and crowded, with stalls, poles and parked vehicles. That leaves a lot to guess.",
  ],
  examplesTitle: "Things a cane can miss",
  examples: [
    "Low tree branches",
    "Shop signboards and awnings",
    "Parked tuk-tuks and vehicle mirrors",
    "Poles and wires at an angle",
  ],
} as const;

export const howItWorks = {
  id: "how-it-works",
  eyebrow: "How it works",
  title: "Sense. Decide. Feel.",
  intro:
    "Three laser sensors in the frame look ahead. A small vibration behind the matching ear tells you which side an obstacle is on. You decide how to move.",
  steps: [
    {
      id: "sense",
      number: "1",
      title: "Sense",
      body: "Three laser sensors scan left, ahead and right. They sit in open windows in the top bar of the frame, not behind the lenses, and are designed to measure how far away things are at head height.",
    },
    {
      id: "decide",
      number: "2",
      title: "Decide",
      body: "The controller works out how close the obstacle is and which side it's on, from which of the three sensors sees it.",
    },
    {
      id: "feel",
      number: "3",
      title: "Feel",
      body: "The matching ear vibrates, faster as you get closer. Both ears vibrate together when the obstacle is straight ahead. You choose how to step around it, keeping your cane on the ground as usual.",
    },
  ],
  activeStepLabel: "Showing step",
  reducedMotionNote: "Animation is off. Each step is described in the text.",
} as const;

export type FeatureIcon = "directions" | "haptic" | "handsFree" | "cane" | "charge" | "parts" | "glasses";

export const features = {
  id: "features",
  eyebrow: "Features",
  title: "Designed for real streets",
  intro: "These are the features in the current design. The final prototype may change as we test with users.",
  items: [
    {
      icon: "directions",
      title: "Three directions",
      body: "Three sensors look left, straight ahead and right, so Waymark can tell you which side an obstacle is on.",
    },
    {
      icon: "haptic",
      title: "Silent haptic feedback",
      body: "Gentle vibrations behind the ears, faster as an obstacle gets closer. There is no sound, so it is designed not to cover the traffic sounds you listen for.",
    },
    {
      icon: "handsFree",
      title: "Hands-free",
      body: "Nothing to hold. Your hands stay free for the cane, a railing or a bag.",
    },
    {
      icon: "cane",
      title: "Works with the white cane",
      body: "The cane checks the ground at your feet. Waymark is meant to add a warning about obstacles at head height, not to replace the cane.",
    },
    {
      icon: "charge",
      title: "USB-C rechargeable",
      body: "Charges with an ordinary USB-C cable. A slide switch turns it fully off so the battery doesn't drain.",
    },
    {
      icon: "parts",
      title: "Low cost, local parts",
      body: "Built from common parts available in Sri Lanka and a 3D-printed frame, so it can be made and repaired locally.",
    },
    {
      icon: "glasses",
      title: "Looks like ordinary glasses",
      body: "A familiar shape that doesn't draw attention, with clear non-prescription lenses.",
    },
  ] satisfies { icon: FeatureIcon; title: string; body: string }[],
} as const;

/** Labels for the exploded view. Order here = order in the accessible list. */
export type LabelId =
  | "tofFront"
  | "tofLeft"
  | "tofRight"
  | "controller"
  | "motorLeft"
  | "motorRight"
  | "drivers"
  | "battery"
  | "charger"
  | "frame"
  | "lenses"
  | "wiring";

export interface PartLabel {
  name: string;
  where: string;
  description: string;
}

const TOF_DESCRIPTION =
  "Measures distance with an invisible, eye-safe (Class 1) laser, from about 4 cm up to about 4 m indoors. Range is shorter in bright sunlight. Three directions tell left, ahead and right apart.";
const MOTOR_DESCRIPTION =
  "Vibrates on the side the obstacle is on. Both vibrate together for straight ahead. The closer the obstacle, the faster the pulses.";

export const design = {
  id: "design",
  eyebrow: "Design",
  title: "What's inside",
  intro:
    "Scroll to take the glasses apart. First the temple covers, lenses, nose pad and ear caps come off, then the sensors, boards, battery and motors come out. Dashed lines show where each part sits. Scroll back up to put it together again.",
  stages: {
    assembled: "Assembled",
    half: "Covers off",
    full: "Fully exploded",
  },
  currentStageLabel: "Current view",
  listTitle: "Parts and where they are",
  labels: {
    tofFront: {
      name: "Front distance sensor (VL53L1X)",
      where: "Centre of the top bar, above the bridge, facing straight ahead",
      description: TOF_DESCRIPTION,
    },
    tofLeft: {
      name: "Left distance sensor (VL53L1X)",
      where: "Left corner of the top bar, angled left-forward",
      description: TOF_DESCRIPTION,
    },
    tofRight: {
      name: "Right distance sensor (VL53L1X)",
      where: "Right corner of the top bar, angled right-forward",
      description: TOF_DESCRIPTION,
    },
    controller: {
      name: "Controller (ESP32-C3 SuperMini)",
      where: "Inside the left temple, next to the hinge",
      description: "Reads the three sensors and sets how fast each motor pulses.",
    },
    motorLeft: {
      name: "Left vibration motor",
      where: "Left ear tip, behind the ear",
      description: MOTOR_DESCRIPTION,
    },
    motorRight: {
      name: "Right vibration motor",
      where: "Right ear tip, behind the ear",
      description: MOTOR_DESCRIPTION,
    },
    drivers: {
      name: "Motor drivers (2 MOSFET switches)",
      where: "Inside the left temple, behind the controller",
      description:
        "Switches battery power to the motors, because the controller's pins can't drive them directly. A small diode protects the circuit.",
    },
    battery: {
      name: "Battery (LiPo 3.7 V, 500 mAh)",
      where: "Inside the right temple",
      description: "Powers everything without a cable.",
    },
    charger: {
      name: "USB-C charging (TP4056 with protection)",
      where: "Inside the right temple, port on the outside",
      description:
        "Charges the battery over USB-C and protects it from overcharging, over-discharging and short circuits.",
    },
    frame: {
      name: "3D-printed frame (PLA/PETG)",
      where: "The whole body: front, temples, covers",
      description: "Holds every part at the right angle. It can be printed on an ordinary 3D printer.",
    },
    lenses: {
      name: "Clear lenses",
      where: "Front frame",
      description:
        "Non-prescription, mainly so the device looks and feels like ordinary glasses. The sensors are not behind the lenses.",
    },
    wiring: {
      name: "Wiring and power switch",
      where: "Wires run through the frame and temples; switch on the right temple",
      description: "Connects every part. The switch turns the glasses fully off so the battery doesn't drain.",
    },
  } satisfies Record<LabelId, PartLabel>,
  otherPartsTitle: "Also inside",
  otherParts: ["Flyback diodes", "Resistors", "Perfboard", "Heat-shrink tubing", "JST connectors"],
  budget: {
    title: "Prototype parts cost",
    caption: "Approximate cost of the parts for one prototype, in Sri Lankan rupees",
    columns: { part: "Part", qty: "Qty", cost: "LKR" },
    rows: [
      { part: "VL53L1X ToF sensor", qty: "3", cost: "5,250" },
      { part: "ESP32-C3 SuperMini", qty: "1", cost: "800" },
      { part: "LiPo 3.7 V 500 mAh", qty: "1", cost: "950" },
      { part: "TP4056 USB-C charger (with protection)", qty: "1", cost: "120" },
      { part: "Coin vibration motor", qty: "2", cost: "240" },
      { part: "MOSFET drivers + diodes/resistors", qty: "2", cost: "300" },
      { part: "3D-printed frame", qty: "1", cost: "3,000" },
      { part: "Wiring, switch, perfboard", qty: "—", cost: "500" },
    ],
    total: { label: "Total", cost: "≈ 11,160" },
    footnote: "Approximate Sri Lankan retail prices, November 2026. Some are estimates.",
  },
  note: "Concept design – the final prototype may differ.",
} as const;

export const gallery = {
  /**
   * Off until real photos or corrected renders exist in public/gallery/ (see README, "Gallery").
   * Do not use the concept renders in design-reference/: they show extra sensors on the lenses.
   */
  enabled: false,
  id: "gallery",
  eyebrow: "Gallery",
  title: "The glasses",
  intro: "Concept renders of the glasses from the front, the side and at an angle.",
  items: [
    {
      src: "/gallery/front.png",
      alt: "Front view: a flat-topped charcoal frame with clear lenses, three small sensor windows in the thick top bar and a rubber nose pad under the bridge.",
    },
    {
      src: "/gallery/side.png",
      alt: "Side view: the arm is wide near the frame, where the electronics sit, then slims and curves down into a rubber-capped ear tip.",
    },
    {
      src: "/gallery/three-quarter.png",
      alt: "Three-quarter view: the frame from the front left, with both arms reaching back and the small slide switch on top of the right arm.",
    },
  ],
  note: "Concept renders. The final prototype may differ.",
} as const;

export const audience = {
  id: "who-its-for",
  eyebrow: "Who it's for",
  title: "Made with the people who will use it",
  items: [
    {
      title: "People born blind",
      body: "For confident cane users who want an extra warning about obstacles above the ground and to the sides.",
    },
    {
      title: "People who lost their sight later in life",
      body: "For people still building confidence with a cane, who want more information about what is around them.",
    },
    {
      title: "Families and carers",
      body: "For the people who support them, and want a simple, affordable tool they can help set up and look after.",
    },
  ],
} as const;

/**
 * Comparison table. Competitor prices are approximate public list prices.
 * Sources (checked 11 November 2026):
 * - Imported smart canes: WeWALK Smart Cane 2, US$850 at floridareading.com
 *   (https://floridareading.com/products/wewalk-smart-cane-2) and RRP £599 excl. VAT at
 *   sightandsound.co.uk (https://www.sightandsound.co.uk/product/wewalk-smart-cane-2-smart-cane-2-ai-smart-navigation-cane-for-blind-visually-impaired-users/).
 * - AI smart glasses: Envision Glasses, US$1,899 (Read), US$2,499 (Home) and US$3,499
 *   (Professional) at the official store (https://shop.letsenvision.com/collections/envision-glasses).
 * Prices exclude shipping, import duty and taxes to Sri Lanka.
 */
export const comparison = {
  id: "comparison",
  eyebrow: "Comparison",
  title: "How it compares",
  caption: "Waymark compared with imported smart canes and AI smart glasses",
  columns: ["Waymark", "Imported smart canes", "AI smart glasses"],
  rowHeader: "What we compared",
  rows: [
    {
      label: "Approximate price",
      values: [
        "Target build cost ≈ LKR 11,200 (prototype parts)",
        "About US$600–850 (for example, WeWALK Smart Cane 2), before shipping and import duty",
        "About US$1,900–3,500 (for example, Envision Glasses), before shipping and import duty",
      ],
    },
    {
      label: "Local support in Sri Lanka",
      values: [
        "Planned: built and supported by a local team",
        "Usually through the overseas maker or a distributor abroad",
        "Usually through the overseas maker or a distributor abroad",
      ],
    },
    {
      label: "Sinhala, Tamil and English",
      values: [
        "Not needed: Waymark uses vibration only, with no spoken words",
        "Depends on the product. Check the maker's language list",
        "Depends on the product. Check the maker's language list",
      ],
    },
    {
      label: "Repairability",
      values: [
        "Planned: common parts that can be replaced locally",
        "Usually repaired or replaced by the maker",
        "Usually repaired or replaced by the maker",
      ],
    },
  ],
  footnote: "Approximate public list prices; may change.",
} as const;

export const team = {
  id: "team",
  eyebrow: "Team",
  title: "Group 14",
  intro:
    "We are a student team on the Agile Team Project (ATP) module, BEng (Hons) Software Engineering at the Informatics Institute of Technology (IIT), Sri Lanka, affiliated with the University of Westminster.",
  members: [
    { name: "Vidurath", role: "Product Owner" },
    { name: "Haziq", role: "Scrum Master" },
    { name: "Krishan", role: "Developer – requirements lead" },
    { name: "Vinod", role: "Developer – UX and ethics lead" },
    { name: "Pasan", role: "Team Leader, Developer – technical lead" },
  ],
  avatarNote: "Placeholder avatar",
} as const;

export const faq = {
  id: "faq",
  eyebrow: "FAQ",
  title: "Questions",
  items: [
    {
      q: "Does it replace the white cane?",
      a: [
        "No. Waymark is designed to work together with the white cane, not instead of it.",
        "The cane checks the ground at your feet. Waymark is meant to warn you about obstacles at head height. It does not replace orientation and mobility training, and it does not tell you when it is safe to cross a road.",
      ],
    },
    {
      q: "How do the glasses tell me where the obstacle is?",
      a: [
        "Three laser sensors in the top bar of the frame look left, straight ahead and right.",
        "If the obstacle is on your left, the motor behind your left ear vibrates. If it is on your right, the right one vibrates. If it is straight ahead, both vibrate. The closer it is, the faster the pulses.",
      ],
    },
    {
      q: "Do I need a prescription?",
      a: [
        "No. The prototype uses clear, non-prescription lenses. The lenses are mainly there so the device looks and feels like ordinary glasses; the sensors do not look through them.",
        "A version that takes prescription lenses is a possible future idea.",
      ],
    },
    {
      q: "How long does the battery last?",
      a: [
        "Our early estimate is about 3–5 hours of continuous use with the prototype's 500 mAh battery. We'll measure it properly during testing.",
        "It charges with an ordinary USB-C cable.",
      ],
    },
    {
      q: "How do I turn it off?",
      a: [
        "Slide the small switch on top of the right arm. You can find it by touch, just behind the wide part of the arm.",
        "The switch turns the glasses fully off, so the battery doesn't drain while you are not wearing them.",
      ],
    },
    {
      q: "Is it available yet?",
      a: [
        "Not yet. Waymark is a student prototype that is still being designed and tested. It is not for sale.",
        "Join the waitlist to hear about our progress and chances to give feedback.",
      ],
    },
  ],
} as const;

export const waitlist = {
  id: "waitlist",
  eyebrow: "Waitlist",
  title: "Join the waitlist",
  intro:
    "Get updates as the prototype develops. We will only use your details for this project, and you can ask us to delete them at any time.",
  fields: {
    name: { label: "Your name", autoComplete: "name" },
    email: {
      label: "Email address",
      hint: "We will only email you about Waymark.",
      autoComplete: "email",
    },
    role: {
      legend: "I am a…",
      options: [
        { value: "blind_or_vi", label: "Blind or visually impaired person" },
        { value: "family_or_carer", label: "Family member or carer" },
        { value: "organisation", label: "Organisation" },
        { value: "other", label: "Other" },
      ],
    },
    consent: {
      label:
        "I agree that ATP Group 14 can store my name, email and the option I chose, to contact me about Waymark. I can ask for my details to be deleted at any time.",
      privacyLinkText: "Read the privacy notice",
    },
    honeypot: "Leave this field empty",
  },
  requiredNote: "All fields are required.",
  submit: "Join the waitlist",
  submitting: "Sending…",
  errors: {
    summaryTitle: "Please fix the following:",
    fieldPrefix: "Error:",
    nameRequired: "Enter your name.",
    nameTooLong: "Your name must be 100 characters or fewer.",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter an email address in the format name@example.com.",
    roleRequired: "Choose the option that describes you best.",
    consentRequired: "Tick the box to agree, so we can store your details.",
    generic: "Sorry, something went wrong and your details were not saved. Please try again in a moment.",
    notConfigured:
      "Sorry, the waitlist is not switched on yet, so your details were not saved. Please try again later.",
    rateLimited: "Too many attempts. Please wait a minute and try again.",
  },
  success: {
    title: "Thank you, you're on the list.",
    body: "We will email you when there is news about Waymark.",
  },
} as const;

export const footer = {
  disclaimer:
    "Student prototype. It does not replace the white cane, orientation and mobility training, or safe road-crossing judgement.",
  contactLabel: "Contact",
  socialLabel: "Social",
  socials: [
    { label: "Instagram", note: "coming soon" },
    { label: "LinkedIn", note: "coming soon" },
    { label: "YouTube", note: "coming soon" },
  ],
  legalLabel: "Legal",
  links: [
    { href: "/privacy", label: "Privacy notice" },
    { href: "/accessibility", label: "Accessibility statement" },
  ],
  credit:
    "ATP Group 14 · BEng (Hons) Software Engineering · IIT Sri Lanka, affiliated with the University of Westminster",
  nameNote: `${brand.name} is a working name.`,
} as const;

export const notFound = {
  title: "Page not found",
  body: "The page you were looking for does not exist.",
  back: "Go to the home page",
} as const;

export const privacyPage = {
  title: "Privacy notice",
  metaDescription: "What the Waymark waitlist collects, why, how long we keep it and how to ask for deletion.",
  updated: "Last updated: 12 November 2026",
  sections: [
    {
      heading: "Who we are",
      body: [
        `${brand.name} is a student project by ATP Group 14 (BEng (Hons) Software Engineering, Informatics Institute of Technology, Sri Lanka, affiliated with the University of Westminster). For this website and its waitlist, the team is responsible for your personal data.`,
        `Contact: ${brand.contactEmail}`,
      ],
    },
    {
      heading: "What we collect",
      body: [
        "When you join the waitlist we collect: your name, your email address, the option you chose under \"I am a…\", that you gave consent, and the date and time you signed up.",
        "We also save which version of the consent wording you agreed to. We do not store your IP address with your sign-up; it is only used for a moment to block automated spam.",
        "We do not ask for health information, and you do not need to tell us about your sight.",
        "We use Vercel Web Analytics to count page visits. It does not use cookies and does not identify you.",
      ],
    },
    {
      heading: "Why we collect it",
      body: [
        "Only to email you updates about the Waymark project and, if you want, invitations to give feedback. We use your consent as the basis for this.",
        "We will never sell your details or use them for advertising.",
      ],
    },
    {
      heading: "Where it is stored",
      body: [
        "Waitlist details are stored in a database run by Supabase. The website is hosted by Vercel. Only members of the project team can see the waitlist.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "We keep your details until the project ends, and no longer than 12 months after you sign up. Then we delete them.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Under Sri Lanka's Personal Data Protection Act, No. 9 of 2022, you can ask to see the data we hold about you, ask us to correct it, withdraw your consent, and ask us to delete it.",
        `To ask for deletion, or anything else about your data, email ${brand.contactEmail} from the address you signed up with, with the subject "Delete my data". We will confirm within 14 days.`,
        "If you are not happy with how we handled your request, you can contact the Data Protection Authority of Sri Lanka.",
      ],
    },
  ],
} as const;

export const accessibilityPage = {
  title: "Accessibility statement",
  metaDescription: "How we make the Waymark website accessible, and how to report a problem.",
  updated: "Last updated: 12 November 2026",
  sections: [
    {
      heading: "Our goal",
      body: [
        "Waymark is for blind and visually impaired people, so this website must work well with screen readers and keyboards. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
      ],
    },
    {
      heading: "What we have done",
      body: [
        "Every section has a clear heading, and you can skip straight to the main content.",
        "You can use the whole site with a keyboard alone, and focus is always visible.",
        "The 3D models are decoration only. Everything they show is also written as text.",
        "The accessibility settings let you choose high contrast, larger text and reduced motion. The site also follows your device's reduced motion setting.",
        "We check the site with the VoiceOver, NVDA and TalkBack screen readers as we build it.",
      ],
    },
    {
      heading: "Known limitations",
      body: [
        "The 3D views need WebGL. If your browser does not support it, you will see still pictures instead.",
      ],
    },
    {
      heading: "Report a problem",
      body: [
        `If something does not work for you, please email ${brand.contactEmail} with the page, what you were trying to do, and the device, browser and screen reader you use. We aim to reply within 5 working days.`,
      ],
    },
  ],
} as const;
