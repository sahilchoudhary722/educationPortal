import express from "express";
import {
  getAttendance,
  updateAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(protect), asyncHandler(getAttendance));
router.put("/:id", asyncHandler(protect), asyncHandler(updateAttendance));

export default router;
