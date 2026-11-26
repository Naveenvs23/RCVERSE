import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers, updateUser } from "../../services/userService";

export const fetchUsers = createAsyncThunk("users/fetchAll", getUsers);
export const updateUserBlockStatus = createAsyncThunk(
  "users/updateBlockStatus",
  ({ id, isBlocked }) => updateUser(id, { isBlocked }),
);

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserBlockStatus.fulfilled, (state, action) => {
        state.items = state.items.map((user) =>
          user.id === action.payload.id ? action.payload : user,
        );
      })
      .addCase(updateUserBlockStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
