const express = require("express");
const authController = require("../controllers/authController");
const collectionController = require("../controllers/collectionController");
const categoryRoute = require("./categoryRoutes");

const router = express.Router();
router.use("/:collectionId/categories", categoryRoute);

router.route("/").get(collectionController.getAllCollection);
router.route("/:id").get(collectionController.getCollection);

router.use(authController.protect, authController.restrictTo("admin"));

router.post("/", collectionController.createCollection);
router
  .route("/:id")
  .patch(collectionController.updateCollection)
  .delete(collectionController.deleteCollection);

module.exports = router;
