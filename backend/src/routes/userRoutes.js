import express from "express";
import { getUsers, getUserById } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(protect), asyncHandler(getUsers));
router.get("/:id", asyncHandler(protect), asyncHandler(getUserById));

export default router;
