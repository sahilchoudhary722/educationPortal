import express from "express";
import { getProducts } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(protect), asyncHandler(getProducts));

export default router;
