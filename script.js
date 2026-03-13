const scenarios = [
  {
    id: "page-level",
    label: "Page level",
    path: "./index.html",
    title: "No data found",
    body: "Reset filters or adjust the date range.",
    action: "Reset Filters",
  },
  {
    id: "data-states",
    label: "Data states",
    path: "./data-states.html",
    title: "Empty tables, charts, and lists",
    body:
      "Use these for row-based views when content is missing, including loading skeletons, no data found, and no results after filters are applied.",
    action: "Review data states",
  },
  {
    id: "custom",
    label: "Custom",
    path: "./custom.html",
    title: "Tune your own Lissajous curve",
    body: "Adjust amplitudes, frequencies, phase, and rotation to build a custom zero-state.",
    action: "Try custom state",
  },
];

const TAU = Math.PI * 2;
const THEME_STORAGE_KEY = "zero-states-theme";

const illustrationStates = {
  "page-level": {
    svgClass: "state-curve-svg page-curve-svg",
    curve: {
      cx: 110,
      cy: 70,
      amplitudeX: 56,
      amplitudeY: 40,
      frequencyX: 1,
      frequencyY: 2,
      phase: Math.PI / 2,
      rotation: 0,
      samples: 260,
    },
  },
  "data-states": {
    svgClass: "state-curve-svg data-curve-svg",
    curve: {
      cx: 110,
      cy: 70,
      amplitudeX: 64,
      amplitudeY: 38,
      frequencyX: 1,
      frequencyY: 1,
      phase: Math.PI / 4,
      rotation: -0.3,
      samples: 220,
    },
  },
};

const pageLevelCurveStates = [
  {
    cx: 110,
    cy: 70,
    amplitudeX: 64,
    amplitudeY: 38,
    frequencyX: 1,
    frequencyY: 1,
    phase: Math.PI / 4,
    rotation: 0,
    samples: 320,
  },
  {
    cx: 110,
    cy: 70,
    amplitudeX: 56,
    amplitudeY: 40,
    frequencyX: 1,
    frequencyY: 2,
    phase: Math.PI / 2,
    rotation: 0,
    samples: 320,
  },
  {
    cx: 110,
    cy: 70,
    amplitudeX: 52,
    amplitudeY: 46,
    frequencyX: 2,
    frequencyY: 3,
    phase: Math.PI / 2,
    rotation: 0,
    samples: 320,
  },
];

const customCurve = {
  cx: 110,
  cy: 70,
  amplitudeX: 54,
  amplitudeY: 42,
  frequencyX: 2,
  frequencyY: 3,
  phase: Math.PI / 2,
  rotation: 0,
  samples: 280,
};

const customContent = {
  title: "Tune your own Lissajous curve",
  body: "Adjust amplitudes, frequencies, phase, and rotation to build a custom zero-state.",
  action: "Try custom state",
};

const customControlConfig = [
  {
    key: "amplitudeX",
    inputId: "control-amplitude-x",
    outputId: "value-amplitude-x",
    format: (value) => `${Math.round(value)}`,
  },
  {
    key: "amplitudeY",
    inputId: "control-amplitude-y",
    outputId: "value-amplitude-y",
    format: (value) => `${Math.round(value)}`,
  },
  {
    key: "frequencyX",
    inputId: "control-frequency-x",
    outputId: "value-frequency-x",
    format: (value) => `${Math.round(value)}`,
  },
  {
    key: "frequencyY",
    inputId: "control-frequency-y",
    outputId: "value-frequency-y",
    format: (value) => `${Math.round(value)}`,
  },
  {
    key: "phase",
    inputId: "control-phase",
    outputId: "value-phase",
    format: (value) => `${(value / Math.PI).toFixed(2)}π`,
  },
  {
    key: "rotation",
    inputId: "control-rotation",
    outputId: "value-rotation",
    format: (value) => `${(value * 57.3).toFixed(0)}°`,
  },
];

let pageLevelAnimationFrame = 0;
let pageLevelAnimationStart = 0;
let customAnimationFrame = 0;
let customAnimationStart = 0;

function getScenarioById(id) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

