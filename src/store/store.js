import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/ordersSlice";
import productsReducer from "./slices/productsSlice";

// load reads saved json from this browser. bad or missing data returns null so
// the app can still start with its normal empty state.
const load = (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } };
// older saved cart items may have numeric ids. converting them to strings
// keeps id comparisons consistent after the app reloads.
const migrateCollection = (value) => value && ({ ...value, items: (value.items || []).map((item) => ({ ...item, id: String(item.id) })) });
// configurestore combines each feature slice under one top-level state key.
// only cart and wishlist need initial values from localstorage here.
export const store = configureStore({
  reducer: { products: productsReducer, cart: cartReducer, wishlist: wishlistReducer, auth: authReducer, orders: ordersReducer },
  preloadedState: { cart: migrateCollection(load("rcverse-cart")) || undefined, wishlist: migrateCollection(load("rcverse-wishlist")) || undefined },
});
// subscribe runs after every redux action, then copies persistent collections
// and the current mock user into localstorage for the next page visit.
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem("rcverse-cart", JSON.stringify(state.cart));
    localStorage.setItem("rcverse-wishlist", JSON.stringify(state.wishlist));
    if (state.auth.user) localStorage.setItem("rcverse-user", JSON.stringify(state.auth.user));
    else localStorage.removeItem("rcverse-user");
  } catch { /* storage may be unavailable; state remains active in memory */ }
});
