import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cartItems"));

const initialState = {
  items: savedCart || [],
};

const updateLocalStorage = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      updateLocalStorage(state.items);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      updateLocalStorage(state.items);
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      updateLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      updateLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      updateLocalStorage(state.items);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;