const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, cartController.addItem)
  .get(authController.protect, cartController.getCart);

router.route("/clear").delete(authController.protect, cartController.clearCart);
router
  .route("/:id")
  .delete(authController.protect, cartController.deleteItem)
  .post(authController.protect, cartController.decreaseItem);

module.exports = router;
