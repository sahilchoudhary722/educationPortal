import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
