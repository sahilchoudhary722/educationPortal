import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, put } from "../../api/api";

const initialState = {
  records: [],
  status: "idle",
  error: null,
};

export const loadAttendance = createAsyncThunk(
  "attendance/loadAttendance",
  async () => {
    const response = await get("/attendance");
    return response;
  },
);

export const updateAttendance = createAsyncThunk(
  "attendance/updateAttendance",
  async ({ id, attended, total, percentage }) => {
    const response = await put(`/attendance/${id}`, {
      attended,
      total,
      percentage,
    });
    return response;
  },
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAttendance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadAttendance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.records = action.payload;
      })
      .addCase(loadAttendance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateAttendance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.status = "succeeded";
        const record = action.payload;
        const index = state.records.findIndex(
          (item) => item.id === record.id,
        );
        if (index !== -1) {
          state.records[index] = record;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default attendanceSlice.reducer;
