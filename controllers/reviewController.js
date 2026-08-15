const Review = require("../models/reviewModel");
const factroyHandler = require("./factoryHandler");

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factroyHandler.getAll(Review);
exports.getReview = factroyHandler.getOne(Review);
exports.createReview = factroyHandler.createOne(Review);
exports.updateReview = factroyHandler.updateOne(Review);
exports.deleteReview = factroyHandler.deleteOne(Review);
