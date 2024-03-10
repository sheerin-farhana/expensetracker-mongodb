const mongoose = require("mongoose");
const User = require("../models/User");

const expenseSchema = new mongoose.Schema({
  expenseamt: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
