import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  const userId = Number(req.user.id);
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  res.json(cart);
};

export const saveCart = async (req, res) => {
  const userId = Number(req.user.id);
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error("Cart items must be an array");
  }

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items },
    { new: true, upsert: true },
  );

  res.json(cart);
};

export const clearCart = async (req, res) => {
  const userId = Number(req.user.id);
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items: [] },
    { new: true, upsert: true },
  );

  res.json(cart);
};
