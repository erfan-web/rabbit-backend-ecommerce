const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");
exports.verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return next(
        createError(401, "You must be logged in to access this resource.")
      );

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload)
      return next(createError(401, "expired authentication token."));

    const user = await User.findById(payload.id);
    if (!user) return next(createError(401, "User not found!"));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(createError(403, "Not authorized as an admin"));
  }
};
