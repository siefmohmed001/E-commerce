const Categroy = require("../models/categoryModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const factoryHandler = require("./factoryHandler");
const Collection = require("../models/collectionModel");

exports.getAllCategory = factoryHandler.getAll(Categroy);
exports.getCategory = factoryHandler.getOne(Categroy, "products");

exports.createCategory = catchAsync(async (req, res, next) => {
  const collection = await Collection.findById(req.params.collectionId);
  if (!collection) {
    return next(new AppError("No collection found with this ID", 404));
  }

  const category = await Categroy.create({
    ...req.body,
    collection: req.params.collectionId,
  });
  res.status(201).json({
    status: "success",
    data: {
      data: category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const collection = await Collection.findById(req.params.collectionId);
  if (!collection) {
    return next(new AppError("No collection found with this ID", 404));
  }

  const category = await Categroy.findOneAndUpdate(
    {
      _id: req.params.id,
      collection: req.params.collectionId,
    },
    req.body,
    { new: true, runValidators: true },
  );

  if (!category) {
    return next(new AppError("No category found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: category,
    },
  });
});
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const collection = await Collection.findById(req.params.collectionId);
  if (!collection) {
    return next(new AppError("No collection found with this ID", 404));
  }

  const category = await Categroy.findOneAndDelete({
    _id: req.params.id,
    collection: req.params.collectionId,
  });

  if (!category) {
    return next(new AppError("No category found with this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
