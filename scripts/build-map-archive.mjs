import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { mkdir, writeFile } from "node:fs/promises";

const COVID_SOURCE = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv";
const MAP_SOURCE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const ARCHIVE_START = "2020-01";
const ARCHIVE_END = "2024-12";
const DATA_DIRECTORY = new URL("../data/", import.meta.url);

const [covidResponse, mapResponse] = await Promise.all([fetch(COVID_SOURCE), fetch(MAP_SOURCE)]);
if (!covidResponse.ok || !covidResponse.body) throw new Error(`Unable to download COVID data: ${covidResponse.status}`);
if (!mapResponse.ok) throw new Error(`Unable to download map data: ${mapResponse.status}`);

const geojson = await mapResponse.json();
const countries = geojson.features
  .map((feature) => ({
    id: feature.properties.ADM0_A3,
    name: feature.properties.NAME_EN || feature.properties.ADMIN,
    geometry: feature.geometry,
  }))
  .filter((country) => country.id && country.id !== "-99" && country.geometry);
const supportedIds = new Set(countries.map((country) => country.id));

const countryMonths = new Map();
let indexes;
const reader = createInterface({ input: Readable.fromWeb(covidResponse.body) });
for await (const line of reader) {
  if (!indexes) {
    indexes = Object.fromEntries(line.split(",").map((header, index) => [header, index]));
    continue;
  }

  const values = line.split(",");
  const id = values[indexes.iso_code];
  const date = values[indexes.date];
  if (!supportedIds.has(id) || !date || date.slice(0, 7) < ARCHIVE_START || date.slice(0, 7) > ARCHIVE_END) continue;

  const month = date.slice(0, 7);
  if (!countryMonths.has(id)) countryMonths.set(id, new Map());
  countryMonths.get(id).set(month, {
    cases: numberOrNull(values[indexes.new_cases_smoothed_per_million]),
    vaccinations: numberOrNull(values[indexes.people_fully_vaccinated_per_hundred]),
  });
}

const months = calendarMonths(ARCHIVE_START, ARCHIVE_END);
const latestByCountry = new Map();
const frames = months.map((month) => {
  const cases = {};
  const vaccinations = {};
  for (const [id, valuesByMonth] of countryMonths) {
    const current = valuesByMonth.get(month);
    if (current) latestByCountry.set(id, current);
    const value = latestByCountry.get(id);
    if (Number.isFinite(value?.cases) && value.cases > 0) cases[id] = Math.round(value.cases * 10) / 10;
    if (Number.isFinite(value?.vaccinations) && value.vaccinations > 0) vaccinations[id] = Math.round(value.vaccinations * 10) / 10;
  }
  return { date: `${month}-01`, cases, vaccinations };
});

await mkdir(DATA_DIRECTORY, { recursive: true });
await writeFile(new URL("world-map.json", DATA_DIRECTORY), `${JSON.stringify({ countries })}\n`, "utf8");
await writeFile(new URL("map-archive-data.json", DATA_DIRECTORY), `${JSON.stringify({
  meta: {
    archiveRange: "January 2020 – December 2024",
    covidSource: COVID_SOURCE,
    mapSource: MAP_SOURCE,
    note: "Cases show the monthly latest seven-day average of reported new cases per million. Vaccination shows the share of people reported fully vaccinated.",
  },
  frames,
})}\n`, "utf8");

console.log(`Wrote ${countries.length} country shapes and ${frames.length} monthly frames.`);

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function calendarMonths(start, end) {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  const months = [];
  for (let year = startYear, month = startMonth; year < endYear || (year === endYear && month <= endMonth); month += 1) {
    if (month === 13) { year += 1; month = 1; }
    months.push(`${year}-${String(month).padStart(2, "0")}`);
  }
  return months;
}
