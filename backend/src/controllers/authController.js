import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    course,
    semester,
    rollNumber,
    department,
    profileImage,
  } = req.body;

  const existing = await User.findOne({ email });

  if (existing) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const lastUser = await User.findOne().sort({ id: -1 });
  const id = lastUser ? lastUser.id + 1 : 1;

  const user = await User.create({
    id,
    name,
    email,
    password: hashedPassword,
    role,
    course: role === "student" ? course : undefined,
    semester: role === "student" ? semester : undefined,
    rollNumber: role === "student" ? rollNumber : undefined,
    department: role === "teacher" ? department : undefined,
    profileImage: profileImage || "",
  });

  if (role === "student") {
    const studentAttendance = ["Math", "Physics", "Computer", "English"].map(
      (subject, index) => ({
        id: Date.now() + index,
        studentId: id,
        subject,
        attended: 0,
        total: 0,
        percentage: 0,
      }),
    );
    await Attendance.insertMany(studentAttendance);
  }

  res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      semester: user.semester,
      rollNumber: user.rollNumber,
      department: user.department,
      profileImage: user.profileImage,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      semester: user.semester,
      rollNumber: user.rollNumber,
      department: user.department,
      profileImage: user.profileImage,
    },
    token: generateToken(user.id),
  });
};
