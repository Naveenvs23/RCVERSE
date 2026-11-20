# Redux Toolkit guide

Redux stores app-wide client state in one predictable store. RCVERSE uses it for cart, wishlist and comparison because these collections are needed by multiple routes and should survive refreshes. The catalogue is query/server-like data, so it is managed separately by TanStack Query.

`src/store/store.js` calls `configureStore` with three reducers. A slice in `src/store/slices/` is created with `createSlice`: it contains a slice name, initial state and reducer functions. Toolkit uses Immer, so reducers may write concise mutation-like code while producing immutable state updates. Calling a reducer creates an action creator such as `addToCart(product)`.

React reads state with `useSelector((state) => state.cart.items)` and changes it with `useDispatch()`. A product button dispatches an action → Redux runs that slice reducer → the store updates → subscribed React components render updated counts and rows. A store subscription persists the three slices under `rcverse-cart`, `rcverse-wishlist`, and `rcverse-compare` in localStorage. Initial state is rehydrated safely when the store is created.

## Slice responsibilities

- `cartSlice.js`: add, increase/decrease quantity, remove and clear. Repeated adds increment quantity.
- `wishlistSlice.js`: toggle, remove and clear saved products.
- `compareSlice.js`: toggle, remove and clear products; the limit is four.

## Cart example

`ProductCard` dispatches `addToCart(product)`. The reducer finds an existing id and increments its quantity, or inserts a copy with quantity 1. Header derives the total unit count; Cart derives line totals and the subtotal from those same items. Quantity controls dispatch `increaseQuantity` or `decreaseQuantity`.

## Review points

Reducers must remain synchronous and predictable. For asynchronous remote work use thunks or a data fetching tool such as TanStack Query. `configureStore` includes useful defaults such as Redux DevTools integration and thunk middleware. State is persisted here with a small subscription; production apps may choose a persistence library and validate old stored data.
