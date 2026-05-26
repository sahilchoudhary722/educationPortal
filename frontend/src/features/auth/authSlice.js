import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../../api/api";

const savedUser = JSON.parse(localStorage.getItem("currentUser"));

const initialState = {
  currentUser: savedUser || null,
  isAuthenticated: !!savedUser,
  users: [],
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await post("/auth/login", credentials);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await post("/auth/signup", userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const loadUsers = createAsyncThunk(
  "auth/loadUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await get("/users");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem(
          "currentUser",
          JSON.stringify(action.payload.user),
        );
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(loadUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
