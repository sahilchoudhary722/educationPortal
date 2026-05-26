import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../../api/api";

const initialState = {
  assignments: [],
  status: "idle",
  error: null,
};

export const loadAssignments = createAsyncThunk(
  "assignments/loadAssignments",
  async () => {
    const response = await get("/assignments");
    return response;
  },
);

export const addAssignment = createAsyncThunk(
  "assignments/addAssignment",
  async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("subject", payload.subject);
    formData.append("dueDate", payload.dueDate);
    formData.append("assignedBy", payload.assignedBy);

    if (payload.assignmentFile) {
      formData.append("assignmentFile", payload.assignmentFile);
    }

    const response = await post("/assignments", formData, true);
    return response;
  },
);

export const submitAssignment = createAsyncThunk(
  "assignments/submitAssignment",
  async ({ assignmentId, studentId, submissionFile }) => {
    const formData = new FormData();
    formData.append("studentId", studentId);

    if (submissionFile) {
      formData.append("submissionFile", submissionFile);
    }

    const response = await post(
      `/assignments/${assignmentId}/submit`,
      formData,
      true,
    );
    return response;
  },
);

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAssignments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments = action.payload;
      })
      .addCase(loadAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addAssignment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAssignment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments.push(action.payload);
        state.error = null;
      })
      .addCase(addAssignment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitAssignment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;
        const index = state.assignments.findIndex(
          (item) => item.id === updated.id,
        );
        if (index !== -1) {
          state.assignments[index] = updated;
        }
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default assignmentSlice.reducer;
