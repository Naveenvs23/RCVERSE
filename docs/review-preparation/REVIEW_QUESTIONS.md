# Internship review questions and answers

## React

1. **What is React?** A JavaScript library for building interfaces from components.
2. **What is a component?** A reusable function that returns UI; `ProductCard` is one.
3. **What is JSX?** Syntax that lets JavaScript describe element trees.
4. **What are props?** Inputs passed from a parent; `ProductCard` receives `product`.
5. **What is state?** Data that changes over time and affects rendering.
6. **What does `useState` do?** Holds local component state, such as the selected sort.
7. **What is `useSelector`?** Reads a value from the Redux store.
8. **What is `useDispatch`?** Returns the function used to dispatch Redux actions.
9. **What is a controlled input?** An input whose displayed value comes from React state, as in header search.
10. **Why use keys in lists?** They help React match list items between renders; cards use product ids.
11. **When does React render again?** When relevant state, props or subscribed external-store values change.
12. **What is conditional rendering?** Choosing UI based on state, such as empty cart versus cart rows.
13. **What is an effect?** Work synchronized with an external system; this app has no custom `useEffect` currently.
14. **Why avoid unnecessary effects?** Derived values can be calculated during render without synchronization bugs.
15. **What is lifting state?** Moving shared state to a common owner; broader RCVERSE state lives in Redux.
16. **What is Context?** A way to pass shared values through a tree; Redux and Query providers use it internally.
17. **How is quantity selected on detail?** Local `useState`, then repeated cart dispatches on add.

## Routing

18. **What does React Router do?** Maps browser paths to page components without full reloads.
19. **What is `BrowserRouter`?** Enables history-based routing.
20. **What is a dynamic route?** A route parameter such as `/products/:id`.
21. **How is the id read?** `useParams()` in `ProductDetail`.
22. **Link versus anchor?** `Link` navigates within the SPA; an anchor can reload the document.
23. **What is the wildcard route?** The `*` route that renders the not-found page.

## Redux Toolkit

24. **Why Redux here?** Cart, wishlist and compare are shared across multiple pages.
25. **What is a store?** The central object holding reducer-managed application state.
26. **What is a slice?** A named section of state with reducers and generated actions.
27. **What does `createSlice` provide?** Reducer composition and action creators from reducer definitions.
28. **What does `configureStore` do?** Combines reducers and configures useful Redux defaults.
29. **What is an action?** A description of an event, for example `addToCart(product)`.
30. **What is a reducer?** A function that calculates the next state from current state and action.
31. **Why can Toolkit reducers look mutable?** Immer records those edits and creates immutable updates.
32. **How does cart add work?** Increment same-id quantity or append an item with quantity one.
33. **How does the header count work?** It sums every cart item quantity with `useSelector`.
34. **How does persistence work?** Store initialization reads localStorage; subscription writes updates.
35. **What is a selector?** A function that reads or derives store data.
36. **Why cap compare to four?** To keep the comparison interface readable and bounded.
37. **Should reducers call APIs?** No; keep reducers synchronous and side effects separate.
38. **How could persistence be improved?** Validate/version stored data or use a persistence library.

## TanStack Query and services

39. **What is TanStack Query?** A library for fetching, caching and synchronizing asynchronous data.
40. **What is server state?** Data owned by a remote service; the mock catalogue represents it.
41. **What is client state?** Local user choices such as cart contents.
42. **What is QueryClient?** The object holding query cache and default behavior.
43. **What does the provider do?** Makes the client available to `useQuery` below it.
44. **What is a query key?** A stable cache identity; here it is `['products']`.
45. **What is `queryFn`?** The function that loads data; here `getProducts`.
46. **What is `staleTime`?** How long cached data is considered fresh; configured to one minute.
47. **How is loading handled?** `isLoading` displays inventory loading UI.
48. **How is an error handled?** `isError` offers a retry via `refetch`.
49. **What is invalidation?** Marking cached data stale after a successful change; no server mutation exists yet.
50. **Why no Axios?** There is no HTTP API in this frontend mock, so a local service suffices.
51. **Where would `useMutation` fit?** A future admin create/update/delete request, followed by invalidating products.

## Project scenarios

52. **Trace Add to Cart.** Card click → action dispatch → slice reducer → store update → subscribed UI updates → localStorage write.
53. **How are filters applied?** The catalogue derives a new array based on search, category and max price, then sorts it.
54. **What does compatibility guarantee?** Only a basic scale/category match; users must verify dimensions.
55. **Is checkout real?** No. It validates form fields and simulates an order locally, with no payment.
56. **How would you connect a backend?** Replace mock service with HTTP calls, preserve the query key, add request/error types and mutations.
57. **How would you test cart behavior?** Unit-test reducers and add component/integration tests for action-to-UI flows.
58. **What does responsive design rely on?** CSS grid/flex layouts and breakpoints in `App.css` and `Header.css`.
59. **What is intentionally unfinished?** Admin CRUD and a true interactive custom build configurator.
60. **What would you improve next?** Add tests, robust compatibility data, then admin CRUD and build configurator.
61. **Is login backed by a server?** No. It creates a local demo profile only.
62. **Where is the demo password saved?** Nowhere; passwords are not retained.
63. **What does Remember me do?** It saves only the demo profile in localStorage; otherwise it uses sessionStorage.
64. **Is payment real?** No. UPI, card, net banking and COD produce mock outcomes only.
65. **Are card details saved?** No. Fields remain in component memory and are never sent.
66. **When does checkout clear cart state?** Only after simulated order success; failure leaves the cart intact.
