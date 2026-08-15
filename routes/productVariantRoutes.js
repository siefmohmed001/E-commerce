const express = require("express");
const authController = require("../controllers/authController");
const productVariantController = require("../controllers/productVariantController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect, authController.restrictTo("admin"));

router.route("/").post(productVariantController.createVariant);

router
  .route("/:id")
  .patch(
    productVariantController.uploadProductImage,
    productVariantController.resizeProductImage,
    productVariantController.updateVariant,
  )
  .delete(productVariantController.deleteVariant);

module.exports = router;
