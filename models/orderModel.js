const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User id is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  paymentMethod: {
    type: String,
    enum: ["COD"],
    required: true,
  },
  items: [
    {
      productVariant: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductVariant",
        required: true,
      },
      price: Number,
      quantity: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "shipping", "delivered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: Date,
  totalPrice: Number,
});

orderSchema.pre("save", function () {
  if (this.items && this.items.length > 0) {
    this.totalPrice = this.items.reduce((total, el) => {
      return (total += el.price * el.quantity);
    }, 0);
  } else {
    this.totalPrice = 0;
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
