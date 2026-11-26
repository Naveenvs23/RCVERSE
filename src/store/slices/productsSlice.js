import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

// thunks connect ui actions to asynchronous product service requests.
export const fetchProducts = createAsyncThunk("products/fetchAll", (params) =>
  getProducts(params),
);
export const fetchProductById = createAsyncThunk("products/fetchOne", (id) =>
  getProductById(id),
);
export const createProductRecord = createAsyncThunk(
  "products/create",
  (product) => createProduct(product),
);
export const updateProductRecord = createAsyncThunk(
  "products/update",
  ({ id, changes }) => updateProduct(id, changes),
);
export const deleteProductRecord = createAsyncThunk("products/delete", (id) =>
  deleteProduct(id),
);

// items is the catalogue; selected holds a separately requested detail record.
// status and detailstatus let the ui show loading and error states.
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selected: null,
    status: "idle",
    detailStatus: "idle",
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selected = null;
      state.detailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // thunk lifecycle cases record progress and save returned api data.
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.detailStatus = "succeeded";
        if (!state.items.some((item) => item.id === action.payload.id))
          state.items.push(action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(createProductRecord.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createProductRecord.pending, (state) => {
        state.error = null;
      })
      .addCase(createProductRecord.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateProductRecord.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
        if (state.selected?.id === action.payload.id)
          state.selected = action.payload;
      })
      .addCase(updateProductRecord.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteProductRecord.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.meta.arg);
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
