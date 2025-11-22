const { isValidObjectId } = require("mongoose");
const Order = require("../models/Order");
const { createError } = require("../utils/createError");

exports.getUserOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ "user.userId": userId });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
exports.getOrder = async (req, res, next) => {
  if (!isValidObjectId(req.params.id))
    return next(createError(400, "order id is not valid"));

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(createError(404, "Oops, Order Not Found!"));
    res.status(200).json(order);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
