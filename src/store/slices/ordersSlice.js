import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getOrder,
  getOrderByNumber,
  getAllOrders,
  getOrders,
  placeOrder,
  updateOrder,
} from "../../services/orderService";

// these thunks keep network work outside components and return results to redux.
export const submitOrder = createAsyncThunk("orders/place", placeOrder);
export const fetchOrders = createAsyncThunk("orders/fetchForUser", getOrders);
export const fetchAllOrders = createAsyncThunk("orders/fetchAll", getAllOrders);
export const fetchOrderById = createAsyncThunk("orders/fetchOne", getOrder);
export const fetchOrderByNumber = createAsyncThunk(
  "orders/fetchByNumber",
  getOrderByNumber,
);
export const patchOrder = createAsyncThunk("orders/update", ({ id, changes }) =>
  updateOrder(id, changes),
);
// items stores the account's order list, while selected stores the order detail
// currently open in the history or tracking screen.
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    selected: null,
    status: "idle",
    detailStatus: "idle",
    error: null,
    adminItems: [],
    adminStatus: "idle",
    adminError: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  // reducers below keep loading, success, and failure states in one place.
  extraReducers: (builder) =>
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = "placing";
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.adminItems.unshift(action.payload);
        state.selected = action.payload;
        state.status = "succeeded";
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.adminStatus = "loading";
        state.adminError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.adminItems = action.payload;
        state.adminStatus = "succeeded";
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.adminStatus = "failed";
        state.adminError = action.error.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selected = action.payload;
        if (!state.items.some((order) => order.id === action.payload.id))
          state.items.unshift(action.payload);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.detailStatus = action.payload ? "succeeded" : "failed";
        state.selected = action.payload;
        state.error = action.payload
          ? null
          : "No order matches that order number.";
        if (
          action.payload &&
          !state.items.some((order) => order.id === action.payload.id)
        )
          state.items.unshift(action.payload);
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(patchOrder.fulfilled, (state, action) => {
        state.items = state.items.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        );
        state.adminItems = state.adminItems.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        );
        state.selected = action.payload;
      }),
});
export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
