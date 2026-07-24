# COVID-19 Dashboard

An archival, static visual record of reported COVID-19 data from 2020 through 2024.

![COVID-19 Dashboard archival interface](assets/archive-mark.svg)

## Why this version exists

The original Streamlit showcase has been retired. This rebuild is a dependency-free web application: no Python runtime, no package lockfile, no server process, and no live counter pretending the pandemic is current news.

It keeps the title and the original intent—making COVID-19 data understandable—but reframes the project as an archive. The interface is designed around clarity, restraint, accessibility, and quiet exploration.

## What it includes

- A local monthly snapshot for the world plus India, the United States, Brazil, the United Kingdom, Germany, Japan, South Africa, and Australia.
- A three-lens explorer for cumulative reported cases, recorded deaths, and vaccine doses.
- Year-by-year contextual waypoints from 2020 to 2024.
- Light/dark system theming, reduced-motion support, high-contrast support, visible keyboard focus, semantic landmarks, a skip link, and 44px controls.
- A small service worker that caches the archive shell for offline revisiting.

## Data and limitations

The included snapshot is generated from the [Our World in Data COVID-19 dataset](https://ourworldindata.org/coronavirus), which brings together official reporting including World Health Organization data. It is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The archive intentionally stops at December 2024. Reported cases and deaths depend on changing testing, reporting, and revision practices; they are not a complete measure of the pandemic’s impact.

To refresh the local snapshot, run:

```sh
node scripts/build-archive-data.mjs
```

The generator downloads OWID’s documented compact COVID dataset and retains monthly observations only for the locations in `scripts/build-archive-data.mjs`.

## Run locally

No dependency installation is required. Serve the folder with any static web server, for example:

```sh
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Project structure

```text
.
├── data/archive-data.json       # Local 2020–2024 archive snapshot
├── scripts/build-archive-data.mjs
├── index.html                   # Semantic application shell
├── app.js                       # Rendering and interaction logic
├── styles.css                   # Responsive, themed design system
├── manifest.webmanifest
└── sw.js                         # Offline shell cache
```

## Design approach

The interface is an original web design guided by Apple Human Interface Guidelines principles and modern web accessibility guidance: system typography, a single interaction accent, layered surfaces, direct controls, generous touch targets, and respect for user motion, contrast, and color-scheme preferences. It is not affiliated with Apple.

## License

The application source is available under the [MIT License](LICENSE). Attribution for the included data belongs to Our World in Data and its underlying sources.
