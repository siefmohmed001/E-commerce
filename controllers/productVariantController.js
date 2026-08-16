const multer = require("multer");
const sharp = require("sharp");
const ProductVariant = require("../models/productVariantModel");
const Cart = require("../models/cartModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Product = require("../models/productModel");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImage = upload.single("image");

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `variant-${req.params.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.file.filename}`);
  req.body.image = `img/products/${req.file.filename}`;
  next();
});

exports.createVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }
  const variant = await ProductVariant.create({
    ...req.body,
    product: req.params.productId,
  });

  res.status(201).json({
    status: "success",
    data: {
      data: variant,
    },
  });
});

exports.updateVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }
  const variant = await ProductVariant.findOneAndUpdate(
    {
      _id: req.params.id,
      product: req.params.productId,
    },
    req.body,
    { new: true, runValidators: true },
  );

  if (!variant) {
    return next(new AppError("No variant found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: variant,
    },
  });
});
exports.deleteVariant = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }

  const variant = await ProductVariant.findById({
    _id: req.params.id,
    product: req.params.productId,
  });

  if (!variant) {
    return next(new AppError("Product variant not found", 404));
  }
  variant.isActive = false;
  await variant.save();
  res.status(204).json({
    status: "success",
    data: null,
  });
});
