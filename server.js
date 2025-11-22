const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHanding = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config();
connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const orderRoutes = require("./routes/order.routes");
const subscriberRoutes = require("./routes/subscriber.routes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/subscriber", subscriberRoutes);

// // Error MiddleWare
app.use(errorHanding());

const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
