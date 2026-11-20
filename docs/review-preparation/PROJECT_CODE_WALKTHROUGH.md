# RCVERSE code walkthrough

## Main files

- `index.html`: Vite document shell.
- `src/main.jsx`: React entry point, Redux Provider and QueryClientProvider.
- `src/App.jsx`: route table and page components: catalogue, detail, wishlist, compare, compatibility, checkout and 404.
- `src/data/products.js`: mock inventory and specifications; local image imports.
- `src/services/productService.js`: delayed asynchronous mock catalogue service.
- `src/components/layout/Header.jsx`: search, route navigation and live state counts.
- `src/components/ProductCard.jsx`: reusable product display and cart/wishlist/compare actions.
- `src/pages/Cart.jsx`: cart controls and totals.
- `src/pages/Account.jsx`: demo login/register forms and protected account page.
- `src/pages/CheckoutFlow.jsx`: shipping, simulated payment, totals and order confirmation screens.
- `src/store/slices/authSlice.js`: minimal demo session profile; passwords are never retained.
- `src/store/store.js` and `src/store/slices/`: shared state and persistence.
- `src/index.css`, `src/App.css`, page/component CSS: global and feature styling.

## Product loading

`main.jsx` creates the query client and provides it. `Catalogue` asks Query for key `['products']`. Query runs `getProducts`, which simulates a short request and returns the product data. The component shows loading/error UI, then filters and sorts the returned array for rendering.

## Cart path

Click Add to Cart in `ProductCard` → dispatch `addToCart(product)` → `cartSlice` increments an existing quantity or appends a quantity-one item → Redux notifies subscribers → Header count and Cart page redraw. `store.subscribe` writes the updated state to localStorage. On refresh, `store.js` attempts to load it back.

## Other flows

Wishlist and comparison use similar slice actions. Product detail gets the `id` from `useParams`, finds the mock product and renders its specs. Compatibility filters mock product scale and category and asks users to verify exact mounting dimensions. Shipping validates fields in the browser and carries them in route state to payment. Payment fields stay in component memory. A mock order is created and the cart is cleared only after simulated success. The confirmation uses route state, so refreshing that screen clears its order details. Nothing is transmitted to a server.

## Scope notes

The admin dashboard and full visual build configurator are not implemented. `/build` currently routes to the compatibility finder, so it is an entry to fitment assistance rather than a component configurator. Product inventory is mock data; the finder is a basic scale/category matcher and should not be treated as definitive engineering fitment advice. There is no backend, real account system, Axios client or real payment integration.
