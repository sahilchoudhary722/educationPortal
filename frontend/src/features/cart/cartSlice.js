import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post, del } from "../../api/api";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const loadCart = createAsyncThunk("cart/loadCart", async () => {
  const response = await get("/cart");
  return response.items;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = [...state.cart.items];
    const existingIndex = items.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    const response = await post("/cart", { items });
    return response.items;
  },
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = state.cart.items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    const response = await post("/cart", { items });
    return response.items;
  },
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = state.cart.items.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );
    const response = await post("/cart", { items });
    return response.items;
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const items = state.cart.items.filter((item) => item.id !== id);
    const response = await post("/cart", { items });
    return response.items;
  },
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  const response = await del("/cart");
  return response.items;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.status = "succeeded";
          state.items = action.payload;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        },
      );
  },
});

export default cartSlice.reducer;
