import { readFile } from "node:fs/promises";

const ARCHIVE_PATH = new URL("../data/archive-data.json", import.meta.url);
const requiredLocations = [
  "World",
  "India",
  "United States",
  "Brazil",
  "United Kingdom",
  "Germany",
  "Japan",
  "South Africa",
  "Australia"
];

const archive = JSON.parse(await readFile(ARCHIVE_PATH, "utf8"));
const fail = (message) => {
  console.error(`Archive validation failed: ${message}`);
  process.exitCode = 1;
};

if (archive.meta?.archiveEnd !== "2024-12-31") fail("archive end must be 2024-12-31");

for (const location of requiredLocations) {
  const rows = archive.locations?.[location];
  if (!Array.isArray(rows) || rows.length !== 60) {
    fail(`${location} must contain 60 monthly observations`);
    continue;
  }

  if (rows[0].date !== "2020-01-31" || rows.at(-1).date !== "2024-12-31") {
    fail(`${location} has an unexpected archive range`);
  }

  if (!rows.every((row) => Number.isFinite(row.cases) && Number.isFinite(row.deaths) && Number.isFinite(row.population))) {
    fail(`${location} contains non-numeric core values`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`Archive verified: ${requiredLocations.length} locations × 60 monthly observations.`);
