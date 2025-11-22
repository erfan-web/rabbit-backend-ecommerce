const { isValidObjectId } = require("mongoose");
const User = require("../models/User");
const { createError } = require("../utils/createError");
const bcrypt = require("bcryptjs");
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(409, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });
    res.status(201).json({ message: "User Created Successfully", newUser });
  } catch (err) {
    next(err);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return next(createError(400, "user id is not valid"));

    const user = await User.findById(id);
    if (!user) return next(createError(404, "Oops, User Not Found!"));

    Object.keys(req.body).map((key) => {
      user[key] = req.body[key];
    });

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return next(createError(400, "user id is not valid"));

    const user = await User.findByIdAndDelete(id);
    if (!user) return next(createError(404, "Oops, User Not Found!"));

    return res.status(200).json({ message: "User removed." });
  } catch (err) {
    next(err);
  }
};
