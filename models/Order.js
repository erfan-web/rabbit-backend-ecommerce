const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
      name: String,
    },

    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        image: String,
        name: String,
        quantity: Number,
        price: Number,
        size: String,
        color: String,
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    trackId: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
