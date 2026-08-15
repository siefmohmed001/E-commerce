const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").post(orderController.createOrder);
router.route("/my-orders").get(orderController.getUserOrders);

router.use(authController.restrictTo("admin"));
router.route("/").get(orderController.getAllOrders);
router.route("/:id").patch(orderController.updateOrder);

module.exports = router;
