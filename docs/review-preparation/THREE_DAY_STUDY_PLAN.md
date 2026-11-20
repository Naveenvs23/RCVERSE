# Three-day study plan

## Day 1 — React, routes and structure

- Read `PROJECT_OVERVIEW.md`, then inspect `main.jsx`, `App.jsx`, `ProductCard.jsx` and the product data.
- Trace home → catalogue → product detail. Explain props, local state, URL parameters and links aloud.
- Exercise: add a temporary specification row to a product and find where it appears.
- Checkpoint: explain what happens when React state changes and why `Link` is used.

## Day 2 — Redux Toolkit and TanStack Query

- Read both library guides. Follow one cart dispatch and one wishlist toggle through reducer to header/UI.
- Inspect localStorage after adding an item, refresh, and confirm persistence.
- Follow the `['products']` query from `Catalogue` to `getProducts` and explain loading/error/caching.
- Exercise: explain how a future product mutation would invalidate the query cache.
- Checkpoint: clearly distinguish cart client state from catalogue query data.

## Day 3 — Demo rehearsal and review practice

- Read the walkthrough and demo script. Practice the five-minute version twice, then the ten-minute version.
- Answer the review questions aloud; focus on questions 24–56 and be honest about mock data and unimplemented admin/configurator work.
- Exercise: describe one limitation and a sensible next step without overstating readiness.
- Checkpoint: navigate through all routes and explain the main architecture without reading notes.
