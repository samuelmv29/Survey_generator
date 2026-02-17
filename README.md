# Survey Report Generator

A multi-page institutional survey report viewer and exporter, built with **vanilla HTML/CSS/JS** — zero runtime dependencies. Simulates a COACHE-style Faculty Climate & Satisfaction Survey with 25 report pages, interactive charts, sortable tables, and one-click offline export.

## Features

- **25 report pages** covering teaching, research, governance, compensation, DEI, trends, and more
- **SVG charts** (bar, horizontal bar, line, donut, gauge, Likert scale) — no Chart.js or D3 needed
- **Sortable data tables** with click-to-sort column headers
- **Sidebar navigation** with search filtering and bookmarks
- **Dark mode** toggle with localStorage persistence
- **Notes system** — add annotations to any section, saved in localStorage
- **Keyboard navigation** — left/right arrow keys to move between pages
- **One-click HTML export** — generates a self-contained static HTML file with all styles and SVG charts inlined
- **Print-friendly** — optimized `@media print` styles with page breaks
- **Fully offline** — works by opening `index.html` directly from the filesystem

## Quick Start

### Option A: Open directly (no server, no install)

Double-click `index.html` in your file explorer. That's it — the report loads with all 25 pages, charts, and export functionality. Works with Wi-Fi turned off.

### Option B: Development server (with Vite)

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000` with live reload.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. The build bundles and minifies all JS/CSS into optimized assets.

```bash
npm run preview    # preview the production build locally
```

## Offline Mode

This app is designed for true offline use:

1. **No CDN dependencies** — all chart rendering uses inline SVG via vanilla JS
2. **No build step required** — `index.html` loads scripts directly via `<script>` tags
3. **localStorage persistence** — bookmarks, notes, dark mode preference, and last-viewed page survive browser restarts
4. **Static HTML export** — the exported file is a single `.html` with all CSS inlined and all charts rendered as SVG

### Demo: Offline verification

1. Open `index.html` in a browser
2. Turn off Wi-Fi / disconnect from the internet
3. Navigate between pages, toggle dark mode, add bookmarks
4. Click **Export HTML** — the downloaded file opens in any browser, on any machine, with no server

## Packaging for CMS Upload

The exported HTML file is self-contained and ready for CMS upload:

1. Click **⬇ Export HTML** in the sidebar
2. The downloaded `Lakewood_Faculty_Survey_2025.html` contains:
   - All 25 pages rendered as static content
   - Table of contents with internal anchor links
   - All CSS inlined in a `<style>` block
   - All charts as inline SVG (no external images)
   - Print-optimized page breaks
3. Upload directly to any CMS, LMS, or static hosting

For the Vite production build (`dist/`), deploy the entire `dist/` folder to any static host (GitHub Pages, Netlify, S3, etc.).

## Project Structure

```
survey_report/
├── index.html              # Main SPA shell
├── package.json            # Vite dev/build config
├── vite.config.js          # Vite configuration
├── README.md               # This file
├── styles/
│   └── main.css            # All styles (sidebar, cards, charts, tables, print, dark mode)
└── js/
    ├── data.js             # 25 sections of COACHE-style survey data
    ├── storage.js          # localStorage wrapper (bookmarks, notes, settings)
    ├── charts.js           # SVG chart engine (bar, hbar, line, donut, gauge, likert)
    ├── tables.js           # Sortable HTML table generator
    ├── pages.js            # Page renderer — turns data into DOM
    ├── sidebar.js          # Sidebar navigation with search
    ├── router.js           # Hash-based SPA routing
    ├── export.js           # Static HTML export with CSS inlining
    └── app.js              # Initialization and event coordination
```

## Interview Demo Checklist

- [ ] Run locally by opening `index.html` — no server needed
- [ ] `npm install && npm run dev` — Vite dev server at localhost:3000
- [ ] Turn off Wi-Fi — everything still works (routing, charts, notes, export)
- [ ] Navigate 25 pages via sidebar, arrow keys, or prev/next buttons
- [ ] Sort any table by clicking column headers
- [ ] Toggle dark mode, add bookmarks, write notes — all persisted in localStorage
- [ ] Click **Export HTML** — download the full report as a single self-contained file
- [ ] Open the exported file in a fresh browser profile — all content renders with no server
- [ ] `npm run build` — inspect `dist/` and explain the bundled output
- [ ] Print any page or the full exported report — clean layout with page breaks

## Tech Decisions

| Choice | Rationale |
|--------|-----------|
| Vanilla JS (no React/Vue) | Zero build requirement for offline use; shows core JS proficiency |
| SVG charts (no Chart.js) | Self-contained, resolution-independent, works inline in export |
| Hash-based routing | Works with `file://` protocol; no server-side routing needed |
| localStorage | Simple persistence without IndexedDB complexity; survives page reloads |
| Vite (dev only) | Fast dev server + production bundler; zero config for vanilla projects |
| IIFE module pattern | Scripts work as regular `<script>` tags — no ES module CORS issues with `file://` |
