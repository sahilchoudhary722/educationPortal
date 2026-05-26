import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import assignmentReducer from "../features/assignment/assignmentSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import libraryReducer from "../features/library/librarySlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assignments: assignmentReducer,
    attendance: attendanceReducer,
    library: libraryReducer,
    products: productReducer,
    cart: cartReducer,
  },
});