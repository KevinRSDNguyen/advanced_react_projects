const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const mongoose = require("mongoose");
const FakeDb = require("./fake-db");
require("dotenv").config(); //Allows us to grab vals from .env files

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/product");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE).then(() => {
  const fakeDb = new FakeDb();
  // fakeDb.seedDb();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
