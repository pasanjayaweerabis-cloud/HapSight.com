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
  tagline: "Walk with confidence.",
  shortDescription:
    "A low-cost wearable headband that is being designed to help blind and visually impaired people notice obstacles at head height and to the sides.",
  contactEmail: "team@waymark.example",
  siteUrl: "https://waymark.example",
} as const;

export const meta = {
  title: `${brand.name} – a wearable that feels the path ahead`,
  description:
    "Waymark is a student-designed, low-cost headband for blind and visually impaired people. Two sensors look ahead and gentle vibrations at each temple tell you where an obstacle is. It works with the white cane, not instead of it.",
  ogAlt:
    "The Waymark headband in dark teal on a dark background, with two round sensors on the forehead band.",
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
  headline: "Walk with confidence.",
  sub: "A wearable that feels the path ahead, so you don't have to guess.",
  primaryCta: { href: "#waitlist", label: "Join the waitlist" },
  secondaryCta: { href: "#how-it-works", label: "See how it works" },
  deviceDescriptionTitle: "What the device is like",
  deviceDescription:
    "Waymark is a slim, dark teal headband. Two round distance sensors sit on the forehead and face forward. From each end of the band, a hook curves over and behind the ear without covering it, and ends in a small rounded pod. A soft vibration pad rests on the inside at each temple. The right pod has a large red SOS button with raised dots. The left pod has a small pause button with one raised ridge and a USB-C charging port. A fabric strap with a sliding buckle closes the band at the back of the head.",
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
  title: "Sense. Feel. Move.",
  intro:
    "Two sensors look ahead. Small vibrations at your temples tell you which side an obstacle is on. You decide how to move.",
  steps: [
    {
      id: "sense",
      number: "1",
      title: "Sense",
      body: "Two distance sensors on the forehead look forward. The left sensor points slightly left and the right sensor slightly right. Their views overlap in the middle, so Waymark can tell left, right and straight ahead apart.",
    },
    {
      id: "feel-left",
      number: "2",
      title: "Feel: obstacle on the left",
      body: "When something is ahead on your left, only the LEFT temple pad vibrates.",
    },
    {
      id: "feel-right",
      number: "3",
      title: "Feel: obstacle on the right",
      body: "When something is ahead on your right, only the RIGHT temple pad vibrates.",
    },
    {
      id: "feel-ahead",
      number: "4",
      title: "Feel: obstacle straight ahead",
      body: "When something is straight ahead, BOTH pads vibrate. The closer it is, the faster the pulses.",
    },
    {
      id: "move",
      number: "5",
      title: "Move",
      body: "You choose how to step around it, keeping your cane on the ground as usual. When the way is clear, the vibrations stop.",
    },
  ],
  activeStepLabel: "Showing step",
  reducedMotionNote: "Animation is off. Each step is described in the text.",
} as const;

export type FeatureIcon =
  | "direction"
  | "distance"
  | "approach"
  | "range"
  | "filter"
  | "pause"
  | "sos"
  | "light"
  | "voice";

export const features = {
  id: "features",
  eyebrow: "Features",
  title: "Designed for real streets",
  intro: "These are the features in the current design. The final prototype may change as we test with users.",
  items: [
    {
      icon: "direction",
      title: "Left and right guidance",
      body: "The pad on the side of the obstacle vibrates. Both pads vibrate when it is straight ahead.",
    },
    {
      icon: "distance",
      title: "Distance you can feel",
      body: "Slow pulses when an obstacle is far away, faster pulses as it gets closer.",
    },
    {
      icon: "approach",
      title: "Approaching-object warning",
      body: "A different vibration pattern when something is moving towards you, such as a cyclist or a person walking fast.",
    },
    {
      icon: "range",
      title: "Adjustable range",
      body: "Choose how far ahead it checks: 1, 2 or 3 metres. A short range suits crowded places.",
    },
    {
      icon: "filter",
      title: "Rain and crowd filtering",
      body: "Designed to ignore raindrops and brief movements in a crowd, so you get fewer false alerts.",
    },
    {
      icon: "pause",
      title: "Pause with auto-resume",
      body: "Press the pause button on the left pod to stop vibrations, for example in a queue. It turns back on by itself after a short time.",
    },
    {
      icon: "sos",
      title: "SOS button",
      body: "Press the large red button on the right pod for a loud alarm sound and flashing lights, so people nearby notice you need help.",
    },
    {
      icon: "light",
      title: "Automatic night lights",
      body: "A light sensor switches on the warm white lights on the back strap and pods when it gets dark, so drivers and cyclists can see you.",
    },
    {
      icon: "voice",
      title: "Short voice messages",
      body: "Brief spoken status messages, such as battery level, range or paused, in Sinhala, Tamil or English.",
    },
  ] satisfies { icon: FeatureIcon; title: string; body: string }[],
} as const;

