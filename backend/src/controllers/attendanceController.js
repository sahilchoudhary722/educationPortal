import Attendance from "../models/Attendance.js";

export const getAttendance = async (req, res) => {
  const attendance = await Attendance.find({});
  res.json(attendance);
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { attended, total, percentage } = req.body;

  const record = await Attendance.findOne({ id: Number(id) });

  if (!record) {
    res.status(404);
    throw new Error("Attendance record not found");
  }

  record.attended = Number(attended);
  record.total = Number(total);
  record.percentage = Number(percentage);

  await record.save();
  res.json(record);
};
