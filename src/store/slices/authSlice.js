import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser, loginUser, registerUser } from "../../services/userService";

// restore the small public profile saved after a successful mock login.
const loadUser = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("rcverse-user") || "null");
    if (!saved) return null;
    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
    };
  } catch {
    return null;
  }
};
// async thunks call the service layer. redux toolkit then emits pending,
// fulfilled, or rejected actions as the network request changes state.
export const signIn = createAsyncThunk("auth/login", loginUser);
export const adminSignIn = createAsyncThunk("auth/adminLogin", (credentials) =>
  loginUser({ ...credentials, expectedRole: "admin" }),
);
export const register = createAsyncThunk("auth/register", registerUser);
export const validateSession = createAsyncThunk(
  "auth/validateSession",
  async (id) => {
    const user = await getUser(id);
    if (user.isBlocked) throw new Error("This account is blocked.");
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "customer",
    };
  },
);
// this slice stores only the session profile and request status, not form state.
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    status: "idle",
    error: null,
    sessionStatus: loadUser() ? "unverified" : "idle",
  },
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.sessionStatus = "idle";
    },
    clearAuthError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  // extra reducers respond to thunk lifecycle actions created above.
  extraReducers: (builder) =>
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.status = "succeeded";
        state.sessionStatus = "verified";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: "customer",
        };
        state.status = "succeeded";
        state.sessionStatus = "verified";
      })
      .addCase(adminSignIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminSignIn.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        state.status = "succeeded";
        state.sessionStatus = "verified";
      })
      .addCase(adminSignIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(validateSession.pending, (state) => {
        state.sessionStatus = "validating";
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sessionStatus = "verified";
      })
      .addCase(validateSession.rejected, (state) => {
        state.user = null;
        state.sessionStatus = "invalid";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }),
});
export const { signOut, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
