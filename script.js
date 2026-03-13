const scenarios = [
  {
    id: "no-results",
    label: "No results",
    title: "No results found",
    body:
      "We couldn't find anything matching your search. Try adjusting your filters or using different keywords.",
    action: "Clear search",
    artwork: "lissajous",
  },
  {
    id: "empty-inbox",
    label: "Empty inbox",
    title: "Inbox zero",
    body:
      "You're all caught up. New messages will appear here as soon as conversations start coming in.",
    action: "Set notifications",
    artwork: "waves",
  },
  {
    id: "no-data",
    label: "No data",
    title: "No data yet",
    body:
      "There isn't enough activity to populate this view yet. Connect a source or wait for fresh events to arrive.",
    action: "Connect source",
    artwork: "field",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    title: "Start your setup",
    body:
      "Complete a few quick steps to unlock the workspace. We'll guide you through the essentials from here.",
    action: "Begin onboarding",
    artwork: "orbital",
  },
];

const tabList = document.querySelector(".tab-list");
const panel = document.querySelector("#panel");
const illustration = document.querySelector("#illustration");
const stateTitle = document.querySelector("#state-title");
const stateBody = document.querySelector("#state-body");
const stateButton = document.querySelector("#state-button");
const themeToggle = document.querySelector("#theme-toggle");

let activeScenario = scenarios[0].id;

function createTabButton(scenario) {
  const button = document.createElement("button");
  button.className = "tab-button";
  button.type = "button";
  button.role = "tab";
  button.id = `tab-${scenario.id}`;
  button.textContent = scenario.label;
  button.setAttribute("aria-controls", "panel");
  button.setAttribute("aria-selected", String(scenario.id === activeScenario));
  button.tabIndex = scenario.id === activeScenario ? 0 : -1;
  button.addEventListener("click", () => setScenario(scenario.id));
  button.addEventListener("keydown", handleTabKeydown);
  return button;
}

function handleTabKeydown(event) {
  const currentIndex = scenarios.findIndex((scenario) => scenario.id === activeScenario);
  if (currentIndex === -1) return;

  const offset = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 :
    event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;

  if (!offset) return;

  event.preventDefault();
  const nextIndex = (currentIndex + offset + scenarios.length) % scenarios.length;
  const nextScenario = scenarios[nextIndex];
  setScenario(nextScenario.id);
  document.querySelector(`#tab-${nextScenario.id}`)?.focus();
}

