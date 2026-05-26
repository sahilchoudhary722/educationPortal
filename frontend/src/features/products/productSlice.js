import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../api/api";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const loadProducts = createAsyncThunk("products/loadProducts", async () => {
  const response = await get("/products");
  return response;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
