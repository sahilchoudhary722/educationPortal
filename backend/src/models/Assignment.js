import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    submittedAt: { type: String, default: "" },
    submittedFileName: { type: String, default: "" },
    submittedFileType: { type: String, default: "" },
    submittedFileUrl: { type: String, default: "" },
  },
  { _id: false },
);

const assignmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: String, required: true },
    assignedBy: { type: String, required: true },
    assignmentFileName: { type: String, default: "" },
    assignmentFileType: { type: String, default: "" },
    assignmentFileUrl: { type: String, default: "" },
    submissions: { type: [submissionSchema], default: [] },
  },
  { timestamps: true },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
