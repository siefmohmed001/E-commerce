const express = require("express");
const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoryController");
const productRouter = require("./productRoutes");

const router = express.Router({ mergeParams: true });

router.route("/").get(categoryController.getAllCategory);
router.route("/:id").get(categoryController.getCategory);

router.use(authController.protect, authController.restrictTo("admin"));

router.route("/").post(categoryController.createCategory);

router
  .route("/:id")
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
