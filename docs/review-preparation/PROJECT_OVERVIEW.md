# RCVERSE project overview

RCVERSE is a frontend-only storefront for RC vehicles, components and workshop gear. The app is a React 19 + Vite JavaScript single-page application. It uses React Router for pages, Redux Toolkit for persistent cart, wishlist and comparison state, and TanStack Query for the asynchronous product catalogue.

## Current features

- Motorsport styled responsive storefront, category entry points and featured inventory.
- Search, category and price filters, and sorting by price, rating or newest.
- Product details with ratings, inventory, specification rows and related products.
- Cart quantity controls, removal, clearing, subtotal and simulated shipping.
- Wishlist and comparison (up to four items), saved in localStorage.
- Compatibility finder based on scale and component category.
- Demo checkout with required-field validation and an order confirmation; no payment is taken.
- Demo login, registration and protected account page; only profile details are held in session storage or, when selected, local storage.
- Separate shipping, simulated payment and confirmation steps for UPI, card, net banking and cash on delivery.
- Unknown routes show a 404 recovery page.

## Architecture and flow

`src/main.jsx` creates the Redux store and TanStack Query client and wraps the app in their providers. `src/App.jsx` declares routes and page-level UI. Product definitions live in `src/data/products.js`; `src/services/productService.js` simulates an asynchronous inventory request. The catalogue's `useQuery` caches that response. Product actions dispatch Redux slice actions, and the store subscription writes cart, wishlist and comparison state to localStorage.

## Stack

React, JavaScript, Vite, React Router DOM, Redux Toolkit, React Redux, TanStack Query, Lucide React and CSS. There is no backend, real payment provider or Axios request in this demo.

## User flow

Home → catalogue or search → product details → add to cart / wishlist / comparison → review cart → shipping → simulated payment → confirmation. Compatibility is available from the main navigation. Browser storage retains the three shopping collections after refresh.