function getArtworkMarkup(artwork) {
  if (artwork === "waves") {
    return `
      <div class="artboard">
        <svg viewBox="0 0 220 140" class="art-svg waves-svg" aria-hidden="true">
          <defs>
            <linearGradient id="wavesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#dcecf8"></stop>
              <stop offset="55%" stop-color="#9ec5e3"></stop>
              <stop offset="100%" stop-color="#70b1d6"></stop>
            </linearGradient>
            <filter id="wavesBlur">
              <feGaussianBlur stdDeviation="8"></feGaussianBlur>
            </filter>
          </defs>
          <path d="M-8 62 C 20 28, 58 28, 86 62 S 152 96, 228 58" fill="none" stroke="url(#wavesGradient)" stroke-width="22" stroke-linecap="round" filter="url(#wavesBlur)" opacity="0.78"></path>
          <path d="M-4 66 C 26 42, 56 42, 86 66 S 146 88, 224 64" fill="none" stroke="#78add2" stroke-width="2.5" stroke-linecap="round"></path>
          <path d="M14 88 C 42 62, 68 62, 94 88 S 150 114, 208 84" fill="none" stroke="#3a6f95" stroke-opacity="0.42" stroke-width="2" stroke-linecap="round"></path>
        </svg>
      </div>
    `;
  }

  if (artwork === "field") {
    return `
      <div class="artboard">
        <svg viewBox="0 0 220 140" class="art-svg field-svg" aria-hidden="true">
          <defs>
            <radialGradient id="fieldGlow" cx="28%" cy="28%" r="90%">
              <stop offset="0%" stop-color="#d8ecfb"></stop>
              <stop offset="70%" stop-color="#72b5da"></stop>
              <stop offset="100%" stop-color="#2f6f95"></stop>
            </radialGradient>
          </defs>
          <rect x="36" y="28" width="148" height="84" rx="20" fill="url(#fieldGlow)" opacity="0.95"></rect>
          <rect x="72" y="56" width="76" height="28" rx="14" fill="rgba(29, 72, 95, 0.16)"></rect>
          <circle cx="110" cy="70" r="4.5" fill="#ffffff" opacity="0.95"></circle>
          <path d="M28 94 C 52 78, 72 72, 96 82 S 146 100, 194 70" fill="none" stroke="#dff4ff" stroke-opacity="0.5" stroke-width="2"></path>
        </svg>
      </div>
    `;
  }

  if (artwork === "orbital") {
    return `
      <div class="artboard">
        <svg viewBox="0 0 220 140" class="art-svg orbital-svg" aria-hidden="true">
          <defs>
            <linearGradient id="orbitalGradient" x1="12%" y1="20%" x2="88%" y2="74%">
              <stop offset="0%" stop-color="#dcecf8"></stop>
              <stop offset="48%" stop-color="#a8c9e5"></stop>
              <stop offset="100%" stop-color="#7db7dc"></stop>
            </linearGradient>
          </defs>
          <ellipse cx="110" cy="70" rx="72" ry="38" fill="url(#orbitalGradient)" opacity="0.55"></ellipse>
          <path d="M54 72 C 72 28, 148 28, 166 72 C 148 112, 72 112, 54 72 Z" fill="none" stroke="#4f82a7" stroke-opacity="0.44" stroke-width="1.8"></path>
          <path d="M70 34 C 114 34, 154 54, 154 72 C 154 90, 114 110, 70 110" fill="none" stroke="#2f658c" stroke-opacity="0.35" stroke-width="1.8"></path>
          <circle cx="110" cy="70" r="10" fill="#ffffff" opacity="0.9"></circle>
          <circle cx="154" cy="72" r="5.5" fill="#2f6f95" opacity="0.7"></circle>
        </svg>
      </div>
    `;
  }

  return `
    <div class="artboard">
      <svg viewBox="0 0 220 140" class="art-svg lissajous-svg" aria-hidden="true">
        <defs>
          <linearGradient id="lissajousGlow" x1="18%" y1="12%" x2="88%" y2="84%">
            <stop offset="0%" stop-color="#edf6ff"></stop>
            <stop offset="55%" stop-color="#b4d5eb"></stop>
            <stop offset="100%" stop-color="#81b7d9"></stop>
          </linearGradient>
          <filter id="lissajousBlur">
            <feGaussianBlur stdDeviation="8"></feGaussianBlur>
          </filter>
        </defs>
        <path d="M48 56 C 72 24, 148 24, 172 56 C 148 88, 72 88, 48 56 Z" fill="none" stroke="url(#lissajousGlow)" stroke-width="18" stroke-linecap="round" filter="url(#lissajousBlur)" opacity="0.72"></path>
        <path d="M52 78 C 72 20, 96 20, 110 78 C 124 136, 148 136, 168 78" fill="none" stroke="#1e1f23" stroke-opacity="0.82" stroke-width="2.4" stroke-linecap="round"></path>
        <path d="M52 78 C 72 136, 96 136, 110 78 C 124 20, 148 20, 168 78" fill="none" stroke="#87aeca" stroke-width="1.8" stroke-linecap="round"></path>
      </svg>
    </div>
  `;
}

function renderIllustration(artwork) {
  illustration.innerHTML = getArtworkMarkup(artwork);
}

function setScenario(id) {
  const scenario = scenarios.find((entry) => entry.id === id);
  if (!scenario) return;

  activeScenario = id;

  document.querySelectorAll(".tab-button").forEach((button) => {
    const isSelected = button.id === `tab-${id}`;
    button.setAttribute("aria-selected", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  });

  panel.setAttribute("aria-labelledby", `tab-${id}`);
  stateTitle.textContent = scenario.title;
  stateBody.textContent = scenario.body;
  stateButton.textContent = scenario.action;
  renderIllustration(scenario.artwork);
}

scenarios.forEach((scenario) => {
  tabList.appendChild(createTabButton(scenario));
});

setScenario(activeScenario);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Turn off dark mode" : "Turn on dark mode"
  );
});
