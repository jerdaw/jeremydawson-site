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
const ghostGroup = document.getElementById("ghost-paths");
const branchGroup = document.getElementById("branch-paths");
const sectionNodesGroup = document.getElementById("section-nodes");
const splitPathsGroup = document.getElementById("split-paths");
const fanPathsGroup = document.getElementById("fan-paths");
const leadingDot = document.getElementById("leading-dot");
const terminusOrb = document.getElementById("terminus-orb");
const pathGradient = document.getElementById("path-gradient");

// Dynamic element state
let ghostPathEls = [];
let ghostLengths = [];
let branchPathEls = [];
let branchLengths = [];
let branchThresholds = [];
let sectionNodeEls = [];
let sectionNodeYs = [];
let splitPathEls = [];
let splitLengths = [];
let splitRange = { start: 0, end: 0 };
let fanPathEls = [];
let fanLengths = [];
let fanRange = { start: 0, end: 0 };
let terminusProgress = 1;

// Per-section gradient colors (blue -> cyan -> royal -> indigo -> purple -> lavender -> ice)
const gradientColors = [
  "#61a4fc",
  "#38BDF8",
  "#056CF2",
  "#6366F1",
  "#8B5CF6",
  "#A78BFA",
  "#67E8F9",
];

function buildBezierString(waypoints) {
  let d = `M ${waypoints[0][0]},${waypoints[0][1]}`;
  for (let i = 1; i < waypoints.length; i++) {
    const [px, py] = waypoints[i - 1];
    const [cx2, cy] = waypoints[i];
    const dy = cy - py;
    d += ` C ${px},${py + dy * 0.5} ${cx2},${cy - dy * 0.5} ${cx2},${cy}`;
  }
  return d;
}

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

  const sectionMids = [];
  const sectionBounds = [];

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = rect.height;
    const mid = top + height * 0.5;
    const bottom = top + height;

    const sideX = goLeft ? leftX : rightX;
    waypoints.push([sideX, mid]);
    waypoints.push([cx, bottom]);
    sectionMids.push({ x: sideX, y: mid, goLeft, bottom });
    sectionBounds.push({ top, mid, bottom, sideX, goLeft });
    goLeft = !goLeft;
  }

  // ── Main path ──────────────────────────────────────
  const d = buildBezierString(waypoints);
  trackPath.setAttribute("d", d);
  drawPath.setAttribute("d", d);

  const length = drawPath.getTotalLength();
  drawPath.style.strokeDasharray = String(length);
  drawPath.style.strokeDashoffset = String(length);

  // ── Per-section gradient ───────────────────────────
  if (pathGradient) {
    pathGradient.setAttribute("y2", String(docHeight));
    while (pathGradient.firstChild) pathGradient.removeChild(pathGradient.firstChild);

    const positions = [0];
    for (const sb of sectionBounds) {
      positions.push(sb.mid / docHeight);
    }
    positions.push(1);

    for (let i = 0; i < positions.length && i < gradientColors.length; i++) {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", String(positions[i]));
      stop.setAttribute("stop-color", gradientColors[i]);
      pathGradient.appendChild(stop);
    }
  }

  // ── Ghost paths (4 echoes using gradient) ──────────
  if (ghostGroup) {
    ghostGroup.innerHTML = "";
    ghostPathEls = [];
    ghostLengths = [];

    const offsets = [14, -14, 28, -28];
    const opacities = [0.12, 0.12, 0.05, 0.05];

    for (let g = 0; g < offsets.length; g++) {
      const ghostWaypoints = waypoints.map(([wx, wy]) => [wx + offsets[g], wy]);
      const ghostD = buildBezierString(ghostWaypoints);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", ghostD);
      path.setAttribute("class", "timeline-path__ghost");
      path.setAttribute("stroke", "url(#path-gradient)");
      path.setAttribute("stroke-opacity", String(opacities[g]));

      ghostGroup.appendChild(path);
      ghostPathEls.push(path);

      const gLen = path.getTotalLength();
      ghostLengths.push(gLen);
      path.style.strokeDasharray = String(gLen);
      path.style.strokeDashoffset = String(gLen);
    }
  }

  // ── Section transition nodes ───────────────────────
  if (sectionNodesGroup) {
    sectionNodesGroup.innerHTML = "";
    sectionNodeEls = [];
    sectionNodeYs = [];

    for (let i = 2; i < waypoints.length; i += 2) {
      const [nx, ny] = waypoints[i];

      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("cx", String(nx));
      ring.setAttribute("cy", String(ny));
      ring.setAttribute("r", "0");
      ring.setAttribute("class", "section-node__ring");
      ring.setAttribute("stroke", "url(#path-gradient)");

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", String(nx));
      dot.setAttribute("cy", String(ny));
      dot.setAttribute("r", "0");
      dot.setAttribute("class", "section-node__dot");
      dot.setAttribute("fill", "url(#path-gradient)");

      sectionNodesGroup.appendChild(ring);
      sectionNodesGroup.appendChild(dot);

      sectionNodeEls.push({ ring, dot });
      sectionNodeYs.push(ny / docHeight);
    }
  }

  // ── Split paths (About section — index 1) ─────────
  if (splitPathsGroup && sectionBounds.length > 1) {
    splitPathsGroup.innerHTML = "";
    splitPathEls = [];
    splitLengths = [];

    const prevBottom = sectionBounds[0].bottom;
    const aboutMidY = sectionBounds[1].mid;
    const aboutBottom = sectionBounds[1].bottom;
    const aboutSideX = sectionBounds[1].sideX;

    splitRange = {
      start: prevBottom / docHeight,
      end: aboutBottom / docHeight,
    };

    const offsets = [-35, 35];
    const colors = ["rgba(56, 189, 248, 0.4)", "rgba(129, 140, 248, 0.4)"];

    for (let s = 0; s < offsets.length; s++) {
      const off = offsets[s];
      const splitWaypoints = [
        [cx, prevBottom],
        [aboutSideX + off, aboutMidY],
        [cx, aboutBottom],
      ];
      const splitD = buildBezierString(splitWaypoints);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", splitD);
      path.setAttribute("class", "timeline-path__split");
      path.style.stroke = colors[s];

      splitPathsGroup.appendChild(path);
      splitPathEls.push(path);

      const sLen = path.getTotalLength();
      splitLengths.push(sLen);
      path.style.strokeDasharray = String(sLen);
      path.style.strokeDashoffset = String(sLen);
    }
  }

  // ── Fan-out paths (Projects section — index 3) ────
  if (fanPathsGroup && sectionBounds.length > 3) {
    fanPathsGroup.innerHTML = "";
    fanPathEls = [];
    fanLengths = [];

    const projStart = sectionBounds[2].bottom;
    const projEnd = sectionBounds[3].bottom;
    const spread = colW * 0.3;

    fanRange = {
      start: projStart / docHeight,
      end: projEnd / docHeight,
    };

    const fanCount = 5;
    const fanColors = [
      "rgba(99, 102, 241, 0.3)",
      "rgba(139, 92, 246, 0.3)",
      "rgba(168, 85, 247, 0.35)",
      "rgba(139, 92, 246, 0.3)",
      "rgba(99, 102, 241, 0.3)",
    ];

    for (let f = 0; f < fanCount; f++) {
      const t = (f / (fanCount - 1)) * 2 - 1; // -1 to 1
      const endX = cx + t * spread;
      const midX = cx + t * spread * 0.4;
      const endY = projStart + (projEnd - projStart) * 0.75;
      const midY = projStart + (projEnd - projStart) * 0.35;

      const fanD = `M ${cx},${projStart} C ${midX},${midY} ${endX},${midY + 60} ${endX},${endY}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", fanD);
      path.setAttribute("class", "timeline-path__fan");
      path.style.stroke = fanColors[f];

      fanPathsGroup.appendChild(path);
      fanPathEls.push(path);

      const fLen = path.getTotalLength();
      fanLengths.push(fLen);
      path.style.strokeDasharray = String(fLen);
      path.style.strokeDashoffset = String(fLen);
    }
  }

  // ── Terminus orb ───────────────────────────────────
  if (terminusOrb && waypoints.length > 0) {
    const last = waypoints[waypoints.length - 1];
    terminusOrb.setAttribute("cx", String(last[0]));
    terminusOrb.setAttribute("cy", String(last[1]));
    terminusProgress = last[1] / docHeight;
  }

  // ── Branch filaments at each timeline entry ────────
  if (branchGroup) {
    branchGroup.innerHTML = "";
    branchPathEls = [];
    branchLengths = [];
    branchThresholds = [];

    const entries = document.querySelectorAll("[data-entry-index]");

    entries.forEach((entry, i) => {
      const rect = entry.getBoundingClientRect();
      const entryY = rect.top + window.scrollY + rect.height * 0.3;
      const mid = sectionMids[Math.min(i, sectionMids.length - 1)];
      if (!mid) return;

      const branchDir = mid.goLeft ? 1 : -1;
      const startX = mid.x;
      const endX = startX + branchDir * 50;
      const ctrlX = startX + branchDir * 30;

      const bD = `M ${startX},${entryY} C ${ctrlX},${entryY - 15} ${endX},${entryY - 8} ${endX},${entryY + 5}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", bD);
      path.setAttribute("class", "timeline-path__branch");

      branchGroup.appendChild(path);
      branchPathEls.push(path);

      const bLen = path.getTotalLength();
      branchLengths.push(bLen);
      path.style.strokeDasharray = String(bLen);
      path.style.strokeDashoffset = String(bLen);

      branchThresholds.push(entryY / docHeight);
    });
  }

  return length;
}

