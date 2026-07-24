import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { mkdir, writeFile } from "node:fs/promises";

const SOURCE_URL = "https://catalog.ourworldindata.org/garden/covid/latest/compact/compact.csv";
const OUTPUT_PATH = new URL("../data/archive-data.json", import.meta.url);
const ARCHIVE_END = "2024-12-31";
const LOCATIONS = [
  "World",
  "India",
  "United States",
  "Brazil",
  "United Kingdom",
  "Germany",
  "Japan",
  "South Africa",
  "Australia",
];

const response = await fetch(SOURCE_URL);
if (!response.ok || !response.body) {
  throw new Error(`Unable to download archive source: ${response.status} ${response.statusText}`);
}

const rows = Object.fromEntries(LOCATIONS.map((location) => [location, new Map()]));
let headerIndexes;

const reader = createInterface({ input: Readable.fromWeb(response.body) });
for await (const line of reader) {
  if (!headerIndexes) {
    const headers = line.split(",");
    headerIndexes = Object.fromEntries(headers.map((header, index) => [header, index]));
    continue;
  }

  const values = line.split(",");
  const location = values[headerIndexes.country];
  const date = values[headerIndexes.date];
  if (!rows[location] || !date || date > ARCHIVE_END || date < "2020-01-01") continue;

  const month = date.slice(0, 7);
  rows[location].set(month, {
    date,
    cases: numberOrNull(values[headerIndexes.total_cases]),
    deaths: numberOrNull(values[headerIndexes.total_deaths]),
    vaccinations: numberOrNull(values[headerIndexes.total_vaccinations]),
    fullyVaccinated: numberOrNull(values[headerIndexes.people_fully_vaccinated]),
    population: numberOrNull(values[headerIndexes.population]),
  });
}

const locations = Object.fromEntries(
  Object.entries(rows).map(([location, months]) => [location, [...months.values()]])
);
const world = locations.World;
const latestWorld = world.at(-1);

const payload = {
  meta: {
    title: "COVID-19 Dashboard",
    archiveRange: `January 2020 – ${formatMonth(latestWorld.date)}`,
    archiveEnd: ARCHIVE_END,
    source: "Our World in Data COVID-19 dataset",
    sourceUrl: SOURCE_URL,
    license: "CC BY 4.0 (source attribution required)",
    generatedAt: new Date().toISOString(),
    note: "This is an archival snapshot. Reported cases and deaths reflect source reporting practices and may be revised.",
  },
  locations,
  globalSummary: latestWorld,
};

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(payload)}\n`, "utf8");

console.log(`Wrote ${OUTPUT_PATH.pathname} with ${world.length} monthly global observations.`);

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}
