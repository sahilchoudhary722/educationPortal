import Order from "../models/Order.js";
import User from "../models/User.js";

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomStr}`;
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch orders");
  }
};

// Get all orders (admin/teacher)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch orders");
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { items, totalAmount, paymentMethod, deliveryAddress, phoneNumber } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Cart items are required");
    }

    if (!totalAmount || totalAmount <= 0) {
      res.status(400);
      throw new Error("Invalid total amount");
    }

    if (
      !paymentMethod ||
      !["upi", "cash", "debit_card", "credit_card"].includes(paymentMethod)
    ) {
      res.status(400);
      throw new Error("Invalid payment method");
    }

    // Get user details
    const user = await User.findOne({ id: userId });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Create order
    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      userId,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress: deliveryAddress || "",
      phoneNumber: phoneNumber || "",
      paymentStatus: "Completed",
      orderStatus: "Confirmed",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(res.statusCode || 500);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (
      !orderStatus ||
      !["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].includes(
        orderStatus,
      )
    ) {
      res.status(400);
      throw new Error("Invalid order status");
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { orderStatus, updatedAt: new Date() },
      { new: true },
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  } catch (error) {
    res.status(res.statusCode || 500);
    throw error;
  }
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  } catch (error) {
    res.status(res.statusCode || 500);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
      res.status(400);
      throw new Error("Cannot cancel order that has been shipped or delivered");
    }

    order.orderStatus = "Cancelled";
    order.updatedAt = new Date();
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(res.statusCode || 500);
    throw error;
  }
};
