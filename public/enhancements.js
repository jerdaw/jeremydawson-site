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
const portalGroup = document.getElementById("portal-group");
const fanPathsGroup = document.getElementById("fan-paths");
const prismGroup = document.getElementById("prism-group");
const prismPathsGroup = document.getElementById("prism-paths");
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
let portalEl = null;
let portalInnerEl = null;
let portalProgress = 0;
let fanPathEls = [];
let fanLengths = [];
let fanRange = { start: 0, end: 0 };
let prismBodyEl = null;
let prismBeamEl = null;
let prismGlowEl = null;
let prismEdgeEls = [];
let prismHighlightEl = null;
let prismRayEls = [];
let prismRayLengths = [];
let prismRange = { start: 0, end: 0, faceY: 0 };
let terminusProgress = 1;

// Spectral colors for rainbow/prism effects (red→violet dispersion order)
const SPECTRAL_COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E", "#22D3EE", "#A855F7",
];

// Portal rainbow uses a different ordering for visual balance
const PORTAL_COLORS = [
  "#22D3EE", "#A855F7", "#EF4444", "#F97316", "#EAB308", "#22C55E",
];

function svgEl(tag, attrs, parent) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (parent) parent.appendChild(el);
  return el;
}

function initDashPath(path, lengthsArray) {
  const len = path.getTotalLength();
  lengthsArray.push(len);
  path.style.strokeDasharray = String(len);
  path.style.strokeDashoffset = String(len);
  return len;
}

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

  // Clean up prism mask from previous build
  drawPath.removeAttribute("mask");
  const oldMask = document.getElementById("prism-mask");
  if (oldMask) oldMask.remove();
  const oldMaskGrad = document.getElementById("prism-mask-gradient");
  if (oldMaskGrad) oldMaskGrad.remove();

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
      svgEl("stop", { offset: positions[i], "stop-color": gradientColors[i] }, pathGradient);
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
      const path = svgEl("path", {
        d: buildBezierString(ghostWaypoints),
        class: "timeline-path__ghost",
        stroke: "url(#path-gradient)",
        "stroke-opacity": opacities[g],
      }, ghostGroup);
      ghostPathEls.push(path);
      initDashPath(path, ghostLengths);
    }
  }

  // ── Section transition nodes ───────────────────────
  if (sectionNodesGroup) {
    sectionNodesGroup.innerHTML = "";
    sectionNodeEls = [];
    sectionNodeYs = [];

    for (let i = 2; i < waypoints.length; i += 2) {
      const [nx, ny] = waypoints[i];
      const ring = svgEl("circle", { cx: nx, cy: ny, r: 0, class: "section-node__ring", stroke: "url(#path-gradient)" }, sectionNodesGroup);
      const dot = svgEl("circle", { cx: nx, cy: ny, r: 0, class: "section-node__dot", fill: "url(#path-gradient)" }, sectionNodesGroup);

      sectionNodeEls.push({ ring, dot });
      sectionNodeYs.push(ny / docHeight);
    }
  }

  // ── Portal + Rainbow split (About section — index 1) ─────────
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

    const LINE_SPACING = 10;
    for (let s = 0; s < PORTAL_COLORS.length; s++) {
      const off = (s - (PORTAL_COLORS.length - 1) / 2) * LINE_SPACING;
      const splitD = buildBezierString([
        [cx, prevBottom],
        [aboutSideX + off, aboutMidY],
        [cx, aboutBottom],
      ]);
      const path = svgEl("path", { d: splitD, class: "timeline-path__rainbow" }, splitPathsGroup);
      path.style.stroke = PORTAL_COLORS[s];
      splitPathEls.push(path);
      initDashPath(path, splitLengths);
    }

    portalProgress = prevBottom / docHeight;
    if (portalGroup) {
      portalGroup.innerHTML = "";
      portalEl = svgEl("ellipse", { cx, cy: prevBottom, rx: 35, ry: 18, class: "portal__ring", filter: "url(#portal-glow)" }, portalGroup);
      portalInnerEl = svgEl("ellipse", { cx, cy: prevBottom, rx: 25, ry: 12, class: "portal__inner", filter: "url(#portal-glow)" }, portalGroup);
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
      "rgba(99, 102, 241, 0.55)",
      "rgba(139, 92, 246, 0.55)",
      "rgba(168, 85, 247, 0.6)",
      "rgba(139, 92, 246, 0.55)",
      "rgba(99, 102, 241, 0.55)",
    ];

    // Stop at the prism's upper face, not its center
    const prismFaceOffset = sectionBounds.length > 4 ? 55 * 2 / 3 : 0;

    for (let f = 0; f < fanCount; f++) {
      const t = (f / (fanCount - 1)) * 2 - 1; // -1 to 1
      const peakX = cx + t * spread;
      const midX = cx + t * spread * 0.4;
      const peakY = projStart + (projEnd - projStart) * 0.55;
      const midY = projStart + (projEnd - projStart) * 0.3;
      const endY = projEnd - prismFaceOffset;

      const fanD = `M ${cx},${projStart} C ${midX},${midY} ${peakX},${midY + 60} ${peakX},${peakY} C ${peakX},${peakY + (endY - peakY) * 0.5} ${cx},${endY - (endY - peakY) * 0.2} ${cx},${endY}`;
      const path = svgEl("path", { d: fanD, class: "timeline-path__fan" }, fanPathsGroup);
      path.style.stroke = fanColors[f];
      fanPathEls.push(path);
      initDashPath(path, fanLengths);
    }
  }

  // ── Prism refraction (Research section — index 4) ──
  //
  // Physics model (simplified DSOTM):
  //   - The main line comes down vertically. We treat it as "white light".
  //   - It enters the top-left face of the prism.
  //   - Inside, refraction disperses the wavelengths.
  //   - Rays exit through the bottom-left face, with red bending least
  //     (closest to straight-through) and violet bending most.
  //   - Color order from least to most refraction:
  //     Red → Orange → Yellow → Green → Cyan → Violet
  //
  if (prismGroup && prismPathsGroup && sectionBounds.length > 4) {
    prismGroup.innerHTML = "";
    prismPathsGroup.innerHTML = "";
    prismRayEls = [];
    prismRayLengths = [];
    prismEdgeEls = [];

    const prismCy = sectionBounds[3].bottom;
    const prismSize = 55;
    const triHalfBase = (prismSize * 2) / Math.sqrt(3);

    // Apex on left, right face vertical. The beam enters the upper-left
    // face and exits the lower-left face — just like DSOTM album art.
    const apexLeft = [cx - triHalfBase, prismCy];
    const topRight = [cx + triHalfBase * 0.5, prismCy - prismSize];
    const bottomRight = [cx + triHalfBase * 0.5, prismCy + prismSize];

    const triPoints = `${apexLeft[0]},${apexLeft[1]} ${topRight[0]},${topRight[1]} ${bottomRight[0]},${bottomRight[1]}`;

    // Glow layer behind body (pulses when beam hits)
    prismGlowEl = svgEl("polygon", { points: triPoints, class: "prism__glow", filter: "url(#prism-glow)" }, prismGroup);
    prismBodyEl = svgEl("polygon", { points: triPoints, class: "prism__body" }, prismGroup);

    // Bright edges
    prismEdgeEls = [[apexLeft, topRight], [apexLeft, bottomRight], [topRight, bottomRight]].map(
      ([p1, p2]) => svgEl("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "prism__edge" }, prismGroup)
    );

    // Internal highlight (suggests refraction path)
    prismHighlightEl = svgEl("line", {
      x1: cx, y1: prismCy - prismSize * 0.35,
      x2: cx - triHalfBase * 0.35, y2: prismCy + prismSize * 0.35,
      class: "prism__highlight",
    }, prismGroup);

    // Entry point: where x=cx meets the upper-left face (apexLeft→topRight)
    const entryFrac = (cx - apexLeft[0]) / (topRight[0] - apexLeft[0]);
    const entryY = apexLeft[1] + (topRight[1] - apexLeft[1]) * entryFrac;
    const entryPoint = [cx, entryY];

    prismBeamEl = null;

    const researchMidY = sectionBounds[4].mid;
    const researchBottom = sectionBounds[4].bottom;
    const researchSideX = sectionBounds[4].sideX;

    prismRange = {
      start: prismCy / docHeight,
      end: researchBottom / docHeight,
      faceY: entryY,
    };

    // Red exits near apex (least deviation), violet near bottomRight (most)
    const spreadRange = Math.abs(cx - researchSideX);
    const convergeY = researchBottom;

    for (let r = 0; r < SPECTRAL_COLORS.length; r++) {
      const t = r / (SPECTRAL_COLORS.length - 1); // 0=red (least bent), 1=violet (most)

      const exitFrac = 0.3 + t * 0.5;
      const exitX = apexLeft[0] + (bottomRight[0] - apexLeft[0]) * exitFrac;
      const exitY = apexLeft[1] + (bottomRight[1] - apexLeft[1]) * exitFrac;

      const midX = cx - t * spreadRange * 0.6;
      const midY = researchMidY;
      const totalHeight = convergeY - prismCy;

      const rayD = `M ${entryPoint[0]},${entryPoint[1]} C ${exitX},${exitY} ${exitX + (midX - exitX) * 0.5},${exitY + totalHeight * 0.15} ${midX},${midY} C ${midX},${midY + totalHeight * 0.15} ${cx},${convergeY - totalHeight * 0.15} ${cx},${convergeY}`;

      const path = svgEl("path", { d: rayD, class: "timeline-path__prism-ray" }, prismPathsGroup);
      path.style.stroke = SPECTRAL_COLORS[r];
      prismRayEls.push(path);
      initDashPath(path, prismRayLengths);
    }

    // SVG mask: hide main draw path through prism section.
    // Fade starts well above the prism so the gradient-colored line
    // disappears before the white beam takes over — no purple leaking.
    // Bottom: main line reappears where spectral rays converge.
    const maskRevealY = convergeY;

    const defs = svg.querySelector("defs");

    const maskGrad = svgEl("linearGradient", {
      id: "prism-mask-gradient",
      gradientUnits: "userSpaceOnUse",
      x1: 0, y1: 0, x2: 0, y2: docHeight,
    }, defs);

    const maskStops = [
      [0, "white"],
      [(prismCy - prismSize * 4.5) / docHeight, "white"],
      [(prismCy - prismSize * 2) / docHeight, "black"],
      [(maskRevealY - 60) / docHeight, "black"],
      [(maskRevealY + 30) / docHeight, "white"],
      [1, "white"],
    ];
    for (const [offset, color] of maskStops) {
      svgEl("stop", { offset, "stop-color": color }, maskGrad);
    }

    const mask = svgEl("mask", { id: "prism-mask" }, defs);
    svgEl("rect", { x: 0, y: 0, width: "100%", height: docHeight, fill: "url(#prism-mask-gradient)" }, mask);

    drawPath.setAttribute("mask", "url(#prism-mask)");
    for (const gp of ghostPathEls) {
      gp.setAttribute("mask", "url(#prism-mask)");
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
      const path = svgEl("path", { d: bD, class: "timeline-path__branch" }, branchGroup);
      branchPathEls.push(path);
      initDashPath(path, branchLengths);
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
    // Hide when dot reaches the prism face (Y-based, avoids arc-length mismatch)
    const inPrism = prismRange.faceY > 0 &&
      point.y >= prismRange.faceY - 30 && progress <= prismRange.end + 0.02;
    if (inPrism) {
      leadingDot.setAttribute("opacity", "0");
    } else {
      leadingDot.setAttribute("cx", String(point.x));
      leadingDot.setAttribute("cy", String(point.y));
      leadingDot.setAttribute("opacity", "1");
      leadingDot.setAttribute("r", String(4 + easedProgress * 5));
    }
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

  // ── Portal gateway ──
  if (portalEl && portalInnerEl) {
    if (progress >= portalProgress - 0.03 && progress <= splitRange.end + 0.05) {
      const portalEntry = (progress - portalProgress + 0.03) / 0.06;
      const portalVis = Math.min(1, Math.max(0, portalEntry));
      const scale = 1 - Math.pow(1 - portalVis, 3);

      const sp = splitRange.end > splitRange.start
        ? (progress - splitRange.start) / (splitRange.end - splitRange.start)
        : 0;
      const fadeOut = sp > 0.85 ? Math.max(0, 1 - (sp - 0.85) / 0.15) : 1;

      let outerRx = 35 * scale;
      let innerRx = 25 * scale;
      if (portalVis >= 1 && fadeOut > 0.5) {
        const pulse = Math.sin(Date.now() / 400) * 2;
        outerRx += pulse;
        innerRx += pulse * 0.6;
      }

      portalEl.setAttribute("rx", String(outerRx));
      portalEl.setAttribute("ry", String(18 * scale));
      portalEl.setAttribute("opacity", String(portalVis * fadeOut));
      portalInnerEl.setAttribute("rx", String(innerRx));
      portalInnerEl.setAttribute("ry", String(12 * scale));
      portalInnerEl.setAttribute("opacity", String(portalVis * fadeOut * 0.8));
    } else {
      portalEl.setAttribute("opacity", "0");
      portalInnerEl.setAttribute("opacity", "0");
    }
  }

  // ── Rainbow split paths (About section) ──
  if (splitRange.end > splitRange.start) {
    for (let s = 0; s < splitPathEls.length; s++) {
      if (progress >= splitRange.start && progress <= splitRange.end + 0.05) {
        const range = splitRange.end - splitRange.start;
        const sp = (progress - splitRange.start) / range;

        // Staggered emergence: each line starts slightly after the previous
        const stagger = s * 0.02;
        const adjusted = Math.max(0, sp - stagger);
        const clamped = Math.min(1, adjusted / (1 - stagger));
        const eased = 1 - Math.pow(1 - clamped, 2);

        splitPathEls[s].style.strokeDashoffset = String(
          splitLengths[s] * (1 - eased),
        );

        const fadeIn = Math.min(1, adjusted * 6);
        const fadeOut = sp > 0.80 ? Math.max(0, 1 - (sp - 0.80) / 0.20) : 1;
        splitPathEls[s].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        splitPathEls[s].style.strokeDashoffset = String(splitLengths[s]);
        splitPathEls[s].style.opacity = "0";
      }
    }
  }

  // ── Fan-out paths (Projects section → converge at prism) ──
  if (fanRange.end > fanRange.start) {
    for (let f = 0; f < fanPathEls.length; f++) {
      if (progress >= fanRange.start) {
        const fp = (progress - fanRange.start) / (fanRange.end - fanRange.start);
        const clamped = Math.min(1, fp);
        const eased = 1 - Math.pow(1 - clamped, 2);
        fanPathEls[f].style.strokeDashoffset = String(
          fanLengths[f] * (1 - eased),
        );
        const fadeIn = Math.min(1, fp * 5);
        // Linger after convergence, then fade
        const fadeOut = fp > 1.2 ? Math.max(0, 1 - (fp - 1.2) / 0.15) : 1;
        fanPathEls[f].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        fanPathEls[f].style.strokeDashoffset = String(fanLengths[f]);
        fanPathEls[f].style.opacity = "0";
      }
    }
  }

  // ── Prism refraction (Research section) ──
  if (prismRange.end > prismRange.start) {
    // Prism body + beam + glow visibility
    if (prismBodyEl) {
      const ps = prismRange.start;
      if (progress >= ps - 0.08 && progress <= prismRange.end + 0.08) {
        // Beam fades in early and smoothly
        const beamEntry = (progress - ps + 0.08) / 0.05;
        const beamVis = Math.min(1, Math.max(0, beamEntry));

        // Prism body appears when beam is close
        const prismEntry = (progress - ps + 0.03) / 0.04;
        const prismVis = Math.min(1, Math.max(0, prismEntry));

        const sectionP = (progress - ps) / (prismRange.end - ps);
        const fadeOut = sectionP > 0.90 ? Math.max(0, 1 - (sectionP - 0.90) / 0.15) : 1;
        const opacity = prismVis * fadeOut;

        // Momentary flash when fan paths converge on the prism
        const impactDelta = progress - ps;
        let flash = 0;
        if (impactDelta >= -0.005 && impactDelta < 0.04) {
          const t = impactDelta < 0
            ? (impactDelta + 0.005) / 0.005
            : Math.max(0, 1 - impactDelta / 0.03);
          flash = t * t;
        }

        prismBodyEl.style.opacity = String(Math.min(1, opacity + flash * 0.4));
        for (const edge of prismEdgeEls) {
          edge.style.opacity = String(Math.min(1, opacity * 0.8 + flash * 0.5));
        }
        if (prismHighlightEl) {
          const shimmer = 0.15 + Math.sin(Date.now() / 600) * 0.05;
          prismHighlightEl.style.opacity = String(Math.min(1, opacity * shimmer / 0.2 + flash * 0.6));
        }
        if (prismBeamEl) {
          prismBeamEl.style.opacity = String(Math.min(1, beamVis * fadeOut + flash * 0.3));
        }

        // Inner glow: momentary flash at impact, then gone
        if (prismGlowEl) {
          prismGlowEl.style.opacity = String(flash * fadeOut);
        }
      } else {
        prismBodyEl.style.opacity = "0";
        for (const edge of prismEdgeEls) edge.style.opacity = "0";
        if (prismHighlightEl) prismHighlightEl.style.opacity = "0";
        if (prismBeamEl) prismBeamEl.style.opacity = "0";
        if (prismGlowEl) prismGlowEl.style.opacity = "0";
      }
    }

    // Rainbow ray paths — persist well into the Contact section
    for (let r = 0; r < prismRayEls.length; r++) {
      if (progress >= prismRange.start && progress <= prismRange.end + 0.25) {
        const range = prismRange.end - prismRange.start;
        const rp = (progress - prismRange.start) / range;

        const stagger = r * 0.025;
        const adjusted = Math.max(0, rp - stagger);
        const clamped = Math.min(1, adjusted / (1 - stagger));
        const eased = 1 - Math.pow(1 - clamped, 2);

        prismRayEls[r].style.strokeDashoffset = String(
          prismRayLengths[r] * (1 - eased),
        );

        const fadeIn = Math.min(1, adjusted * 5);
        // After convergence, stay visible while convergence point is on screen,
        // then fade as user scrolls past it
        const fadeOut = rp > 1.3 ? Math.max(0, 1 - (rp - 1.3) / 0.65) : 1;
        prismRayEls[r].style.opacity = String(Math.max(0, fadeIn * fadeOut));
      } else {
        prismRayEls[r].style.strokeDashoffset = String(prismRayLengths[r]);
        prismRayEls[r].style.opacity = "0";
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

let scrollRafId = 0;
const onScroll = () => {
  if (!scrollRafId) {
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = 0;
      setActiveSection();
      animateTimelinePath();
    });
  }
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
  if (portalEl) {
    portalEl.setAttribute("opacity", "0.6");
  }
  if (portalInnerEl) {
    portalInnerEl.setAttribute("opacity", "0.5");
  }
  for (const fp of fanPathEls) {
    fp.style.strokeDashoffset = "0";
    fp.style.opacity = "1";
  }
  if (prismBodyEl) prismBodyEl.style.opacity = "0.6";
  for (const edge of prismEdgeEls) edge.style.opacity = "0.5";
  if (prismHighlightEl) prismHighlightEl.style.opacity = "0.3";
  // prismBeamEl removed — fan paths serve as incoming light
  for (const rp of prismRayEls) {
    rp.style.strokeDashoffset = "0";
    rp.style.opacity = "1";
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
