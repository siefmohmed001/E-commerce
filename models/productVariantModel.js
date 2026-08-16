const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: {
      values: ["XS", "S", "M", "L", "XL"],
      message: "Size is either : XS, S, M, L, XL",
    },
    required: [true, "Size is required"],
  },
  color: {
    type: String,
    required: [true, "Color is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity must be above 0 "],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be above 0 "],
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
  },
  image: String,
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "A product varaint must have a product ID"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = ProductVariant;
