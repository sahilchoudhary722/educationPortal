import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
  },

  reducers: {},
});

export default userSlice.reducer;