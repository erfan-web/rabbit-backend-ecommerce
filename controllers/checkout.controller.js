const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const axios = require("axios");
const { createError } = require("../utils/createError");
exports.createCheckout = async (req, res, next) => {
  try {
    const { userId, cart, shippingAddress } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User Not Found."));
    const amount = cart.totalPrice * 100_000;

    const newOrder = new Order({
      user: {
        userId,
        name: user.name,
      },
      products: cart.products,
      amount,
      shippingAddress,
      paymentStatus: "pending",
    });

    // 2) درخواست به زیبال
    const zibalRes = await axios.post("https://gateway.zibal.ir/v1/request", {
      merchant: process.env.ZIBAL_MERCHANT,
      amount: amount,
      callbackUrl: `http://localhost:8000/api/checkout/verify`,
      orderId: newOrder._id.toString(),
    });
    if (zibalRes.data.result !== 100)
      return next(createError(400, "Zibal request failed"));

    // ذخیره trackId
    newOrder.trackId = zibalRes.data.trackId;
    await newOrder.save();

    // ارسال لینک پرداخت
    res.json({
      payLink: `https://gateway.zibal.ir/start/${zibalRes.data.trackId}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
    const { trackId } = req.query;

    const zibalRes = await axios.post("https://gateway.zibal.ir/v1/verify", {
      merchant: process.env.ZIBAL_MERCHANT,
      trackId,
    });

    const order = await Order.findOne({ trackId });

    if (!order) return next(createError(404, "Order not found"));

    if (zibalRes.data.result === 100) {
      order.paymentStatus = "paid";
      await order.save();

      await Cart.findOneAndUpdate(
        { user: order.user.userId },
        { products: [], totalPrice: 0 }
      );

      return res.redirect(
        `http://localhost:5173/order-confirmation/${order._id}`
      );
    } else {
      order.paymentStatus = "failed";
      await order.save();
      return res.redirect("/checkout/failed");
    }
  } catch (err) {
    next(err);
  }
};

