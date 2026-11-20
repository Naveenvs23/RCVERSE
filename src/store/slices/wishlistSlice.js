import { createSlice } from "@reduxjs/toolkit";
const wishlistSlice = createSlice({ name: "wishlist", initialState: { items: [] }, reducers: {
  toggleWishlist: (state, { payload }) => { const index = state.items.findIndex((item) => item.id === payload.id); index >= 0 ? state.items.splice(index, 1) : state.items.push(payload); },
  removeWishlist: (state, { payload }) => { state.items = state.items.filter((item) => item.id !== payload); },
  clearWishlist: (state) => { state.items = []; },
} });
export const { toggleWishlist, removeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
