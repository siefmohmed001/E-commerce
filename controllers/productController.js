const multer = require("multer");
const sharp = require("sharp");
const Product = require("../models/productModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const factoryHandler = require("./factoryHandler");
const ProductVariant = require("../models/productVariantModel");

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

exports.uploadProductImage = upload.single("coverImage");

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.file.buffer)
    .resize(1000, 1000, {
      fit: "cover",
    })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.file.filename}`);
  req.body.coverImage = `img/products/${req.file.filename}`;
  next();
});
exports.createProduct = factoryHandler.createOne(Product);
exports.getAllProducts = factoryHandler.getAll(Product);
exports.getProduct = factoryHandler.getOne(Product, "productVariant");
exports.updateProduct = factoryHandler.updateOne(Product);
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  const variants = await ProductVariant.find({
    product: req.params.id,
  });

  console.log("PRODUCT:", req.params.id);
  console.log("VARIANTS:", variants);
  await ProductVariant.deleteMany({
    product: req.params.id,
  });
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
