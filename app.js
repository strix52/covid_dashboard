const METRICS = {
  cases: { key: "cases", label: "Reported cases", short: "Cases", color: "var(--accent)" },
  deaths: { key: "deaths", label: "Recorded deaths", short: "Deaths", color: "var(--coral)" },
  vaccinations: { key: "vaccinations", label: "Vaccine doses", short: "Vaccines", color: "var(--teal)" },
};

const CHAPTERS = {
  2020: { title: "The first year", copy: "A novel outbreak became a global emergency. The lines began their long climb, and the archive began to take shape." },
  2021: { title: "Vaccination at scale", copy: "Vaccination campaigns changed the texture of the record. Access, uptake, and supply remained uneven across places." },
  2022: { title: "A changing curve", copy: "Reported totals continued to rise as waves moved across regions. The meaning of a reported case increasingly depended on local testing and reporting." },
  2023: { title: "The long tail", copy: "The global curves flattened, but did not stop. Reporting systems and public attention shifted, changing what was visible in the data." },
  2024: { title: "An archive, not an ending", copy: "This local view stops here by design. It preserves a readable record rather than pretending that one chart can contain the full history." },
};

const state = { data: null, location: "World", metric: "cases", year: "2020" };
const formatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const exactFormatter = new Intl.NumberFormat("en");
const dateFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" });

const elements = {
  range: document.querySelector("#archive-range"),
  summary: document.querySelector("#global-summary"),
  select: document.querySelector("#location-select"),
  metricButtons: [...document.querySelectorAll(".metric-button")],
  chart: document.querySelector("#trend-chart"),
  chartTitle: document.querySelector("#chart-title"),
  chartKicker: document.querySelector("#chart-kicker"),
  chartValue: document.querySelector("#chart-value"),
  chartStatus: document.querySelector("#chart-status"),
  insight: document.querySelector("#insight-list"),
  insightTitle: document.querySelector("#insight-title"),
  insightNote: document.querySelector("#insight-note"),
  sourceLink: document.querySelector("#source-link"),
  footerRange: document.querySelector("#footer-range"),
  yearButtons: [...document.querySelectorAll(".year-button")],
  chapterNumber: document.querySelector("#chapter-number"),
  chapterTitle: document.querySelector("#chapter-title"),
  chapterCopy: document.querySelector("#chapter-copy"),
  chapterCases: document.querySelector("#chapter-cases"),
  chapterDeaths: document.querySelector("#chapter-deaths"),
};

hydrateFromUrl();
bindEvents();
loadArchive();

async function loadArchive() {
  try {
    const response = await fetch("data/archive-data.json");
    if (!response.ok) throw new Error(`Archive data request failed (${response.status})`);
    state.data = await response.json();
    renderAll();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  } catch (error) {
    elements.chartStatus.textContent = "The local archive could not be loaded. Try refreshing the page.";
    elements.summary.setAttribute("aria-busy", "false");
    console.error(error);
  }
}

function bindEvents() {
  elements.select.addEventListener("change", (event) => {
    state.location = event.target.value;
    updateUrl();
    renderExplorer();
  });

  elements.metricButtons.forEach((button) => button.addEventListener("click", () => {
    state.metric = button.dataset.metric;
    updateUrl();
    renderExplorer();
  }));

  elements.yearButtons.forEach((button) => button.addEventListener("click", () => {
    state.year = button.dataset.year;
    renderChapter();
  }));

  window.addEventListener("popstate", () => {
    hydrateFromUrl();
    if (state.data) renderAll();
  });
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (METRICS[params.get("metric")]) state.metric = params.get("metric");
  if (params.get("place")) state.location = params.get("place");
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("place", state.location);
  url.searchParams.set("metric", state.metric);
  history.pushState(null, "", url);
}

function renderAll() {
  const { meta, locations } = state.data;
  if (!locations[state.location]) state.location = "World";
  elements.range.textContent = meta.archiveRange.replace("January 2020 – ", "2020 — ");
  elements.footerRange.textContent = `Local snapshot · ${meta.archiveRange}`;
  elements.sourceLink.href = meta.sourceUrl;
  elements.sourceLink.textContent = meta.source;
  elements.select.innerHTML = Object.keys(locations).map((location) => `<option value="${location}">${location}</option>`).join("");
  elements.select.value = state.location;
  renderSummary();
  renderExplorer();
  renderChapter();
}

function renderSummary() {
  const rows = state.data.locations.World;
  const cases = latestFor(rows, "cases");
  const deaths = latestFor(rows, "deaths");
  const vaccinations = latestFor(rows, "vaccinations");
  elements.summary.innerHTML = [
    ["Reported cases", cases, "Worldwide through the archive end", "metric-card metric-card-featured"],
    ["Recorded deaths", deaths, "Worldwide through the archive end", "metric-card"],
    ["Vaccine doses", vaccinations, `Last reported total · ${formatDate(vaccinations.date)}`, "metric-card"],
  ].map(([label, value, caption, className]) => `<article class="${className}"><p>${label}</p><strong>${formatCompact(value.value)}</strong><span>${caption}</span></article>`).join("");
  elements.summary.setAttribute("aria-busy", "false");
}

