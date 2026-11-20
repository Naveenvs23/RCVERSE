import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/userService";

// restore the small public profile saved after a successful mock login.
const loadUser = () => { try { return JSON.parse(localStorage.getItem("rcverse-user") || "null"); } catch { return null; } };
// async thunks call the service layer. redux toolkit then emits pending,
// fulfilled, or rejected actions as the network request changes state.
export const signIn = createAsyncThunk("auth/login", loginUser);
export const register = createAsyncThunk("auth/register", registerUser);
// this slice stores only the session profile and request status, not form state.
const authSlice = createSlice({
  name: "auth",
  initialState: { user: loadUser(), status: "idle", error: null },
  reducers: { signOut: (state) => { state.user = null; state.status = "idle"; state.error = null; }, clearAuthError: (state) => { state.error = null; state.status = "idle"; } },
  // extra reducers respond to thunk lifecycle actions created above.
  extraReducers: (builder) => builder
    .addCase(signIn.pending, (state) => { state.status = "loading"; state.error = null; })
    .addCase(signIn.fulfilled, (state, action) => { state.user = { id: action.payload.id, name: action.payload.name, email: action.payload.email }; state.status = "succeeded"; })
    .addCase(signIn.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
    .addCase(register.pending, (state) => { state.status = "loading"; state.error = null; })
    .addCase(register.fulfilled, (state, action) => { state.user = { id: action.payload.id, name: action.payload.name, email: action.payload.email }; state.status = "succeeded"; })
    .addCase(register.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; }),
});
export const { signOut, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
