import { createSlice } from "@reduxjs/toolkit";
// cart starts empty unless the store restores a saved collection from the browser.
const initialState = { items: [] };
// each reducer describes one cart action. redux toolkit uses immer, so these
// draft-state edits produce a safe immutable update for redux subscribers.
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // add a new item or increase the existing quantity without exceeding stock.
    addToCart: (state, { payload }) => {
      const stock = Number.isFinite(Number(payload.stock))
        ? Number(payload.stock)
        : 99;
      if (stock < 1) return;
      const item = state.items.find((entry) => entry.id === payload.id);
      if (item) {
        item.quantity = Math.min(
          stock,
          item.quantity + (payload.quantity || 1),
        );
      } else
        state.items.push({
          ...payload,
          quantity: Math.min(stock, payload.quantity || 1),
        });
    },
    // clamp manual quantity changes between one and the product's available stock.
    updateQuantity: (state, { payload }) => {
      const item = state.items.find((entry) => entry.id === payload.id);
      if (item) {
        const stock = Number.isFinite(Number(item.stock))
          ? Number(item.stock)
          : 99;
        if (stock < 1)
          state.items = state.items.filter((entry) => entry.id !== payload.id);
        else
          item.quantity = Math.max(
            1,
            Math.min(stock, Number(payload.quantity) || 1),
          );
      }
    },
    // filter creates a new list without the matching product id.
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((item) => item.id !== payload);
    },
    // the step buttons use the same stock limit as the quantity input.
    increaseQuantity: (state, { payload }) => {
      const item = state.items.find((entry) => entry.id === payload);
      if (item) {
        const stock = Number.isFinite(Number(item.stock))
          ? Number(item.stock)
          : 99;
        if (stock < 1)
          state.items = state.items.filter((entry) => entry.id !== payload);
        else item.quantity = Math.min(stock, item.quantity + 1);
      }
    },
    decreaseQuantity: (state, { payload }) => {
      const item = state.items.find((entry) => entry.id === payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});
export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
