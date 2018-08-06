const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const mongoose = require("mongoose");
const FakeDb = require("./fake-db");
//require("dotenv").config(); //Allows us to grab vals from .env files
const { DATABASE } = require("./../config/keys");

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/product");
const siteRoutes = require("./routes/site");

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE).then(() => {
  const fakeDb = new FakeDb();
  // fakeDb.seedDb();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/site", siteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("/*", (req, res) => {
    res.sendfile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
