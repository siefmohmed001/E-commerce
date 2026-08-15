const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const productVariantRouter = require("./productVariantRoutes");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();
router.use("/:productId/variants", productVariantRouter);
router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct,
  );

router.route("/:id").get(productController.getProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductImage,
    productController.resizeProductImage,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct,
  );

module.exports = router;
