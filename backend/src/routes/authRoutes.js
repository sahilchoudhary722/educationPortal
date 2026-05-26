import express from "express";
import { signupUser, loginUser } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/signup", asyncHandler(signupUser));
router.post("/login", asyncHandler(loginUser));

export default router;
