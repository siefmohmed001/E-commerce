const Collection = require("../models/collectionModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const factoryHandler = require("./factoryHandler");

exports.createCollection = factoryHandler.createOne(Collection);
exports.getAllCollection = factoryHandler.getAll(Collection);
exports.getCollection = factoryHandler.getOne(Collection, "category");
exports.updateCollection = factoryHandler.updateOne(Collection);
exports.deleteCollection = factoryHandler.deleteOne(Collection);
