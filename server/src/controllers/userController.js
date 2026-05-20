import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findOne({ id: Number(req.params.id) }).select(
    "-password",
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
};
