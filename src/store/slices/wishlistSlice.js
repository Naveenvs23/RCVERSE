import { createSlice } from "@reduxjs/toolkit";
// wishlist state uses product objects so the saved product cards can render
// immediately without requesting each product again.
const wishlistSlice = createSlice({ name: "wishlist", initialState: { items: [] }, reducers: {
  // clicking a heart adds the product, or removes it when it is already saved.
  toggleWishlist: (state, { payload }) => { const index = state.items.findIndex((item) => item.id === payload.id); index >= 0 ? state.items.splice(index, 1) : state.items.push(payload); },
  removeWishlist: (state, { payload }) => { state.items = state.items.filter((item) => item.id !== payload); },
  clearWishlist: (state) => { state.items = []; },
} });
export const { toggleWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
