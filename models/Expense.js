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

// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const Expense = sequelize.define('Expense', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull:false
//     },
//     ExpenseAmt: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     Category: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     Description: {
//         type: Sequelize.TEXT,
//         allowNull:false,
//     },
// });

// module.exports = { Expense };
