import express from "express";
import { getCart, saveCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(protect), asyncHandler(getCart));
router.post("/", asyncHandler(protect), asyncHandler(saveCart));
router.delete("/", asyncHandler(protect), asyncHandler(clearCart));

export default router;
