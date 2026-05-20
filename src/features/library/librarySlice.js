import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../../api/api";

const initialState = {
  books: [],
  requests: [],
  reservations: [],
  wishlists: {},
  fines: {},
  ratings: [],
  status: "idle",
  error: null,
};

export const loadLibrary = createAsyncThunk(
  "library/loadLibrary",
  async () => {
    const response = await get("/library");
    return response;
  },
);

export const requestBook = createAsyncThunk(
  "library/requestBook",
  async (body) => {
    const response = await post("/library/request", body);
    return response;
  },
);

export const approveRequest = createAsyncThunk(
  "library/approveRequest",
  async (body) => {
    const response = await post("/library/approve", body);
    return response;
  },
);

export const rejectRequest = createAsyncThunk(
  "library/rejectRequest",
  async (body) => {
    const response = await post("/library/reject", body);
    return response;
  },
);

export const returnBook = createAsyncThunk(
  "library/returnBook",
  async (body) => {
    const response = await post("/library/return", body);
    return response;
  },
);

export const addToWishlist = createAsyncThunk(
  "library/addToWishlist",
  async (body) => {
    const response = await post("/library/wishlist", body);
    return response;
  },
);

export const removeFromWishlist = createAsyncThunk(
  "library/removeFromWishlist",
  async (body) => {
    const response = await post("/library/wishlist/remove", body);
    return response;
  },
);

export const reserveBook = createAsyncThunk(
  "library/reserveBook",
  async (body) => {
    const response = await post("/library/reserve", body);
    return response;
  },
);

export const cancelReservation = createAsyncThunk(
  "library/cancelReservation",
  async (body) => {
    const response = await post("/library/reserve/cancel", body);
    return response;
  },
);

export const addRating = createAsyncThunk(
  "library/addRating",
  async (body) => {
    const response = await post("/library/rating", body);
    return response;
  },
);

export const payFine = createAsyncThunk(
  "library/payFine",
  async (body) => {
    const response = await post("/library/payfine", body);
    return response;
  },
);

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLibrary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(loadLibrary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addMatcher(
        (action) => action.type.startsWith("library/") && action.type.endsWith("/fulfilled") && action.type !== "library/loadLibrary/fulfilled",
        (state, action) => {
          state.status = "succeeded";
          Object.assign(state, action.payload);
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("library/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        },
      );
  },
});

export default librarySlice.reducer;
