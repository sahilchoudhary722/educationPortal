import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Number, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, required: true, enum: ["student", "teacher"] },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["upi", "cash", "debit_card", "credit_card"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"],
    },
    orderStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    },
    deliveryAddress: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