/** Labels for the exploded view. Order here = order in the accessible list. */
export type LabelId =
  | "sensorLeft"
  | "sensorRight"
  | "motorLeft"
  | "motorRight"
  | "controller"
  | "sos"
  | "speaker"
  | "battery"
  | "usbc"
  | "pause"
  | "ledStrip"
  | "lightSensor";

export const design = {
  id: "design",
  eyebrow: "Design",
  title: "What's inside",
  intro:
    "Scroll to take the headband apart. Each part moves out in the direction of its arrow. Scroll back up to put it together again.",
  stages: {
    assembled: "Assembled",
    half: "Shells open",
    full: "Fully exploded",
  },
  currentStageLabel: "Current view",
  listTitle: "Parts and where they are",
  labels: {
    sensorLeft: {
      name: "Left distance sensor",
      where: "Front of the band, left side. Looks forward and slightly left.",
    },
    sensorRight: {
      name: "Right distance sensor",
      where: "Front of the band, right side. Looks forward and slightly right.",
    },
    motorLeft: {
      name: "Left vibration motor",
      where: "Behind the left temple pad, with its small driver board.",
    },
    motorRight: {
      name: "Right vibration motor",
      where: "Behind the right temple pad, with its small driver board.",
    },
    controller: {
      name: "Controller and Bluetooth",
      where: "Inside the right ear pod. Reads the sensors and drives the motors.",
    },
    sos: {
      name: "SOS button",
      where: "Outer face of the right ear pod. Large, red, with raised dots.",
    },
    speaker: {
      name: "Speaker and buzzer",
      where: "Right ear pod, behind the small grille. Plays voice messages and the alarm.",
    },
    battery: {
      name: "Battery",
      where: "Inside the left ear pod. Flat and rechargeable.",
    },
    usbc: {
      name: "USB-C charging",
      where: "Left ear pod. Charging board and port.",
    },
    pause: {
      name: "Pause button",
      where: "Outer face of the left ear pod. Small, grey, with one raised ridge.",
    },
    ledStrip: {
      name: "Night LED strip",
      where: "Along the back strap. Warm white light so others can see you.",
    },
    lightSensor: {
      name: "Light sensor",
      where: "On the back strap. Turns the night lights on when it gets dark.",
    },
  } satisfies Record<LabelId, { name: string; where: string }>,
  otherPartsTitle: "Also inside",
  otherParts: [
    "A thin flexible ribbon cable inside the band connects the front sensors to both ear pods.",
    "The band has a hard outer shell and a soft black silicone lining that touches the skin.",
    "Each ear pod is made of two shell halves that close around the electronics.",
  ],
  note: "Concept design – the final prototype may differ.",
} as const;

export const gallery = {
  /**
   * Off until the cropped renders exist in public/gallery/ (see README, "Gallery").
   * Use only the bottom-row (on mannequin) views from device-8-views.png.
   */
  enabled: false,
  id: "gallery",
  eyebrow: "Gallery",
  title: "On the head",
  intro: "Concept renders of the headband worn on a mannequin.",
  items: [
    {
      src: "/gallery/worn-front.png",
      alt: "Front view on a mannequin head: the dark teal band crosses the forehead with two round sensors above the eyebrows, and the ear hooks pass over the ears.",
    },
    {
      src: "/gallery/worn-side.png",
      alt: "Side view on a mannequin head: the ear hook curves over the ear, leaving it uncovered, and ends in a rounded pod behind the ear.",
    },
    {
      src: "/gallery/worn-back.png",
      alt: "Back view on a mannequin head: a black fabric strap with a buckle and a thin warm white light strip joins the two ear pods.",
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
        "Target price not set yet",
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
        "Planned: short voice messages in all three",
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
        "The cane checks the ground at your feet. Waymark is meant to warn you about obstacles higher up and to the sides. It does not replace orientation and mobility training, and it does not tell you when it is safe to cross a road.",
      ],
    },
    {
      q: "How does it tell me where the obstacle is?",
      a: [
        "Two sensors on the forehead look forward, one slightly left and one slightly right.",
        "If the obstacle is on your left, the left temple pad vibrates. If it is on your right, the right pad vibrates. If it is straight ahead, both vibrate. The closer it is, the faster the pulses.",
      ],
    },
    {
      q: "Can I pause it?",
      a: [
        "Yes. Press the small grey pause button on the left ear pod. You can find it by touch: it has one raised ridge.",
        "Vibrations stop, for example while you wait in a queue or talk to someone. Waymark turns back on by itself after a short time, or when you press the button again.",
      ],
    },
    {
      q: "What happens when I press SOS?",
      a: [
        "Press the large red button on the right ear pod. You can find it by touch: it has raised dots.",
        "Waymark plays a loud alarm sound and flashes its lights, so people nearby notice that you need help. In the current design it does not call or message anyone.",
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
