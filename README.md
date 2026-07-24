# COVID-19 Dashboard

An archival website for reported COVID-19 data from 2020 through 2024.

![COVID-19 Dashboard archival interface](assets/archive-mark.svg)

## What this is

The original Streamlit showcase is gone. This version is a static website with no runtime packages, server process, or live counter.

It keeps the original purpose: make COVID-19 data easier to inspect. The site is now an archive, with a clear end date and local data files.

## What it includes

- A local monthly snapshot for the world and nine country views.
- Country charts for reported cases, recorded deaths, and vaccine doses.
- A 60-month world map. Press play to watch the archive move through early spread, vaccination, and later waves.
- Light and dark themes, keyboard support, high-contrast support, and reduced motion support.
- An offline cache for the static site.

## Data and limitations

The figures come from the [Our World in Data COVID-19 dataset](https://ourworldindata.org/coronavirus), which brings together official reporting including World Health Organization data. The map uses [Natural Earth](https://www.naturalearthdata.com/downloads/) country outlines. Natural Earth data is public domain; the COVID data is available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The archive stops at December 2024. Reported cases and deaths depend on testing, reporting, and later revisions. They are not a complete measure of the pandemic’s impact.

To refresh the local snapshot, run:

```sh
node scripts/build-archive-data.mjs
```

The country-chart generator retains monthly observations for the locations in `scripts/build-archive-data.mjs`.

To rebuild the world map archive, run:

```sh
node scripts/build-map-archive.mjs
```

This generator writes a local 60-month timeline and vector country outlines to `data/`.

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
├── data/map-archive-data.json   # Monthly country-level map timeline
├── data/world-map.json          # Natural Earth country geometry
├── scripts/build-archive-data.mjs
├── scripts/build-map-archive.mjs
├── index.html                   # Semantic application shell
├── app.js                       # Rendering and interaction logic
├── styles.css                   # Responsive, themed design system
├── manifest.webmanifest
└── sw.js                         # Offline shell cache
```

## Design

The interface is an original web design informed by Apple Human Interface Guidelines: system typography, clear hierarchy, restrained color, direct controls, and support for system appearance and accessibility settings. It is not affiliated with Apple.

## License

The application source is available under the [MIT License](LICENSE). Attribution for the included data belongs to Our World in Data and its underlying sources.
