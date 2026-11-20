# RCVERSE

RCVERSE is a React storefront for radio-controlled cars, spare parts, tools and upgrades. It was built as a course and internship project to practice React, Redux Toolkit, routing, API services and a mock e-commerce workflow.

> This is an educational demo. Authentication is not secure for real accounts and checkout does not process real payments.

## Features

- Product catalogue loaded from JSON Server, with category filtering, search, price sorting and pagination.
- Product details, image galleries, specifications and related products.
- Search suggestions for product names, plus search across product details such as brand, category, SKU, description, tags and specifications.
- Cart and wishlist state stored in the browser's local storage.
- Mock registration and login against the local JSON Server database.
- Demo checkout, order history, order details and delivery tracking. Orders are stored in JSON Server.
- Responsive layout with persistent dark and light theme selection.

## Tech stack

- React and Vite
- Redux Toolkit and React Redux
- React Router
- Axios
- JSON Server
- Lucide React icons
- ESLint

## Project structure

```text
rcverse/
├── docs/review-preparation/  Course review notes and study guides
├── public/images/products/   Local product photos and image source notes
├── scripts/                  Development runner and demo database seeder
├── src/components/           Shared UI and layout components
├── src/data/                 Product seed data and category definitions
├── src/pages/                Account, cart, checkout, orders and home screens
├── src/services/             Axios API and resource service functions
├── src/store/                Redux store and feature slices
├── src/styles/               Theme and storefront styles
├── src/utils/                Search and notification helpers
├── .env.example              Example Vite API URL configuration
├── package.json              Scripts and dependencies
└── vite.config.js             Vite and React Compiler configuration
```

`db.json` is local runtime data and is intentionally not committed. Product seed data lives in `src/data/products.js`; `npm run seed` generates a fresh `db.json` with the product catalogue, one demo user and an empty orders list.

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- npm

## Install and run

From the project directory:

```bash
npm ci
npm run seed
npm run dev:all
```

`npm run dev:all` runs JSON Server and Vite together. Open the Vite URL shown in the terminal; it is normally [http://localhost:5173](http://localhost:5173). The API is available at [http://localhost:3000](http://localhost:3000), with the product catalogue at `/products`.

To run the services in separate terminals instead:

```bash
npm run server
```

```bash
npm run dev
```

`npm run seed` replaces the local database with the clean demo data and clears existing mock users and orders. Do not run it if you need to keep local order history.

## Environment configuration

The app defaults to `http://localhost:3000` for the API. To override it, copy the example file and change `VITE_API_URL` to the JSON Server URL:

```bash
cp .env.example .env
```

Environment files other than `.env.example` are ignored by Git. Do not put real credentials or private keys in Vite environment variables; values prefixed with `VITE_` are included in the browser build.

## Demo authentication and payment

After seeding the database, the demo account is:

- Email: `alex@rcverse.demo`
- Password: `demo1234`

The mock auth service stores and compares demo passwords in the local JSON Server database as a learning example. It does not hash passwords or provide production security. Use only the seeded demo account or other fake test data; never enter real credentials or personal payment information. Payment selection is simulated, and no money is charged or card/UPI/bank details are processed.

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite frontend. |
| `npm run server` | Start JSON Server on port 3000. |
| `npm run dev:all` | Start frontend and API together. |
| `npm run seed` | Generate a clean local `db.json`. This resets mock orders and users. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create the production frontend build in `dist/`. |
| `npm run preview` | Preview the production build locally. |

There is no automated test script configured in `package.json` yet.

## Screenshots

Screenshots have not been added to this repository yet. Add approved captures under `docs/screenshots/` and link them here when available.

## Product image credits

Product image files and their source pages are documented in [`public/images/products/SOURCES.md`](public/images/products/SOURCES.md). Review each source's terms and obtain any required permission before redistribution or commercial use.
