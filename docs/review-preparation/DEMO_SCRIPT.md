# RCVERSE demo script

## Five-minute walkthrough

1. **Home (30 sec):** Explain the RC specialist storefront and visual direction; use Explore Collection.
2. **Catalogue (60 sec):** Search for “ESC”, filter category/price and change sorting. Explain query loading and client-side derived filters.
3. **Product detail (45 sec):** Open an item, point out scale, specs, stock and quantity; add it to cart.
4. **Shared state (60 sec):** Toggle wishlist and compare on another card. Show header counts and both pages. Explain the Redux slices and localStorage.
5. **Cart and checkout (75 sec):** Change quantity, explain subtotal/shipping, continue to demo checkout, submit valid values and point out the no-payment confirmation.
6. **Wrap (30 sec):** State honestly that inventory is mock data and admin/full build configurator are future work.

## Ten-minute walkthrough

Use the five-minute flow, then add:

1. **Architecture (2 min):** Show `main.jsx` providers, `App.jsx` routes, `data/products.js`, and `productService.js`. Trace `useQuery` and explain the one-minute cache freshness setting.
2. **Comparison (1 min):** Add two different products, compare price/scale/motor/battery, remove one, clear the rest.
3. **Compatibility finder (1 min):** Choose scale and component category; describe it as a basic mock fitment filter that needs exact model and dimension checks.
4. **Persistence and responsive behavior (1 min):** Refresh after cart/wishlist changes, then narrow the viewport to show responsive navigation and product grid.
5. **Questions (remaining time):** Discuss Redux versus Query and outline how a real API mutation would invalidate the product query.

Use clearly fictitious checkout details during the demo. The form is local and does not send them anywhere.
