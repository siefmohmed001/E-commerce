const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    collection: {
      type: mongoose.Schema.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "_id",
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
