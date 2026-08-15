const multer = require("multer");
const sharp = require("sharp");
const Product = require("../models/productModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const factoryHandler = require("./factoryHandler");

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
  req.body.image = `img/products/${req.file.filename}`;
  next();
});
exports.createProduct = factoryHandler.createOne(Product);
exports.getAllProducts = factoryHandler.getAll(Product);
exports.getProduct = factoryHandler.getOne(Product, "productVariant");
exports.updateProduct = factoryHandler.updateOne(Product);
exports.deleteProduct = factoryHandler.deleteOne(Product);
