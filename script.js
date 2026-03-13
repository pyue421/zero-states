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
    artwork: "harmonics",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    title: "Start your setup",
    body:
      "Complete a few quick steps to unlock the workspace. We'll guide you through the essentials from here.",
    action: "Begin onboarding",
    artwork: "rosette",
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
      <div class="artboard artboard-waves">
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
          <path class="graphic-guide" d="M18 70 H202"></path>
          <path class="graphic-guide graphic-guide-faint" d="M18 44 H202"></path>
          <path class="graphic-guide graphic-guide-faint" d="M18 96 H202"></path>
          <path class="graphic-glow wave-glow" d="M-8 60 C 22 28, 58 28, 88 60 S 152 92, 228 58" fill="none" stroke="url(#wavesGradient)" stroke-width="20" stroke-linecap="round" filter="url(#wavesBlur)"></path>
          <path class="graphic-primary wave-main" d="M8 70 C 32 44, 56 44, 80 70 S 128 96, 152 70 S 176 44, 202 70" fill="none"></path>
          <path class="graphic-secondary wave-alt" d="M8 70 C 32 96, 56 96, 80 70 S 128 44, 152 70 S 176 96, 202 70" fill="none"></path>
          <path class="graphic-tertiary wave-tert" d="M8 82 C 32 62, 56 62, 80 82 S 128 102, 152 82 S 176 62, 202 82" fill="none"></path>
          <circle class="graphic-node" cx="80" cy="70" r="3.5"></circle>
          <circle class="graphic-node graphic-node-soft" cx="152" cy="70" r="3.5"></circle>
        </svg>
      </div>
    `;
  }

  if (artwork === "harmonics") {
    return `
      <div class="artboard artboard-harmonics">
        <svg viewBox="0 0 220 140" class="art-svg harmonics-svg" aria-hidden="true">
          <defs>
            <linearGradient id="harmonicGlow" x1="8%" y1="0%" x2="92%" y2="100%">
              <stop offset="0%" stop-color="#edf7ff"></stop>
              <stop offset="50%" stop-color="#bad9ee"></stop>
              <stop offset="100%" stop-color="#79b4d7"></stop>
            </linearGradient>
          </defs>
          <rect class="graphic-frame" x="34" y="28" width="152" height="84" rx="18"></rect>
          <path class="graphic-guide" d="M50 49 H170"></path>
          <path class="graphic-guide" d="M50 70 H170"></path>
          <path class="graphic-guide" d="M50 91 H170"></path>
          <path class="graphic-glow harmonic-glow" d="M50 49 C 64 38, 76 38, 90 49 S 116 60, 130 49 S 156 38, 170 49" fill="none" stroke="url(#harmonicGlow)" stroke-width="12" stroke-linecap="round"></path>
          <path class="graphic-primary harmonic-a" d="M50 49 C 64 38, 76 38, 90 49 S 116 60, 130 49 S 156 38, 170 49" fill="none"></path>
          <path class="graphic-secondary harmonic-b" d="M50 70 C 68 52, 86 52, 104 70 S 140 88, 170 64" fill="none"></path>
          <path class="graphic-tertiary harmonic-c" d="M50 91 C 60 74, 72 74, 82 91 S 104 108, 114 91 S 136 74, 146 91 S 160 108, 170 91" fill="none"></path>
          <circle class="graphic-node" cx="104" cy="70" r="3"></circle>
        </svg>
      </div>
    `;
  }

  if (artwork === "rosette") {
    return `
      <div class="artboard artboard-rosette">
        <svg viewBox="0 0 220 140" class="art-svg rosette-svg" aria-hidden="true">
          <defs>
            <linearGradient id="rosetteGlow" x1="12%" y1="20%" x2="88%" y2="74%">
              <stop offset="0%" stop-color="#ebf6ff"></stop>
              <stop offset="48%" stop-color="#b8d8ed"></stop>
              <stop offset="100%" stop-color="#7cb5d8"></stop>
            </linearGradient>
          </defs>
          <circle class="graphic-guide" cx="110" cy="70" r="42"></circle>
          <circle class="graphic-guide graphic-guide-faint" cx="110" cy="70" r="58"></circle>
          <path class="graphic-glow rosette-glow" d="M66 70 C 66 34, 154 34, 154 70 C 154 106, 66 106, 66 70 Z" fill="none" stroke="url(#rosetteGlow)" stroke-width="14" stroke-linecap="round"></path>
          <path class="graphic-primary rosette-primary" d="M66 70 C 66 34, 154 34, 154 70 C 154 106, 66 106, 66 70 Z" fill="none"></path>
          <path class="graphic-secondary rosette-secondary" d="M52 70 C 52 20, 168 20, 168 70 C 168 120, 52 120, 52 70 Z" fill="none"></path>
          <path class="graphic-tertiary rosette-tertiary" d="M66 46 C 96 16, 124 16, 154 46 M66 94 C 96 124, 124 124, 154 94" fill="none"></path>
          <circle class="graphic-node" cx="110" cy="70" r="3.5"></circle>
        </svg>
      </div>
    `;
  }

  return `
    <div class="artboard artboard-lissajous">
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
        <path class="graphic-guide" d="M36 70 H184"></path>
        <path class="graphic-guide graphic-guide-faint" d="M110 22 V118"></path>
        <path class="graphic-glow lissajous-glow" d="M48 70 C 72 26, 96 26, 110 70 C 124 114, 148 114, 172 70" fill="none" stroke="url(#lissajousGlow)" stroke-width="14" stroke-linecap="round" filter="url(#lissajousBlur)"></path>
        <path class="graphic-primary loop-a" d="M48 70 C 72 26, 96 26, 110 70 C 124 114, 148 114, 172 70" fill="none"></path>
        <path class="graphic-secondary loop-b" d="M48 70 C 72 114, 96 114, 110 70 C 124 26, 148 26, 172 70" fill="none"></path>
        <circle class="graphic-node" cx="110" cy="70" r="3.5"></circle>
        <circle class="graphic-node graphic-node-soft" cx="48" cy="70" r="2.5"></circle>
        <circle class="graphic-node graphic-node-soft" cx="172" cy="70" r="2.5"></circle>
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