function getLissajousPoint(config, t) {
  const {
    cx,
    cy,
    amplitudeX,
    amplitudeY,
    frequencyX,
    frequencyY,
    phase = 0,
    rotation = 0,
  } = config;

  const rawX = amplitudeX * Math.sin(frequencyX * t + phase);
  const rawY = amplitudeY * Math.sin(frequencyY * t);
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  return {
    x: cx + rawX * cos - rawY * sin,
    y: cy + rawX * sin + rawY * cos,
  };
}

function getLissajousPath(config) {
  const samples = config.samples ?? 240;
  const points = [];

  for (let index = 0; index < samples; index += 1) {
    const t = (TAU * index) / samples;
    points.push(getLissajousPoint(config, t));
  }

  if (!points.length) return "";

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} `;

  for (let index = 0; index < points.length; index += 1) {
    const p0 = points[(index - 1 + points.length) % points.length];
    const p1 = points[index];
    const p2 = points[(index + 1) % points.length];
    const p3 = points[(index + 2) % points.length];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }

  return `${path}Z`;
}

function renderCurve(className, config, extraAttributes = "") {
  return `<path class="${className}" d="${getLissajousPath(config)}" fill="none" ${extraAttributes}></path>`;
}

function renderNode(className, config, t, radius) {
  const point = getLissajousPoint(config, t);
  return `<circle class="${className}" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${radius}"></circle>`;
}

function interpolateCurve(from, to, progress) {
  return {
    cx: from.cx + (to.cx - from.cx) * progress,
    cy: from.cy + (to.cy - from.cy) * progress,
    amplitudeX: from.amplitudeX + (to.amplitudeX - from.amplitudeX) * progress,
    amplitudeY: from.amplitudeY + (to.amplitudeY - from.amplitudeY) * progress,
    frequencyX: from.frequencyX + (to.frequencyX - from.frequencyX) * progress,
    frequencyY: from.frequencyY + (to.frequencyY - from.frequencyY) * progress,
    phase: from.phase + (to.phase - from.phase) * progress,
    rotation: from.rotation + (to.rotation - from.rotation) * progress,
    samples: Math.max(from.samples ?? 260, to.samples ?? 260),
  };
}

