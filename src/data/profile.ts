export type NavLink = {
  href: string;
  label: string;
};

export type SocialLink = {
  label: string;
  value: string;
  href: string;
  detail: string;
  isPlaceholder?: boolean;
};

export type TimelineEntry = {
  title: string;
  organization: string;
  dateRange: string;
  location: string;
  summary: string;
  tags: string[];
  link?: string;
};

export type ProjectEntry = {
  name: string;
  status: string;
  oneLiner: string;
  problem: string;
  contribution: string;
  stack: string[];
  metrics?: string;
  links: Array<{
    label: string;
    href: string;
    isPlaceholder?: boolean;
  }>;
};

export type SpeakingEntry = {
  title: string;
  date: string;
  format: string;
  summary: string;
};

export const siteMeta = {
  title: "Jeremy Dawson | Interdisciplinary Builder",
  description:
    "Professional portfolio for Jeremy Dawson, focused on software, public-interest systems, research communication, and health-facing tools.",
};

export const navLinks: NavLink[] = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#speaking", label: "Writing & Speaking" },
  { href: "#contact", label: "Contact" },
];

export const hero = {
  eyebrow: "Software, public-interest systems, and health-facing tools",
  headline: "I build software for public-facing complexity.",
  intro:
    "My work sits where software, public communication, and messy real-world systems overlap. I build products and data tools that make methodology, service access, and difficult workflows more legible instead of hiding the complexity behind polished surfaces.",
  primaryCta: {
    href: "#projects",
    label: "View selected work",
  },
  secondaryCta: {
    href: "#contact",
    label: "Get in touch",
  },
  highlights: [
    {
      label: "Current direction",
      value: "Public-interest technology",
    },
    {
      label: "Core strength",
      value: "Systems thinking and communication",
    },
    {
      label: "Background",
      value: "Software, philosophy, teaching",
    },
  ],
};

export const about = {
  lead:
    "I do my best work where technical systems carry public consequences: health information, service access, decision support, and communication under real constraints.",
  body: [
    "Before moving into software full-time, I worked in philosophy, teaching, research support, and academic publishing. That background still shapes how I build: I care about clarity, traceability, edge cases, and explaining difficult material without sanding off what matters.",
    "The result is a practice that combines product thinking, workflow design, and disciplined communication. I am especially drawn to projects that need both technical rigor and public trust.",
  ],
  principles: [
    "Build for legibility, not just feature count.",
    "Treat data quality and methodology as product concerns.",
    "Keep interfaces calm even when the underlying system is complex.",
  ],
};

export const experience: TimelineEntry[] = [
  {
    title: "Founder and Developer",
    organization: "Wait Time Canada",
    dateRange: "2026 to present",
    location: "Kingston, ON",
    summary:
      "Building a health-systems observatory that audits Canadian emergency department wait-time data and exposes why naive cross-province comparisons are often methodologically invalid.",
    tags: ["Health data", "Analytics", "Public methodology"],
  },
  {
    title: "Founder and Developer",
    organization: "VisitBrief.com",
    dateRange: "2026 to present",
    location: "Kingston, ON",
    summary:
      "Developing a clinician-ready visit preparation tool that turns patient and caregiver information into concise one-page briefs with explicit safety boundaries.",
    tags: ["Product design", "Health communication", "Safety constraints"],
  },
  {
    title: "Founder and Developer",
    organization: "HelpBridge.ca and HealthArchive.ca",
    dateRange: "2025 to present",
    location: "Kingston, ON",
    summary:
      "Leading public-interest platforms focused on verified service access, support navigation, and preservation of public-health information.",
    tags: ["Service access", "Accessibility", "Public-interest tech"],
  },
  {
    title: "Software Developer",
    organization: "RestoredCDC.org",
    dateRange: "2025 to present",
    location: "Kingston, ON",
    summary:
      "Supporting web development, infrastructure, and archival continuity work for preserved CDC public-health information.",
    tags: ["Web development", "Archival systems", "Search"],
  },
  {
    title: "Independent Software Developer",
    organization: "Financial investment application",
    dateRange: "2022 to 2025",
    location: "Waterloo, ON",
    summary:
      "Built an end-to-end investment platform with real-time analytics, execution logic, backtesting, and risk-control features.",
    tags: ["Full-stack product", "Analytics", "Backtesting"],
  },
  {
    title: "Graduate Teaching Assistant and Research Support",
    organization: "University of British Columbia and Toronto Metropolitan University",
    dateRange: "2014 to 2019",
    location: "Toronto, ON and Vancouver, BC",
    summary:
      "Taught tutorials, evaluated student work, and supported research and conference operations across philosophy, ethics, and academic communication.",
    tags: ["Teaching", "Research support", "Communication"],
  },
];

