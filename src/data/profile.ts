export type SiteMeta = {
  title: string;
  description: string;
  siteName: string;
  socialImage: {
    path: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type NavLink = {
  href: string;
  label: string;
};

export type SectionIntro = {
  eyebrow: string;
  title: string;
  lede: string;
};

export type CtaLink = {
  href: string;
  label: string;
};

export type SocialLink = {
  label: string;
  value: string;
  href: string;
  detail: string;
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

export type ResearchEntry = {
  title: string;
  date: string;
  format: string;
  summary: string;
};

export const siteMeta: SiteMeta = {
  title: "Jeremy Dawson | Software, Research, and Public-Interest Systems",
  description:
    "Jeremy Dawson builds software and information tools for health-facing, public-interest, and research-heavy work.",
  siteName: "Jeremy Dawson",
  socialImage: {
    path: "/og/jeremy-dawson-social.png",
    alt: "Editorial social card for Jeremy Dawson with abstract teal and cobalt signal lines on a warm off-white background.",
    width: 1200,
    height: 630,
  },
};

export const navLinks: NavLink[] = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#research", label: "Research" },
  { href: "#contact", label: "Contact" },
];

export const hero = {
  eyebrow: "Software, research, and public-interest systems",
  headline: "I build software for health, research, and public systems.",
  intro:
    "I build tools for health information, service access, archival continuity, and research communication. My background combines software development, academic research, teaching, and publishing.",
  primaryCta: {
    href: "#projects",
    label: "View selected work",
  } satisfies CtaLink,
  secondaryCta: {
    href: "#contact",
    label: "Contact me",
  } satisfies CtaLink,
  highlights: [
    {
      label: "Current work",
      value: "Health and public-interest products",
    },
    {
      label: "Strengths",
      value: "Product thinking, data clarity, communication",
    },
    {
      label: "Background",
      value: "Software, research, teaching, publishing",
    },
  ],
};

export const about = {
  eyebrow: "About",
  title: "Software for domains that need precision.",
  lead:
    "I do my best work on problems where software, data, and explanation have to hold together.",
  body: [
    "Before moving into software full-time, I worked in philosophy, teaching, research support, and academic publishing. That background gave me a high tolerance for ambiguity, a low tolerance for sloppy reasoning, and a lasting interest in careful communication.",
    "The work I take on now usually sits in health, public-interest, and research-heavy settings. It tends to involve messy source material, real workflow constraints, and users who need clarity more than spectacle.",
  ],
  principles: [
    "Make assumptions and methodology visible.",
    "Design for real workflows, not idealized users.",
    "Keep claims precise and interfaces calm.",
  ],
};

export const experienceSection: SectionIntro = {
  eyebrow: "Experience",
  title: "Recent work and background.",
  lede:
    "Recent work centers on public-interest and health-facing products. Earlier roles in research, teaching, and publishing still shape how I design software and explain technical material.",
};

export const experience: TimelineEntry[] = [
  {
    title: "Founder and Developer",
    organization: "Wait Time Canada",
    dateRange: "2026 to present",
    location: "Kingston, ON",
    summary:
      "Building a live observatory for Canadian emergency department wait times, including province-level data pipelines, measurement tagging, and public explanations of why many cross-province comparisons are not methodologically equivalent.",
    tags: ["Health data", "Analytics", "Methodology"],
  },
  {
    title: "Founder and Developer",
    organization: "VisitBrief.com",
    dateRange: "2026 to present",
    location: "Kingston, ON",
    summary:
      "Building a visit-preparation tool that helps patients and caregivers turn complex histories into concise one-page briefs while staying outside diagnosis, triage, and treatment advice.",
    tags: ["Product design", "Health communication", "Safety boundaries"],
  },
  {
    title: "Founder and Developer",
    organization: "HelpBridge.ca and HealthArchive.ca",
    dateRange: "2025 to present",
    location: "Kingston, ON",
    summary:
      "Building public-interest platforms for verified service discovery and long-term preservation of health information, with emphasis on governance, accessibility, and continuity.",
    tags: ["Service access", "Archiving", "Accessibility"],
  },
  {
    title: "Software Developer",
    organization: "RestoredCDC.org",
    dateRange: "2025 to present",
    location: "Kingston, ON",
    summary:
      "Contributing web development, search, and infrastructure work that improves access to archived CDC public-health material.",
    tags: ["Web development", "Search", "Archival systems"],
  },
  {
    title: "Independent Software Developer",
    organization: "Financial investment application",
    dateRange: "2022 to 2025",
    location: "Waterloo, ON",
    summary:
      "Worked full-time as an independent developer building an end-to-end investment platform with real-time analytics, rules-based execution, backtesting, and risk controls.",
    tags: ["Full-stack development", "Analytics", "Risk systems"],
  },
  {
    title: "Teaching Assistant, Research Support, and Publishing Work",
    organization: "UBC, Toronto Metropolitan University, and Canadian Journal of Philosophy",
    dateRange: "2013 to 2019",
    location: "Toronto, ON and Vancouver, BC",
    summary:
      "Taught undergraduate courses, supported research and conference operations, and worked in academic publishing and writing support. That experience still shapes how I handle communication-heavy technical work.",
    tags: ["Teaching", "Research support", "Publishing"],
  },
];

export const projectsSection: SectionIntro = {
  eyebrow: "Selected Work",
  title: "Selected projects.",
  lede:
    "These projects best represent how I work: end-to-end ownership, careful boundaries, and systems that stay legible to the people who depend on them.",
};

export const featuredProjects: ProjectEntry[] = [
  {
    name: "Wait Time Canada",
    status: "In active development",
    oneLiner:
      "A live observatory that audits how Canadian emergency department wait times are measured and compared.",
    problem:
      "Provincial wait-time reporting is often treated as apples-to-apples when the underlying definitions and collection methods differ.",
    contribution:
      "I built the data pipelines, measurement taxonomy, explanatory content, and public interface so users can inspect the methodology instead of trusting a summary number.",
    stack: ["Astro", "Data pipelines", "Health analytics", "Methodology design"],
    metrics: "Current dataset covers 390-plus hospital records across 4 provinces.",
    links: [
      { label: "Live site", href: "https://wait-time.ca" },
      { label: "GitHub", href: "https://github.com/jerdaw/waittimecanada" },
    ],
  },
  {
    name: "VisitBrief.com",
    status: "Pilot-stage product build",
    oneLiner:
      "A visit-preparation tool that turns complex patient and caregiver information into concise clinician-ready briefs.",
    problem:
      "Short appointments reward organized signal, but patients and caregivers often arrive with fragmented timelines, medication details, and scattered notes.",
    contribution:
      "I designed the workflow, safety boundaries, and information structure for a product that improves communication without drifting into diagnosis, triage, or treatment advice.",
    stack: ["Workflow design", "Health communication", "Safety-first UX"],
    links: [
      { label: "Live site", href: "https://visitbrief.com" },
      { label: "GitHub", href: "https://github.com/jerdaw/visitbrief" },
    ],
  },
  {
    name: "HelpBridge.ca",
    status: "Pilot-stage public-interest platform",
    oneLiner:
      "A verified service-search platform for food, housing, crisis, health, legal, and related supports.",
    problem:
      "People looking for help routinely encounter stale directories, inconsistent intake information, and search tools that assume time and stability they may not have.",
    contribution:
      "I built the verification model, directory structure, and public-facing product around trust, clarity, accessibility, and local usefulness.",
    stack: ["Information architecture", "Accessibility", "Service discovery"],
    metrics: "Initial dataset covers 196 hand-verified Kingston services.",
    links: [
      { label: "Live site", href: "https://helpbridge.ca" },
      { label: "GitHub", href: "https://github.com/jerdaw/helpbridge" },
    ],
  },
  {
    name: "HealthArchive.ca",
    status: "Ongoing archival project",
    oneLiner:
      "A public-health archive focused on durable access to guidance, data, and historical snapshots.",
    problem:
      "Public-health information can disappear, move, or lose context just when continuity and citation matter most.",
    contribution:
      "I lead the preservation workflow, delivery model, and public framing for an archive designed for usable long-term access.",
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
      "Development and restoration work supporting continuity of access to archived CDC material.",
    problem:
      "Preserved public-health pages are only useful if they remain searchable, comparable, and easy to retrieve.",
    contribution:
      "I contribute development and infrastructure work for search, comparison, and resilient delivery across archived public-health content.",
    stack: ["Web development", "Infrastructure", "Search and comparison"],
    links: [
      { label: "Project site", href: "https://restoredcdc.org" },
      { label: "GitHub org", href: "https://github.com/RestoredCDC" },
    ],
  },
];

export const researchSection: SectionIntro = {
  eyebrow: "Research & Communication",
  title: "Research and teaching.",
  lede:
    "Alongside software projects, I work on publication, conference presentation, and applied teaching. That experience shows up directly in how I scope products, explain tradeoffs, and translate complex material for real users.",
};

export const researchCommunication: ResearchEntry[] = [
  {
    title: "Withholding CPR in Canada",
    date: "2026",
    format: "Accepted publication, Canadian Journal of General Internal Medicine",
    summary:
      "Co-authored a medico-legal review on withholding CPR in Canada, synthesizing case law and medical-college policies into a practical account of the standard of care.",
  },
  {
    title: "Withholding CPR conference presentation",
    date: "2025",
    format: "Canadian Conference on Physician Health",
    summary:
      "Prepared and delivered a conference presentation in Vancouver translating the same research into a medicine-facing oral presentation.",
  },
  {
    title: "Medical devices education session",
    date: "2025",
    format: "Presenter, St. John Ambulance training context",
    summary:
      "Researched and delivered a two-hour teaching session on 50-plus medical devices, focused on recognition and responder interaction.",
  },
];

export const contactSection: SectionIntro = {
  eyebrow: "Contact",
  title: "Get in touch.",
  lede:
    "Email is the best path for roles, collaboration, or research-adjacent work. GitHub and current project links are below.",
};

export const contactLinks: SocialLink[] = [
  {
    label: "Email",
    value: "jeremyjdawson@gmail.com",
    href: "mailto:jeremyjdawson@gmail.com",
    detail: "Best for roles, research, collaboration, and direct contact.",
  },
  {
    label: "GitHub",
    value: "github.com/jerdaw",
    href: "https://github.com/jerdaw",
    detail: "Code, project history, and build documentation.",
  },
  {
    label: "Wait Time Canada",
    value: "wait-time.ca",
    href: "https://wait-time.ca",
    detail: "Emergency department wait-time methodology and public health-data analysis.",
  },
  {
    label: "HelpBridge",
    value: "helpbridge.ca",
    href: "https://helpbridge.ca",
    detail: "Verified service-search work focused on access, trust, and local usefulness.",
  },
];

export const footerText = "Jeremy Dawson. Software, research, and public-interest systems.";
