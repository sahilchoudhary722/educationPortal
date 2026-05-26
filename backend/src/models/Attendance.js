import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    studentId: { type: Number, required: true },
    subject: { type: String, required: true },
    attended: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
