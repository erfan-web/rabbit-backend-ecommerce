const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["customer", "admin"],
        message: "Role must be either 'customer' or 'admin'",
      },
      default: "customer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
