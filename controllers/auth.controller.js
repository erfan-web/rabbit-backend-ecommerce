const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(409, "User already exists!"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "user register successfully." });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(createError(401, "User Or Password invalid!"));

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) return next(createError(401, "User Or Password invalid!"));

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true, // process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(200)
      .json({ message: "User login successfully." });
  } catch (err) {
    next(err);
  }
};
exports.logout = async (req, res, next) => {
  try {
    res
      .clearCookie("token", {
        maxAge: "",
        httpOnly: true,
        secure: true, // process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(200)
      .json({ message: "User logout successfully" });
  } catch (err) {
    next(err);
  }
};
