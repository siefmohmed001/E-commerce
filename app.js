const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const xss = require("xss-clean");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");
const collectionRoute = require("./routes/collectionRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const productVariantRouter = require("./routes/productVariantRoutes");
const cartRoute = require("./routes/cartRoutes");
const orderRoute = require("./routes/orderRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const errorHandler = require("./controllers/errorController");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
// Set security HTTP Headers
app.use(helmet());
app.use(cors());

// Limit request from same API
const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour! ",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use("/api/v1/collections", collectionRoute);
app.use("/api/v1/products", productRoute);
// app.use("/ap1/v1/variants", productVariantRouter);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use(errorHandler);

module.exports = app;
