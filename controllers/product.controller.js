  const { isValidObjectId } = require("mongoose");
  const Product = require("../models/Product");
  const { createError } = require("../utils/createError");

  exports.getProducts = async (req, res, next) => {
    try {
      const {
        category,
        size,
        material,
        brand,
        minPrice,
        maxPrice,
        color,
        gender,
        collection,
        sortBy,
        search,
        limit,
      } = req.query;
      const filters = {
        ...(collection &&
          collection.toLowerCase() !== "all" && { collections: collection }),
        ...(category && { category }),
        ...(gender && { gender }),
        ...(size && { sizes: { $in: size.split(",") } }),
        ...(color && { colors: { $in: color.split(",") } }),
        ...(material && { material: { $in: material.split(",") } }),
        ...(brand && { brand: { $in: brand.split(",") } }),
      };

      // محدوده قیمت
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
      }

      // جستجو در نام و توضیح
      if (search) {
        filters.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      // مرتب‌سازی
      const sortOptions = (() => {
        switch (sortBy) {
          case "priceAsc":
            return { price: 1 };
          case "priceDsc":
            return { price: -1 };
          case "popularity":
            return { rating: -1 };
          default:
            return { createdAt: -1 }; // پیش‌فرض: جدیدترین
        }
      })();
      const products = await Product.find(filters)
        .sort(sortOptions)
        .limit(Number(limit) || 0);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  exports.getSingleProduct = async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id))
        return next(createError(400, "product id is not valid"));

      const product = await Product.findById(req.params.id);
      if (!product) return next(createError(404, "Oops, Product Not Found!"));

      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };
  exports.getSimilarProducts = async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id))
        return next(createError(400, "product id is not valid"));

      const product = await Product.findById(req.params.id);
      if (!product) return next(createError(404, "Oops, Product Not Found!"));

      const similarProducts = await Product.find({
        _id: { $ne: product.id }, //Exclude the current product ID
        gender: product.gender,
        category: product.category,
      }).limit(4);

      return res.status(200).json(similarProducts);
    } catch (err) {
      next(err);
    }
  };

  exports.getBestSellProducts = async (req, res, next) => {
    try {
      const bestSeller = await Product.findOne().sort({ rating: -1 });
      if (!bestSeller)
        return next(createError(404, "Oops! No best-selling product found."));
      return res.status(200).json(bestSeller);
    } catch (err) {
      next(err);
    }
  };
  exports.getNewArrivalsProducts = async (req, res, next) => {
    try {
      const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
      if (!newArrivals)
        return next(createError(404, "Oops! latest product not found."));
      return res.status(200).json(newArrivals);
    } catch (err) {
      next(err);
    }
  };

  exports.createProduct = async (req, res, next) => {
    try {
      const newProduct = new Product({ ...req.body, user: req.user._id });
      const createdProduct = await newProduct.save();
      return res.status(201).json(createdProduct);
    } catch (err) {
      next(err);
    }
  };

  exports.updateProduct = async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id))
        return next(createError(400, "product id is not valid"));

      const product = await Product.findById(req.params.id);
      if (!product) return next(createError(404, "Oops, Product Not Found!"));

      Object.keys(req.body).map((key) => {
        product[key] = req.body[key];
      });
      const updatedProduct = await product.save();
      return res.status(200).json(updatedProduct);
    } catch (err) {
      next(err);
    }
  };
  exports.deleteProduct = async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id))
        return next(createError(400, "product id is not valid"));

      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return next(createError(404, "Oops, Product Not Found!"));

      return res.status(200).json({ message: "Product removed." });
    } catch (err) {
      next(err);
    }
  };
