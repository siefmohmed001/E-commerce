const app = require("./app");
const connectDB = require("./config/databaseConnection");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION server shutting down....");
  console.log(err.name, err.message);
  process.exit(1);
});

connectDB();

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port  ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION! Shuting down....");
  server.close(() => {
    process.exit(1);
  });
});
