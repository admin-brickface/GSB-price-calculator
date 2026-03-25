# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Internal pricing calculator for Garden State Brickface and Siding (GSB). Sales reps use this during appointments to calculate estimates for customers. Each service type has its own tab with measurement input tables, price lookups, and a tiered discount calculation (1 Year -> 30 Day -> Day of -> Final Sell Price).

## Commands

- `npm start` - Dev server on localhost:3000
- `npm run build` - Production build
- `npm test` - Run tests (Jest/React Testing Library)

## Architecture

Create React App project with React 19. No router - single-page tabbed interface.

**App.js** - Root component. Manages tab state (`activeTab`) and customer info (name, address, sales rep). Uses `html2canvas` to export the active tab as a JPEG image. The `contentRef` wraps the main content area for screenshot capture.

**Tab components** (in `src/components/`):
- **GuttersAndLeaders.js** - Gutters, leaders, gutter guards. Three Handsontable grids organized by house side (Front/Right/Back/Left). Dropdown selects product type, numeric input for linear feet. Price tables auto-calculate from grid data.
- **StoneVeneers.js** - Stone flats (SF), corners (LF), sills (LF), outs. Four Handsontable grids. Additional manual-input tables for demolition, debris removal, and miscellaneous items. Includes $222 delivery fee.
- **StuccoPainting.jsx** - Walls measurement only (incomplete). Uses ref-based Handsontable with formulas for gables (x0.5) and dormers (x75sf). Divides by 144 to convert sq inches to sq ft.
- **StuccoPainting.js** - Newer version, also incomplete. Similar wall measurements but different data structure.
- **HousePainting.js** - Most complex tab. Walls + 6 trim tables (window trim, door trim, soffit, fascia, entry doors, garage doors). Radio-style checkbox for wall type selection. Includes rules/guidelines section.

**Key library: Handsontable** (`@handsontable/react`) - Spreadsheet-like grid component used for all measurement input tables. Registered globally in `index.js`. Uses `non-commercial-and-evaluation` license key.

## Pricing Logic

All tabs share the same discount cascade:
1. **1 Year Price** = subtotal (+ delivery fee for stone veneers)
2. **30 Day Price** = 1 Year Price - 10%
3. **Day of Price** = 30 Day Price - 10%
4. **Final Sell Price** = Day of Price - 3% (for 33% deposit)

Prices per unit are hardcoded in component state arrays (e.g., `gutterTypes`, `leaderTypes`). When prices change, update these arrays directly in the component files.

## Unused Files

- `StuccoPainting.jsx` - older ref-based version, unused. The `.js` version is what gets imported.
- `App_old.js` - backup of a previous App version, not imported anywhere.

## Notes

- StuccoPainting (.js) is incomplete compared to the other tabs (no price tables or project calculation section yet)
- Stone Veneers recalculates the full subtotal inline in every project calculation row rather than using a shared variable
