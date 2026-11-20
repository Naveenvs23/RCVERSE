import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/ordersSlice";
import productsReducer from "./slices/productsSlice";

const load = (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } };
const migrateCollection = (value) => value && ({ ...value, items: (value.items || []).map((item) => ({ ...item, id: String(item.id) })) });
export const store = configureStore({
  reducer: { products: productsReducer, cart: cartReducer, wishlist: wishlistReducer, auth: authReducer, orders: ordersReducer },
  preloadedState: { cart: migrateCollection(load("rcverse-cart")) || undefined, wishlist: migrateCollection(load("rcverse-wishlist")) || undefined },
});
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem("rcverse-cart", JSON.stringify(state.cart));
    localStorage.setItem("rcverse-wishlist", JSON.stringify(state.wishlist));
    if (state.auth.user) localStorage.setItem("rcverse-user", JSON.stringify(state.auth.user));
    else localStorage.removeItem("rcverse-user");
  } catch { /* storage may be unavailable; state remains active in memory */ }
});
