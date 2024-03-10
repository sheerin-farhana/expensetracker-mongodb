const express = require("express");
const route = express.Router();

const { authenticate: userAuthentication } = require("../middleware/auth");
const {
  insertExpense,
  getExpenses,
  deleteExpense,
  downloadExpense,
  getDownloadedExpenses,
  getExpensesPerPage,
} = require("../controllers/expense");

route.get("/download", userAuthentication, downloadExpense);
route.get("/getExpense", userAuthentication, getExpenses);
route.post("/insertExpense", userAuthentication, insertExpense);
route.get("/filesdownloaded", userAuthentication, getDownloadedExpenses);
route.get("/getexpensesperpage", userAuthentication, getExpensesPerPage);

module.exports = route;
