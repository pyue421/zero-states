const scenarios = [
  {
    id: "no-results",
    label: "No results",
    title: "No results found",
    body:
      "We couldn't find anything matching your search. Try adjusting your filters or using different keywords.",
    action: "Clear search",
    icon: "search",
  },
  {
    id: "empty-inbox",
    label: "Empty inbox",
    title: "Inbox zero",
    body:
      "You're all caught up. New messages will appear here as soon as conversations start coming in.",
    action: "Set notifications",
    icon: "inbox",
  },
  {
    id: "no-data",
    label: "No data",
    title: "No data yet",
    body:
      "There isn't enough activity to populate this view yet. Connect a source or wait for fresh events to arrive.",
    action: "Connect source",
    icon: "data",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    title: "Start your setup",
    body:
      "Complete a few quick steps to unlock the workspace. We'll guide you through the essentials from here.",
    action: "Begin onboarding",
    icon: "sparkles",
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

function renderIllustration(icon) {
  illustration.replaceChildren();

  const shell = document.createElement("div");
  shell.className = "icon-shell";

  const core = document.createElement("div");
  core.className = "icon-core";

  const glyph = document.createElement("div");
  glyph.className = `glyph glyph-${icon}`;

  illustration.append(shell, core, glyph);
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
  renderIllustration(scenario.icon);
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
