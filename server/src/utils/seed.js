import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Attendance from "../models/Attendance.js";
import LibraryState from "../models/LibraryState.js";
import Product from "../models/Product.js";
import {
  userData,
  assignmentData,
  attendanceData,
  libraryBooks,
  productData,
} from "../data/seedData.js";

export const seedDatabase = async () => {
  const userCount = await User.countDocuments();
  const assignmentCount = await Assignment.countDocuments();
  const attendanceCount = await Attendance.countDocuments();
  const libraryCount = await LibraryState.countDocuments();
  const productCount = await Product.countDocuments();

  if (userCount === 0) {
    const users = await Promise.all(
      userData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );
    await User.insertMany(users);
    console.log("Seeded users");
  }

  if (assignmentCount === 0) {
    await Assignment.insertMany(assignmentData);
    console.log("Seeded assignments");
  }

  if (attendanceCount === 0) {
    await Attendance.insertMany(attendanceData);
    console.log("Seeded attendance records");
  }

  if (libraryCount === 0) {
    await LibraryState.create({
      books: libraryBooks,
      requests: [],
      reservations: [],
      wishlists: {},
      fines: {},
      ratings: [],
    });
    console.log("Seeded library state");
  }

  if (productCount === 0) {
    await Product.insertMany(productData);
    console.log("Seeded products");
  }
};
