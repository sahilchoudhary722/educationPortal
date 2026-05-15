import { createSlice } from "@reduxjs/toolkit";
import assignmentData from "../../data/assignmentData";
import userData from "../../data/userData";

const initialState = {
  assignments: assignmentData,
};

const formatToday = () => {
  const today = new Date();
  return today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStudentSubmissionsTemplate = () => {
  const students = userData.filter((user) => user.role === "student");

  return students.map((student) => ({
    studentId: student.id,
    status: "Pending",
    submittedAt: "",
    submittedFileName: "",
    submittedFileType: "",
  }));
};

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action) => {
      const { title, subject, dueDate, assignedBy, assignmentFileName, assignmentFileType } =
        action.payload;

      const newAssignment = {
        id: Date.now(),
        title,
        subject,
        dueDate,
        assignedBy,
        assignmentFileName: assignmentFileName || "",
        assignmentFileType: assignmentFileType || "",
        submissions: getStudentSubmissionsTemplate(),
      };

      state.assignments.push(newAssignment);
    },

    submitAssignment: (state, action) => {
      const { assignmentId, studentId, submittedFileName, submittedFileType } =
        action.payload;

      const assignment = state.assignments.find(
        (item) => item.id === assignmentId
      );

      if (assignment) {
        const studentSubmission = assignment.submissions.find(
          (item) => item.studentId === studentId
        );

        if (studentSubmission) {
          studentSubmission.status = "Submitted";
          studentSubmission.submittedAt = formatToday();
          studentSubmission.submittedFileName = submittedFileName || "";
          studentSubmission.submittedFileType = submittedFileType || "";
        }
      }
    },
  },
});

export const { addAssignment, submitAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;