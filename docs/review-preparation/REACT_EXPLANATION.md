# React explained through RCVERSE

## Components, props and rendering

Components are JavaScript functions that return JSX. `ProductCard` receives one product via props (`<ProductCard product={product} />`) and renders its image, price and action buttons. `Catalogue` maps the filtered product array to cards. When state or props change, React renders the affected UI again.

## State and hooks

`useState` stores state owned by one component. In `Catalogue`, `useState` stores selected category, sort order and price limit. In `ProductDetail`, it stores the quantity selector. `useSelector` reads shared Redux state; `useDispatch` sends actions. `useQuery` manages asynchronously loaded product data. This project currently does not need `useEffect`; persistence is handled by the store subscription and query lifecycle by TanStack Query.

## Routing

`BrowserRouter`, `Routes`, and `Route` are declared in `src/App.jsx`. `/products/:id` uses `useParams()` to find a product. `Link` and `NavLink` change routes without a full page reload, preserving the in-memory app. The wildcard route renders a not-found page.

## Context and providers

Provider components make shared services available below them. `Provider` from React Redux exposes the store. `QueryClientProvider` exposes the TanStack Query cache/client. React Context is the mechanism underneath these providers; RCVERSE does not create a custom Context.

## Examples to explain

1. `ProductCard` reads whether its item is saved with `useSelector`, then dispatches `toggleWishlist` when the heart is clicked.
2. `Catalogue` reads URL search parameters and local filter state, then derives a visible list without mutating source data.
3. `ProductDetail` reads the route id and renders the matching specifications.
4. The checkout form uses browser required and pattern validation before its submit handler empties the cart and shows a demo confirmation.