let pathLength = 0;

function animateTimelinePath() {
  if (pathLength === 0 || reduceMotion) return;
  if (!(drawPath instanceof SVGPathElement)) return;

  const docH = document.documentElement.scrollHeight;
  const winH = window.innerHeight;
  const progress = window.scrollY / Math.max(docH - winH, 1);

  // ── Main draw path ──
  drawPath.style.strokeDashoffset = String(pathLength * (1 - progress));

  // Stroke width: 2.5 -> 12 with cubic ease-out
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const strokeW = 2.5 + easedProgress * 9.5;
  drawPath.style.strokeWidth = String(strokeW);

  // ── Ghost paths (trail behind main, scale with width) ──
  const ghostDelays = [0.02, 0.04, 0.06, 0.08];
  for (let g = 0; g < ghostPathEls.length; g++) {
    const ghostProgress = Math.max(0, progress - ghostDelays[g]);
    ghostPathEls[g].style.strokeDashoffset = String(
      ghostLengths[g] * (1 - ghostProgress),
    );
    ghostPathEls[g].style.strokeWidth = String(1.5 + easedProgress * 2.5);
  }

  // ── Leading-edge dot ──
  if (leadingDot && progress > 0.005 && progress < 0.995) {
    const point = drawPath.getPointAtLength(pathLength * progress);
    leadingDot.setAttribute("cx", String(point.x));
    leadingDot.setAttribute("cy", String(point.y));
    leadingDot.setAttribute("opacity", "1");
    leadingDot.setAttribute("r", String(4 + easedProgress * 5));
  } else if (leadingDot) {
    leadingDot.setAttribute("opacity", "0");
  }

  // ── Section transition nodes ──
  for (let n = 0; n < sectionNodeEls.length; n++) {
    const { ring, dot } = sectionNodeEls[n];
    const threshold = sectionNodeYs[n];

    if (progress >= threshold - 0.02) {
      const p = Math.min(1, (progress - threshold + 0.02) / 0.04);
      const e = 1 - Math.pow(1 - p, 3);

      ring.setAttribute("r", String(8 + e * 14));
      ring.setAttribute("opacity", String(0.25 * e));
      dot.setAttribute("r", String(e * 5));
      dot.setAttribute("opacity", String(e * 0.9));
    } else {
      ring.setAttribute("opacity", "0");
      dot.setAttribute("opacity", "0");
    }
  }

  // ── Split paths (About section) ──
  if (splitRange.end > splitRange.start) {
    for (let s = 0; s < splitPathEls.length; s++) {
      if (progress >= splitRange.start && progress <= splitRange.end + 0.05) {
        const sp = (progress - splitRange.start) / (splitRange.end - splitRange.start);
        const clamped = Math.min(1, sp);
        const eased = 1 - Math.pow(1 - clamped, 2);
        splitPathEls[s].style.strokeDashoffset = String(
          splitLengths[s] * (1 - eased),
        );
        const fadeIn = Math.min(1, sp * 4);
        const fadeOut = sp > 0.8 ? Math.max(0, 1 - (sp - 0.8) / 0.25) : 1;
        splitPathEls[s].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        splitPathEls[s].style.strokeDashoffset = String(splitLengths[s]);
        splitPathEls[s].style.opacity = "0";
      }
    }
  }

  // ── Fan-out paths (Projects section) ──
  if (fanRange.end > fanRange.start) {
    for (let f = 0; f < fanPathEls.length; f++) {
      if (progress >= fanRange.start) {
        const fp = (progress - fanRange.start) / (fanRange.end - fanRange.start);
        const stagger = f * 0.04;
        const adjusted = Math.max(0, Math.min(1, (fp - stagger) / (0.7 - stagger)));
        const eased = 1 - Math.pow(1 - adjusted, 2);
        fanPathEls[f].style.strokeDashoffset = String(
          fanLengths[f] * (1 - eased),
        );
        const fadeIn = Math.min(1, Math.max(0, fp - stagger) * 5);
        const fadeOut = fp > 0.85 ? 1 - (fp - 0.85) / 0.15 : 1;
        fanPathEls[f].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        fanPathEls[f].style.strokeDashoffset = String(fanLengths[f]);
        fanPathEls[f].style.opacity = "0";
      }
    }
  }

  // ── Terminus orb ──
  if (terminusOrb) {
    if (progress > terminusProgress - 0.08) {
      const tp = Math.min(1, (progress - terminusProgress + 0.08) / 0.1);
      const e = 1 - Math.pow(1 - tp, 3);
      terminusOrb.setAttribute("r", String(e * 22));
      terminusOrb.setAttribute("opacity", String(e * 0.7));
    } else {
      terminusOrb.setAttribute("r", "0");
      terminusOrb.setAttribute("opacity", "0");
    }
  }

  // ── Branch filaments ──
  for (let b = 0; b < branchPathEls.length; b++) {
    const threshold = branchThresholds[b];
    if (progress >= threshold) {
      const branchProgress = Math.min(1, (progress - threshold) / 0.05);
      const eased = 1 - Math.pow(1 - branchProgress, 2);
      branchPathEls[b].style.strokeDashoffset = String(
        branchLengths[b] * (1 - eased),
      );
    }
  }
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

// Reduced-motion fallback: show everything static
if (reduceMotion) {
  pathLength = buildTimelinePath();
  if (drawPath instanceof SVGPathElement && pathLength > 0) {
    drawPath.style.strokeDashoffset = "0";
    drawPath.style.strokeWidth = "12";
  }
  if (leadingDot) leadingDot.setAttribute("opacity", "0");
  for (const gp of ghostPathEls) gp.style.strokeDashoffset = "0";
  for (const bp of branchPathEls) bp.style.strokeDashoffset = "0";
  for (const sp of splitPathEls) {
    sp.style.strokeDashoffset = "0";
    sp.style.opacity = "1";
  }
  for (const fp of fanPathEls) {
    fp.style.strokeDashoffset = "0";
    fp.style.opacity = "1";
  }
  for (const { ring, dot } of sectionNodeEls) {
    ring.setAttribute("r", "20");
    ring.setAttribute("opacity", "0.25");
    dot.setAttribute("r", "5");
    dot.setAttribute("opacity", "0.9");
  }
  if (terminusOrb) {
    terminusOrb.setAttribute("r", "22");
    terminusOrb.setAttribute("opacity", "0.7");
  }
} else {
  pathLength = buildTimelinePath();
  onScroll();
  if (leadingDot) {
    leadingDot.style.animation = "dot-pulse 2s ease-in-out infinite";
  }
}

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