export const featuredProjects: ProjectEntry[] = [
  {
    name: "Wait Time Canada",
    status: "In active development",
    oneLiner:
      "A health-systems observatory for Canadian emergency department wait-time methodology and data quality.",
    problem:
      "Public wait-time comparisons are often presented as if they were directly comparable when they are not measured the same way.",
    contribution:
      "I am building the data model, measurement taxonomy, explanatory layer, and public-facing interface so reporting assumptions stay visible instead of disappearing behind a leaderboard.",
    stack: ["Astro", "Data pipelines", "Analytics design", "Content systems"],
    metrics: "Current scope includes 4 provinces and 390-plus hospital records.",
    links: [
      { label: "Live site", href: "https://wait-time.ca" },
      { label: "GitHub", href: "https://github.com/jerdaw/waittimecanada" },
    ],
  },
  {
    name: "VisitBrief.com",
    status: "Pilot-stage concept and product build",
    oneLiner:
      "A Canada-first visit-preparation tool for producing concise, clinician-ready briefs.",
    problem:
      "Patients and caregivers often arrive at appointments with fragmented information, making already short clinical encounters harder to use well.",
    contribution:
      "I am defining the workflow, information structure, compiler guardrails, and product language for a tool that improves signal without drifting into diagnosis, triage, or treatment advice.",
    stack: ["Workflow design", "Prompted content systems", "Privacy-minded UX"],
    metrics: "Positioned explicitly as a communication aid, not a clinical decision tool.",
    links: [
      { label: "Live site", href: "https://visitbrief.com" },
      { label: "GitHub", href: "https://github.com/jerdaw/visitbrief" },
    ],
  },
  {
    name: "HelpBridge.ca",
    status: "Pilot-stage public-interest platform",
    oneLiner:
      "A verified, governance-first support search platform for food, housing, crisis, health, legal, and related services.",
    problem:
      "People trying to find services often face scattered directories, stale listings, and a search experience that assumes time, literacy, and stability they may not have.",
    contribution:
      "I am shaping the information model, manual verification workflow, multilingual accessibility direction, and product structure for a service directory designed around trust.",
    stack: ["Information architecture", "Accessibility", "Service discovery"],
    metrics: "Current dataset covers 196 hand-verified Kingston services.",
    links: [
      { label: "Live site", href: "https://helpbridge.ca" },
      { label: "GitHub", href: "https://github.com/jerdaw/helpbridge" },
    ],
  },
  {
    name: "HealthArchive.ca",
    status: "Ongoing archival project",
    oneLiner:
      "A Canadian public-health archive focused on preserving health data and guidance.",
    problem:
      "Important public-health information can disappear, move, or lose context right when continuity matters most.",
    contribution:
      "I am leading the archival product direction, preservation workflow, and public framing for durable access to health information and archived snapshots.",
    stack: ["Archival systems", "Content strategy", "Static delivery"],
    links: [
      { label: "Live site", href: "https://healtharchive.ca" },
      { label: "Backend repo", href: "https://github.com/jerdaw/healtharchive-backend" },
    ],
  },
  {
    name: "RestoredCDC.org",
    status: "Contributor",
    oneLiner:
      "Development and restoration work supporting continuity of access to CDC material.",
    problem:
      "Archived public-health material needs more than storage; it needs usable search, comparison, and resilient delivery.",
    contribution:
      "I contribute development and infrastructure work that improves continuity, retrieval, and usability for preserved pages.",
    stack: ["Web development", "Infrastructure", "Search and comparison"],
    links: [
      { label: "Project site", href: "https://restoredcdc.org" },
      { label: "GitHub org", href: "https://github.com/RestoredCDC" },
    ],
  },
];

export const speaking: SpeakingEntry[] = [
  {
    title: "Medical Devices Education Session",
    date: "2025",
    format: "Presenter",
    summary:
      "Researched, built, and delivered a two-hour educational session covering a broad survey of medical devices for first responders.",
  },
  {
    title: "Withholding CPR research presentation",
    date: "2025",
    format: "Conference presentation",
    summary:
      "Prepared an oral presentation translating a legal and policy research project into a practical account of the standard of care in medicine.",
  },
];

export const contactLinks: SocialLink[] = [
  {
    label: "Email",
    value: "jeremyjdawson@gmail.com",
    href: "mailto:jeremyjdawson@gmail.com",
    detail: "Best for direct contact about projects, collaboration, or roles.",
  },
  {
    label: "GitHub",
    value: "github.com/jerdaw",
    href: "https://github.com/jerdaw",
    detail: "Code, project repos, and documentation-heavy build work.",
  },
  {
    label: "HelpBridge",
    value: "helpbridge.ca",
    href: "https://helpbridge.ca",
    detail: "Live public-interest service directory work based in Kingston.",
  },
  {
    label: "VisitBrief",
    value: "visitbrief.com",
    href: "https://visitbrief.com",
    detail: "Live visit-preparation product focused on clarity and safety boundaries.",
  },
];