function renderExplorer() {
  const metric = METRICS[state.metric];
  const rows = state.data.locations[state.location];
  const latest = latestFor(rows, metric.key);
  const start = firstFor(rows, metric.key);
  elements.metricButtons.forEach((button) => {
    const active = button.dataset.metric === state.metric;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.chartKicker.textContent = state.location;
  elements.chartTitle.textContent = `${metric.label} over time`;
  elements.chartValue.textContent = formatCompact(latest.value);
  elements.chart.setAttribute("aria-label", `${metric.label} in ${state.location}, from ${formatDate(start.date)} to ${formatDate(latest.date)}. Latest value: ${formatExact(latest.value)}.`);
  elements.chartStatus.textContent = `Showing ${metric.label.toLowerCase()} for ${state.location}, ending ${formatDate(latest.date)}.`;
  renderChart(rows, metric.key);

  const cases = latestFor(rows, "cases");
  const deaths = latestFor(rows, "deaths");
  const population = latest.population ?? rows.at(-1).population;
  const perMillion = population && latest.value ? Math.round((latest.value / population) * 1_000_000) : null;
  elements.insightTitle.textContent = `${state.location} at a glance`;
  elements.insight.innerHTML = [
    ["Archive endpoint", formatDate(latest.date)],
    ["Reported cases", formatExact(cases.value)],
    ["Recorded deaths", formatExact(deaths.value)],
    [`${metric.short} per million`, perMillion ? formatExact(perMillion) : "Not available"],
  ].map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join("");
  elements.insightNote.textContent = state.data.meta.note;
}

function renderChart(rows, key) {
  const points = rows.filter((row) => Number.isFinite(row[key]) && (key !== "vaccinations" || row[key] > 0));
  const width = 1000;
  const height = 420;
  const pad = { top: 36, right: 28, bottom: 62, left: 40 };
  const values = points.map((row) => row[key]);
  const max = Math.max(...values, 1);
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const coordinate = (row, index) => ({
    x: pad.left + (index / Math.max(points.length - 1, 1)) * chartWidth,
    y: pad.top + (1 - row[key] / max) * chartHeight,
  });
  const coords = points.map(coordinate);
  const line = coords.map(({ x, y }, index) => `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L ${coords.at(-1).x.toFixed(2)},${(height - pad.bottom).toFixed(2)} L ${coords[0].x.toFixed(2)},${(height - pad.bottom).toFixed(2)} Z`;
  const grid = [0, .25, .5, .75, 1].map((fraction) => {
    const y = pad.top + (1 - fraction) * chartHeight;
    return `<line class="grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}"><title>${formatCompact(max * fraction)}</title></line><text x="${pad.left}" y="${y - 10}">${formatCompact(max * fraction)}</text>`;
  }).join("");
  const labels = ["2020", "2021", "2022", "2023", "2024"].map((year) => {
    const matching = points.findIndex((row) => row.date.startsWith(year));
    const x = matching < 0 ? pad.left : coords[matching].x;
    return `<text x="${x}" y="${height - 18}" text-anchor="middle">${year}</text>`;
  }).join("");
  const last = coords.at(-1);
  elements.chart.innerHTML = `<defs><linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="currentColor" stop-opacity=".24"/><stop offset="100%" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><g>${grid}</g><g>${labels}</g><path class="area-path" d="${area}" style="color:${METRICS[state.metric].color}"></path><path class="line-path" d="${line}" style="stroke:${METRICS[state.metric].color}"></path><circle class="end-dot" cx="${last.x}" cy="${last.y}" r="9" style="stroke:${METRICS[state.metric].color}"></circle>`;
}

function renderChapter() {
  const index = Object.keys(CHAPTERS).indexOf(state.year);
  const chapter = CHAPTERS[state.year];
  const rows = state.data.locations.World;
  const row = rows.filter((item) => item.date.startsWith(state.year)).at(-1);
  elements.yearButtons.forEach((button) => {
    const active = button.dataset.year === state.year;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.chapterNumber.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
  elements.chapterTitle.textContent = chapter.title;
  elements.chapterCopy.textContent = chapter.copy;
  elements.chapterCases.textContent = formatCompact(row.cases);
  elements.chapterDeaths.textContent = formatCompact(row.deaths);
}

function latestFor(rows, key) {
  const value = [...rows].reverse().find((row) => Number.isFinite(row[key]) && (key !== "vaccinations" || row[key] > 0));
  return { value: value?.[key] ?? null, date: value?.date ?? rows.at(-1).date, population: value?.population };
}

function firstFor(rows, key) {
  const value = rows.find((row) => Number.isFinite(row[key]) && (key !== "vaccinations" || row[key] > 0));
  return { value: value?.[key] ?? 0, date: value?.date ?? rows[0].date };
}

function formatCompact(value) { return Number.isFinite(value) ? formatter.format(value) : "Not available"; }
function formatExact(value) { return Number.isFinite(value) ? exactFormatter.format(Math.round(value)) : "Not available"; }
function formatDate(date) { return dateFormatter.format(new Date(`${date}T00:00:00Z`)); }
