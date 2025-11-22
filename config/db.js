const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGO_URI);
      console.log(`MongoDB Connection successfully.`);
    }
  } catch (err) {
    console.error(`MongoDB connection failed! Error is: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
