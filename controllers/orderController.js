const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const ProductVariant = require("../models/productVariantModel");
const factoryHandler = require("./factoryHandler");

exports.createOrder = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user.id,
  });

  if (!cart) {
    return next(new AppError("There is no cart on this user", 404));
  }

  if (cart.item.length === 0) {
    return next(new AppError("Cart is Empty", 400));
  }

  const variantsId = cart.item.map((el) => el.productVariant);

  const variants = await ProductVariant.find({
    _id: { $in: variantsId },
    isActive: true,
  });

  const orderItems = cart.item.map((cartItem) => {
    const variant = variants.find(
      (el) => el._id.toString() === cartItem.productVariant.toString(),
    );

    if (!variant) {
      throw new AppError(
        "One of the product variants in your cart is no longer available",
        400,
      );
    }

    if (cartItem.quantity > variant.quantity) {
      throw new AppError("Not enough stock", 400);
    }

    return {
      productVariant: variant._id,
      price: variant.price,
      quantity: cartItem.quantity,
    };
  });

  const order = await Order.create({
    user: req.user.id,
    city: req.body.city,
    phone: req.body.phone,
    paymentMethod: req.body.paymentMethod,
    items: orderItems,
  });

  for (const orderItem of orderItems) {
    const variant = variants.find(
      (el) => el._id.toString() === orderItem.productVariant.toString(),
    );

    variant.quantity -= orderItem.quantity;

    await variant.save();
  }

  await Cart.updateOne(
    {
      _id: cart._id,
    },
    {
      $set: {
        item: [],
      },
    },
  );

  res.status(201).json({
    status: "success",
    data: {
      data: order,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  order.status = req.body.status;
  if (req.body.status === "delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      data: order,
    },
  });
});

exports.getAllOrders = factoryHandler.getAll(Order);

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });

  if (order.length === 0) {
    return next(new AppError("User don't have orders ", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: order,
    },
  });
});
