import express from "express";
import {
  getUserOrders,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderDetails,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// Get user's orders
router.get("/", asyncHandler(protect), asyncHandler(getUserOrders));

// Get all orders (admin/teacher only)
router.get("/all", asyncHandler(protect), asyncHandler(getAllOrders));

// Get order details
router.get("/:orderId", asyncHandler(protect), asyncHandler(getOrderDetails));

// Create order
router.post("/", asyncHandler(protect), asyncHandler(createOrder));

// Update order status
router.put(
  "/:orderId/status",
  asyncHandler(protect),
  asyncHandler(updateOrderStatus),
);

// Cancel order
router.put(
  "/:orderId/cancel",
  asyncHandler(protect),
  asyncHandler(cancelOrder),
);

export default router;
