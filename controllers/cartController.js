const Cart = require("../models/cartModel");
const ProductVariant = require("../models/productVariantModel");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");
const factoryHandler = require("./factoryHandler");

exports.addItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  const variant = await ProductVariant.findById(req.body.productVariant);

  if (!variant) {
    return next(new AppError("Product Variant not found", 404));
  }

  const quantityToAdd = req.body.quantity || 1;

  if (quantityToAdd <= 0) {
    return next(new AppError("Quantity must be greater than 0", 400));
  }

  const existingItem = cart?.item.find(
    (el) => el.productVariant.toString() === req.body.productVariant,
  );

  // Check stock
  if (
    existingItem &&
    existingItem.quantity + quantityToAdd > variant.quantity
  ) {
    return next(new AppError("Not enough stock", 400));
  }

  if (!existingItem && quantityToAdd > variant.quantity) {
    return next(new AppError("Not enough stock", 400));
  }

  // No cart exists
  if (!cart) {
    const newCart = await Cart.create({
      user: req.user.id,
      item: [
        {
          productVariant: req.body.productVariant,
          quantity: quantityToAdd,
        },
      ],
    });

    return res.status(201).json({
      status: "success",
      data: {
        data: newCart,
      },
    });
  }

  // Item already exists
  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    // Add new item
    cart.item.push({
      productVariant: req.body.productVariant,
      quantity: quantityToAdd,
    });
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  //   Check if there's cart
  if (!cart) {
    return next(new AppError("There no cart with this id", 404));
  }

  cart.item = cart.item.filter(
    (el) => el.productVariant.toString() !== req.params.id,
  );

  await cart.save();
  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "item.productVariant",
  );

  if (!cart) {
    return next(new AppError("There is no cart for this user", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.decreaseItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError("There is no cart for this user", 404));
  }

  const existingItem = cart.item.find(
    (el) => el.productVariant.toString() === req.params.id,
  );

  if (!existingItem) {
    return next(new AppError("This item is not in the cart", 404));
  }
  if (existingItem.quantity > 1) {
    existingItem.quantity -= 1;
  } else {
    cart.item = cart.item.filter(
      (el) => el.productVariant.toString() !== req.params.id,
    );
  }

  await cart.save();
  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError("There is no cart for this user", 404));
  }
  cart.item = [];
  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});
