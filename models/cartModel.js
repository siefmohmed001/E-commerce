const mongoose = require("mongoose");
const ProductVariant = require("./productVariantModel");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  item: [
    {
      productVariant: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductVariant",
        required: true,
      },
      quantity: Number,
    },
  ],
  totalPrice: Number,
});

cartSchema.pre("save", async function () {
  await this.populate("item.productVariant");

  this.totalPrice = this.item.reduce((total, el) => {
    return total + el.productVariant.price * el.quantity;
  }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
