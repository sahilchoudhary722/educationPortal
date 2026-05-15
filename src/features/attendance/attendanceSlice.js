import { createSlice } from "@reduxjs/toolkit";
import attendanceData from "../../data/attendanceData";

const savedAttendance = JSON.parse(
  localStorage.getItem("attendanceRecords"),
);

const initialState = {
  records: savedAttendance || attendanceData,
};

const attendanceSlice = createSlice({
  name: "attendance",

  initialState,

  reducers: {
    updateAttendance: (
      state,
      action,
    ) => {
      const {
        id,
        attended,
        total,
        percentage,
      } = action.payload;

      const record =
        state.records.find(
          (item) => item.id === id,
        );

      if (record) {
        record.attended =
          attended;

        record.total = total;

        record.percentage =
          percentage;
      }

      localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(
          state.records,
        ),
      );
    },

    addStudentAttendance: (
      state,
      action,
    ) => {
      const student =
        action.payload;

      const subjects = [
        "Math",
        "Physics",
        "Computer",
        "English",
      ];

      subjects.forEach(
        (subject, index) => {
          state.records.push({
            id:
              Date.now() +
              index,

            studentId:
              student.id,

            subject,

            attended: 0,

            total: 0,

            percentage: 0,
          });
        },
      );

      localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(
          state.records,
        ),
      );
    },
  },
});

export const {
  updateAttendance,
  addStudentAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;