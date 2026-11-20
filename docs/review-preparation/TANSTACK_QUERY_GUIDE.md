# TanStack Query guide

TanStack Query manages asynchronous, cacheable data. Redux in RCVERSE holds client choices (cart, wishlist and comparison); products are a catalogue request and are loaded with Query. The product service currently returns local mock data after a short delay, giving the UI the same loading boundary as a future API.

In `src/main.jsx`, a `QueryClient` is configured with a one-minute `staleTime` and one retry, then passed to `QueryClientProvider`. In `src/App.jsx`, `Catalogue` calls `useQuery({ queryKey: ["products"], queryFn: getProducts })`. The query key names the cache entry; the query function is `getProducts` from `src/services/productService.js`.

The component uses `isLoading` for an inventory loading state, `isError` and `refetch` for retry, and `data` for filtering and display. Query caches the result and serves it to later consumers until stale; focus/reconnection can trigger refetches according to library defaults. There is no mutation API call in this frontend demo, so a `useMutation` / invalidation example is not present. When a real admin product mutation is introduced, use a mutation and invalidate `['products']` after success.

The service is intentionally local and does not use Axios. Axios is useful when a real HTTP API exists; adding it now would not improve this mock.
