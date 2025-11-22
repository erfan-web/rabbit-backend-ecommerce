const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "price is required"],
    },
    discountPrice: {
      type: Number,
    },
    countInStock: {
      type: Number,
      required: [true, "countInStock is required"],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      required: [true, "sku is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    brand: {
      type: String,
    },
    sizes: {
      type: [String],
      required: [true, "sizes is required"],
    },
    colors: {
      type: [String],
      required: [true, "colors is required"],
    },
    collections: {
      type: String,
      required: [true, "collections is required"],
    },
    material: {
      type: [String],
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },
    images: [
      {
        url: {
          type: String,
          required: [true, "url is required"],
        },
        altText: {
          type: String,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    metaKeywords: {
      type: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    weight: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

