const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const products = require("./data/products");
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    // Create a default admin User
    const hashed = await bcrypt.hash("123456", 10);
    const createdUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    });

    // Assign the default user ID to each product
    const userID = createdUser._id;
    const sampleProducts = products.map((p) => {
      return { ...p, user: userID };
    });
    await Product.insertMany(sampleProducts);
    console.log("Product data seeded succesfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding the data:" + err);
    process.exit(1);
  }
};

seedData();
