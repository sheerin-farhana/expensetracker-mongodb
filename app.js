const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const express = require("express");

const morgan = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const passwordRoutes = require("./routes/password");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/users", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// Catch-all route for unknown routes
app.use((req, res) => {
  console.log("URLLLL", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

mongoose
  .connect(process.env.MONGOURL)
  .then((result) => {
    app.listen(3000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