function easeInOutSine(progress) {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

function stopPageLevelAnimation() {
  if (!pageLevelAnimationFrame) return;

  cancelAnimationFrame(pageLevelAnimationFrame);
  pageLevelAnimationFrame = 0;
  pageLevelAnimationStart = 0;
}

function stopCustomAnimation() {
  if (!customAnimationFrame) return;

  cancelAnimationFrame(customAnimationFrame);
  customAnimationFrame = 0;
  customAnimationStart = 0;
}

function getIllustrationMarkup(pageId) {
  const state = pageId === "custom"
    ? { svgClass: "state-curve-svg custom-curve-svg", curve: customCurve }
    : (illustrationStates[pageId] ?? illustrationStates["page-level"]);
  const glowCurve = {
    ...state.curve,
    amplitudeX: state.curve.amplitudeX + 4,
    amplitudeY: state.curve.amplitudeY + 4,
    samples: Math.max(state.curve.samples, 260),
  };
  const isPageLevel = pageId === "page-level";
  const isCustomPage = pageId === "custom";

  return `
    <div class="artboard artboard-lissajous">
      <svg viewBox="0 0 220 140" class="art-svg ${state.svgClass}" aria-hidden="true">
        <defs>
          <linearGradient id="stateCurveGradient" x1="18%" y1="12%" x2="88%" y2="84%">
            <stop offset="0%" stop-color="var(--art-grad-warm)"></stop>
            <stop offset="52%" stop-color="var(--art-grad-soft)"></stop>
            <stop offset="100%" stop-color="var(--art-grad-cool)"></stop>
          </linearGradient>
          <filter id="stateCurveBlur">
            <feGaussianBlur stdDeviation="8"></feGaussianBlur>
          </filter>
        </defs>
        ${renderCurve(
          "graphic-glow curve-glow",
          glowCurve,
          'stroke="url(#stateCurveGradient)" stroke-width="14" stroke-linecap="round" filter="url(#stateCurveBlur)"'
        )}
        ${renderCurve(`graphic-primary curve-path${isPageLevel ? " curve-path-page" : ""}${isCustomPage ? " curve-path-custom" : ""}`, state.curve)}
        ${isPageLevel
          ? `${renderNode("graphic-node motion-node motion-node-page", state.curve, 0, 4.25)}
             ${renderNode("graphic-node graphic-node-soft motion-node motion-node-page-soft", state.curve, 0.5 * TAU, 4.25)}`
          : isCustomPage
            ? renderNode("graphic-node motion-node motion-node-custom", state.curve, 0, 3.75)
            : renderNode("graphic-node", state.curve, 0.125 * TAU, 3.25)}
      </svg>
    </div>
  `;
}

function applyTheme(themeToggle) {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  const isDark = storedTheme === "dark";

  document.body.classList.toggle("dark", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Turn off dark mode" : "Turn on dark mode");
}

function initThemeToggle(themeToggle) {
  applyTheme(themeToggle);

  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    document.body.classList.toggle("dark", isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Turn off dark mode" : "Turn on dark mode");
  });
}

function buildNavigation(tabList, currentPageId) {
  const fragment = document.createDocumentFragment();

  scenarios.forEach((scenario) => {
    const link = document.createElement("a");
    link.className = "tab-button";
    link.href = scenario.path;
    link.id = `tab-${scenario.id}`;
    link.textContent = scenario.label;

    if (scenario.id === currentPageId) {
      link.setAttribute("aria-current", "page");
    }

    fragment.appendChild(link);
  });

  tabList.appendChild(fragment);
}

function renderStaticPage(pageId, refs) {
  const scenario = getScenarioById(pageId);

  refs.state.dataset.scenario = pageId;
  refs.stateTitle.textContent = scenario.title;
  refs.stateBody.textContent = scenario.body;
  refs.stateButton.textContent = scenario.action;
  refs.stateButton.hidden = !scenario.action;
  refs.illustration.innerHTML = getIllustrationMarkup(pageId);
}

function syncCustomControls() {
  customControlConfig.forEach(({ key, inputId, outputId, format }) => {
    const input = document.querySelector(`#${inputId}`);
    const output = document.querySelector(`#${outputId}`);
    if (!input || !output) return;

    input.value = String(customCurve[key]);
    output.value = format(customCurve[key]);
    output.textContent = format(customCurve[key]);
  });
}

function renderCustomPage(refs) {
  stopCustomAnimation();
  refs.state.dataset.scenario = "custom";
  refs.stateTitle.textContent = customContent.title;
  refs.stateBody.textContent = customContent.body;
  refs.stateButton.textContent = customContent.action;
  refs.stateButton.hidden = !customContent.action.trim();
  refs.illustration.innerHTML = getIllustrationMarkup("custom");
  animateCustomIllustration(refs);
}

function initCustomControls(refs) {
  syncCustomControls();
  renderCustomPage(refs);

  customControlConfig.forEach(({ key, inputId, outputId, format }) => {
    const input = document.querySelector(`#${inputId}`);
    const output = document.querySelector(`#${outputId}`);
    if (!input || !output) return;

    input.addEventListener("input", (event) => {
      const nextValue = Number(event.target.value);
      customCurve[key] = nextValue;
      output.value = format(nextValue);
      output.textContent = format(nextValue);
      renderCustomPage(refs);
    });
  });

  const customTitleInput = document.querySelector("#control-title");
  const customDescriptionInput = document.querySelector("#control-description");
  const customButtonInput = document.querySelector("#control-button");

  if (!customTitleInput || !customDescriptionInput || !customButtonInput) return;

  customTitleInput.value = customContent.title;
  customDescriptionInput.value = customContent.body;
  customButtonInput.value = customContent.action;

  customTitleInput.addEventListener("input", (event) => {
    customContent.title = event.target.value;
    renderCustomPage(refs);
  });

  customDescriptionInput.addEventListener("input", (event) => {
    customContent.body = event.target.value;
    renderCustomPage(refs);
  });

  customButtonInput.addEventListener("input", (event) => {
    customContent.action = event.target.value;
    renderCustomPage(refs);
  });
}

function animatePageLevelIllustration(refs) {
  stopPageLevelAnimation();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const primaryPath = refs.illustration.querySelector(".page-curve-svg .curve-path-page");
  const glowPath = refs.illustration.querySelector(".page-curve-svg .curve-glow");
  const leadNode = refs.illustration.querySelector(".page-curve-svg .motion-node-page");
  const trailNode = refs.illustration.querySelector(".page-curve-svg .motion-node-page-soft");

  if (!primaryPath || !glowPath || !leadNode || !trailNode) return;

  const cycleMs = 3600;
  const totalMs = cycleMs * pageLevelCurveStates.length;

  function step(timestamp) {
    if (document.body.dataset.page !== "page-level") {
      stopPageLevelAnimation();
      return;
    }

    if (!pageLevelAnimationStart) {
      pageLevelAnimationStart = timestamp;
    }

    const elapsed = (timestamp - pageLevelAnimationStart) % totalMs;
    const stateProgress = elapsed / cycleMs;
    const stateIndex = Math.floor(stateProgress) % pageLevelCurveStates.length;
    const stateElapsed = stateProgress - Math.floor(stateProgress);
    const from = pageLevelCurveStates[stateIndex];
    const to = pageLevelCurveStates[(stateIndex + 1) % pageLevelCurveStates.length];
    const transitionProgress = easeInOutSine(stateElapsed);
    const curve = interpolateCurve(from, to, transitionProgress);
    const glowCurve = {
      ...curve,
      amplitudeX: curve.amplitudeX + 4,
      amplitudeY: curve.amplitudeY + 4,
    };
    const transitionSoftness = Math.sin(stateElapsed * Math.PI);
    const primaryOpacity = 1 - transitionSoftness * 0.18;
    const glowOpacity = 0.7 - transitionSoftness * 0.28;
    const nodeOpacity = 1 - transitionSoftness * 0.14;
    const orbit = ((timestamp - pageLevelAnimationStart) / 6500) % 1;
    const leadPoint = getLissajousPoint(curve, orbit * TAU);
    const trailPoint = getLissajousPoint(curve, ((orbit + 0.5) % 1) * TAU);

    primaryPath.setAttribute("d", getLissajousPath(curve));
    glowPath.setAttribute("d", getLissajousPath(glowCurve));
    primaryPath.setAttribute("opacity", primaryOpacity.toFixed(3));
    glowPath.setAttribute("opacity", glowOpacity.toFixed(3));
    leadNode.setAttribute("cx", leadPoint.x.toFixed(2));
    leadNode.setAttribute("cy", leadPoint.y.toFixed(2));
    leadNode.setAttribute("opacity", nodeOpacity.toFixed(3));
    trailNode.setAttribute("cx", trailPoint.x.toFixed(2));
    trailNode.setAttribute("cy", trailPoint.y.toFixed(2));
    trailNode.setAttribute("opacity", Math.max(nodeOpacity - 0.18, 0.42).toFixed(3));

    pageLevelAnimationFrame = requestAnimationFrame(step);
  }

  pageLevelAnimationFrame = requestAnimationFrame(step);
}

function animateCustomIllustration(refs) {
  stopCustomAnimation();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const customNode = refs.illustration.querySelector(".custom-curve-svg .motion-node-custom");
  if (!customNode) return;

  function step(timestamp) {
    if (document.body.dataset.page !== "custom") {
      stopCustomAnimation();
      return;
    }

    if (!customAnimationStart) {
      customAnimationStart = timestamp;
    }

    const orbit = ((timestamp - customAnimationStart) / 5200) % 1;
    const point = getLissajousPoint(customCurve, orbit * TAU);

    customNode.setAttribute("cx", point.x.toFixed(2));
    customNode.setAttribute("cy", point.y.toFixed(2));

    customAnimationFrame = requestAnimationFrame(step);
  }

  customAnimationFrame = requestAnimationFrame(step);
}

function initPage() {
  const currentPageId = document.body.dataset.page || "page-level";
  const tabList = document.querySelector(".tab-list");
  const state = document.querySelector("#state");
  const illustration = document.querySelector("#illustration");
  const stateTitle = document.querySelector("#state-title");
  const stateBody = document.querySelector("#state-body");
  const stateButton = document.querySelector("#state-button");
  const themeToggle = document.querySelector("#theme-toggle");
  const refs = { state, illustration, stateTitle, stateBody, stateButton };

  buildNavigation(tabList, currentPageId);
  initThemeToggle(themeToggle);

  if (currentPageId === "custom") {
    initCustomControls(refs);
    return;
  }

  renderStaticPage(currentPageId, refs);

  if (currentPageId === "page-level") {
    animatePageLevelIllustration(refs);
  }
}

initPage();
