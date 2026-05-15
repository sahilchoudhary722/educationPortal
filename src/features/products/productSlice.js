import { createSlice } from "@reduxjs/toolkit";
import productData from "../../data/productData";

const initialState = {
  items: productData,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productSlice.reducer;