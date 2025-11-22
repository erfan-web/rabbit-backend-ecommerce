const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { createError } = require("../utils/createError");
const { getCart } = require("../utils/getCart");

exports.addCartItem = async (req, res, next) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(createError(404, "Oops, Product Not Found!"));
    let cart = await getCart(userId, guestId);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );
      if (productIndex > -1) {
        // if the product already exists, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // add new product to cart
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      // Recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart for the quest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: userId ? undefined : guestId,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    next(error);
  }
};
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    const cart = await getCart(userId, guestId);
    if (!cart) return next(createError(404, "Cart not found."));

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      // update quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // remove product if quantity is 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return next(createError(404, "Product not found in cart!"));
    }
  } catch (err) {
    next(err);
  }
};
exports.deleteCartItem = async (req, res, next) => {
  try {
    const { productId, size, color, guestId, userId } = req.body;
    const cart = await getCart(userId, guestId);
    if (!cart) return next(createError(404, "Cart not found."));

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return next(createError(404, "Product not found in cart!"));
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const { guestId, userId } = req.query;

    const cart = await getCart(userId, guestId);
    if (!cart) return next(createError(404, "Cart not found."));

    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

exports.mergeCart = async (req, res, next) => {
  try {
    const { guestId } = req.body;
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });
    if (guestCart && guestCart.products.length === 0) {
      return next(createError(400, "Guest cart is empity"));
    }

    if (!userCart) {
      const userId = req.user._id.toString();
      guestCart.user = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      console.log(guestCart);
      return res.status(200).json(guestCart);
    }
    if (guestCart) {
      guestCart.products.forEach((guestItem) => {
        const existingIndex = userCart.products.findIndex(
          (p) =>
            p.productId.toString() === guestItem.productId.toString() &&
            p.size === guestItem.size &&
            p.color === guestItem.color
        );

        if (existingIndex > -1) {
          userCart.products[existingIndex].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });
    }
    userCart.totalPrice = userCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await userCart.save();

    await Cart.findOneAndDelete({ guestId });

    res.status(200).json(userCart);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
