const root = document.documentElement;
const sections = Array.from(document.querySelectorAll("[data-section]"));
const revealables = Array.from(document.querySelectorAll("[data-reveal]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const emailAddress = ["jeremyjdawson", "gmail.com"].join("@");

root.dataset.enhanced = "true";

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      }
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  for (const item of revealables) {
    revealObserver.observe(item);
  }
} else {
  for (const item of revealables) {
    item.classList.add("is-visible");
  }
}

const setActiveSection = () => {
  const viewportMidpoint = window.innerHeight * 0.35;
  let activeSection = sections[0]?.getAttribute("data-section") ?? "top";

  for (const section of sections) {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= viewportMidpoint && bounds.bottom >= viewportMidpoint) {
      activeSection = section.getAttribute("data-section") ?? activeSection;
    }
  }

  root.dataset.activeSection = activeSection;
};

// ── Timeline path ─────────────────────────────────────

const svg = document.getElementById("timeline-path-svg");
const trackPath = document.getElementById("timeline-track");
const drawPath = document.getElementById("timeline-draw");

function buildTimelinePath() {
  if (
    !(svg instanceof SVGSVGElement) ||
    !(trackPath instanceof SVGPathElement) ||
    !(drawPath instanceof SVGPathElement)
  ) {
    return 0;
  }

  const docHeight = document.documentElement.scrollHeight;
  svg.style.height = docHeight + "px";

  const W = window.innerWidth;
  const maxW = 1100;
  const padding = 32;
  const colW = Math.min(W - padding, maxW);
  const leftMargin = (W - colW) / 2;

  const cx = leftMargin + colW * 0.5;
  const leftX = leftMargin + colW * 0.18;
  const rightX = leftMargin + colW * 0.82;

  const waypoints = [[cx, 0]];
  let goLeft = true;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = rect.height;
    const mid = top + height * 0.5;
    const bottom = top + height;

    waypoints.push([goLeft ? leftX : rightX, mid]);
    waypoints.push([cx, bottom]);
    goLeft = !goLeft;
  }

  let d = `M ${waypoints[0][0]},${waypoints[0][1]}`;

  for (let i = 1; i < waypoints.length; i++) {
    const [px, py] = waypoints[i - 1];
    const [cx2, cy] = waypoints[i];
    const dy = cy - py;
    d += ` C ${px},${py + dy * 0.5} ${cx2},${cy - dy * 0.5} ${cx2},${cy}`;
  }

  trackPath.setAttribute("d", d);
  drawPath.setAttribute("d", d);

  const length = drawPath.getTotalLength();
  drawPath.style.strokeDasharray = String(length);
  drawPath.style.strokeDashoffset = String(length);

  return length;
}

let pathLength = 0;

function animateTimelinePath() {
  if (pathLength === 0 || reduceMotion) return;
  if (!(drawPath instanceof SVGPathElement)) return;

  const docH = document.documentElement.scrollHeight;
  const winH = window.innerHeight;
  const progress = window.scrollY / Math.max(docH - winH, 1);
  drawPath.style.strokeDashoffset = String(pathLength * (1 - progress));
}

let resizeTimer = -1;

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    pathLength = buildTimelinePath();
    animateTimelinePath();
    setActiveSection();
  }, 150);
}

const onScroll = () => {
  setActiveSection();
  animateTimelinePath();
};

pathLength = buildTimelinePath();
onScroll();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize);

// Re-run after fonts load in case reflow shifts section positions
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    pathLength = buildTimelinePath();
    animateTimelinePath();
  });
}

// ── Email reveal ──────────────────────────────────────

const emailCard = document.querySelector("[data-email-card]");

if (emailCard instanceof HTMLElement) {
  const emailValue = emailCard.querySelector("[data-email-value]");
  const emailDetail = emailCard.querySelector("[data-email-detail]");
  const revealButton = emailCard.querySelector("[data-email-reveal]");
  const emailLink = emailCard.querySelector("[data-email-link]");
  const copyButton = emailCard.querySelector("[data-email-copy]");

  const revealEmail = () => {
    if (!(emailValue instanceof HTMLElement)) return;

    emailValue.textContent = emailAddress;

    if (emailLink instanceof HTMLAnchorElement) {
      emailLink.href = `mailto:${emailAddress}`;
      emailLink.hidden = false;
    }

    if (copyButton instanceof HTMLButtonElement) {
      copyButton.hidden = false;
    }

    if (revealButton instanceof HTMLButtonElement) {
      revealButton.hidden = true;
    }
  };

  if (revealButton instanceof HTMLButtonElement) {
    revealButton.addEventListener("click", revealEmail);
  }

  if (copyButton instanceof HTMLButtonElement) {
    copyButton.addEventListener("click", async () => {
      revealEmail();

      if (!(emailDetail instanceof HTMLElement)) return;

      try {
        await navigator.clipboard.writeText(emailAddress);
        emailDetail.textContent = "Email copied to clipboard.";
      } catch {
        emailDetail.textContent = "Copy failed. Use the mail link or select the address.";
      }
    });
  }
}
