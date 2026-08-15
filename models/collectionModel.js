const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

collectionSchema.virtual("category", {
  ref: "Category",
  foreignField: "collection",
  localField: "_id",
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
