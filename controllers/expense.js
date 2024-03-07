const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/User");
const DownloadedFile = require("../models/DownloadedFile");
const S3Services = require("../services/S3services");

const insertExpense = async (req, res, next) => {
  const { amount, category, description } = req.body;

  console.log(req.user, "REQ USER");

  try {
    const newExpense = await new Expense({
      expenseamt: amount,
      category: category,
      description: description,
      userId: req.user._id,
    });

    const expense = newExpense.save();

    const user = await User.findOne({
      _id: req.user.id,
    }).exec();

    if (user) {
      const newTotalExpenses =
        (parseFloat(user.totalexpense) || 0) + parseFloat(amount);
      await user.updateOne({ totalexpense: newTotalExpenses });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(err);
  }
};

const getExpensesPerPage = async (req, res, next) => {
  try {
    const page = req.query.page;
    // const user = req.user;
    const limit = parseInt(req.query.noitem) || 5;
    const offset = (page - 1) * limit;

    const expenses = await Expense.find({
      userId: req.user._id,
    })
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit);

    // console.log('EXPENSES LIST',expenses);
    console.log(limit, "LIMIT");
    console.log(page, "PAGE NUMBER");

    res.status(200).json({
      expenses: expenses,
      hasMoreExpenses: expenses.length === limit,
      hasPreviousExpenses: page > 1,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized relogin required" });
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.status(200).json({ success: true, expense: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(err);
  }
};

const downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user._id,
    });
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${req.user._id}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
    const downloadedFile = new DownloadedFile({
      fileURL: fileURL,
      userId: req.user._id,
    });
    await downloadedFile.save();
    res.status(200).json({ success: true, fileURL });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, fileURL: "", err: err });
  }
};

const getDownloadedExpenses = async (req, res) => {
  try {
    const expenses = await DownloadedFile.find({
      userId: req.user._id,
    });

    console.log(expenses);
    res.status(200).json({ success: true, downloadedExpenses: expenses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, err: err });
  }
};

// const dotenv = require('dotenv');
// dotenv.config()
// const { Expense } = require('../models/Expense');

// const { User } = require('../models/User');
// const { DownloadedFile } = require('../models/DownloadedFile');
// const sequelize = require('../utils/database');
// const UserServices = require('../services/userservices');
// const S3Services = require('../services/S3services');

// const insertExpense = async (req, res, next) => {
//     const transaction = await sequelize.transaction();
//     const { amount, category, description } = req.body;

//     try {
//         const expense = await Expense.create({
//             ExpenseAmt: amount,
//             Category: category,
//             Description: description,
//             UserId: req.user.id,
//         },
//             {
//                 transaction: transaction
//             });

//         const user = await User.findOne({
//             where: { id: req.user.id },
//             transaction: transaction,
//         });

//         if (user) {
//             const newTotalExpenses = (parseFloat(user.TotalExpenses) || 0) + parseFloat(amount);
//             await user.update({ TotalExpenses: newTotalExpenses }, { transaction: transaction });
//         }
//         await transaction.commit();
//         res.status(200).json({ success: true, data: expense.dataValues });
//     }
//     catch (err) {
//         await transaction.rollback();
//         res.status(500).json({ success: false, message: "Internal server error" });
//         console.log(err);
//     }
// }

// const getExpenses = async (req, res, next) => {

//     try {
//         const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
//         res.status(200).json({ success: true, expense: expenses });
//     }
//     catch (err) {
//         res.status(500).json({ success: false, message: "Internal server error" });
//         console.log(err);
//     }
// }

// const deleteExpense = async (req, res, next) => {
//     const { id } = req.params;
//     const transaction = await sequelize.transaction();

//     try {
//         const expense = await Expense.findOne({
//             where: {
//                 id: id,
//                 UserId: req.user.id,
//             }
//         });

//         if (!expense) {
//             return res.status(404).json({ success: false, message: "Expense not found" });
//         }

//         const user = await User.findOne({
//             where: { id: req.user.id },
//             transaction: transaction,
//         });

//         console.log("The User", user);

//         if (user) {
//             const expenseAmt = !isNaN(parseFloat(expense.ExpenseAmt)) ? parseFloat(expense.ExpenseAmt) : 0;
//             const newTotalExpenses = user.TotalExpenses - expenseAmt;
//             console.log(expenseAmt, "EXPENSE AMOUNT ");
//             console.log(user.TotalExpenses, "TotalExpense ");

//             await user.update({ TotalExpenses: newTotalExpenses }, { transaction: transaction });
//         }

//         await expense.destroy();

//         await transaction.commit();
//         res.status(200).json({ success: true, message: "Expense is deleted" });

//     }
//     catch (err) {
//         await transaction.rollback();
//         console.log(err);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// }

// const downloadExpense = async (req, res) => {

//     try {
//         const expenses = await UserServices.getExpenses(req);
//         console.log(expenses);
//         const stringifiedExpenses = JSON.stringify(expenses);
//         const filename = `Expense${req.user.id}/${new Date()}.txt`;
//         const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
//         await DownloadedFile.create({ fileURL: fileURL, userId: req.user.id });

//         res.status(200).json({ success: true, fileURL });
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, fileURL: "", err: err });
//     }
// }

// const getDownloadedExpenses = async (req, res) => {

//     try {
//         const expenses = await DownloadedFile.findAll({ where: { userId: req.user.id } });

//         console.log(expenses);
//         res.status(200).json({ success: true, downloadedExpenses: expenses });
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, err: err });
//     }
// }

// const getExpensesPerPage = async (req, res, next) => {
//     try {
//         const page = req.query.page;
//         // const user = req.user;
//         const limit = parseInt(req.query.noitem) || 5;
//         const offset = (page - 1) * limit;

//         const expenses = await Expense.findAll({
//             where: { userId: req.user.id },
//             offset: offset,
//             limit: limit
//         });

//         // console.log('EXPENSES LIST',expenses);
//         console.log(limit, "LIMIT");
//         console.log(page,"PAGE NUMBER");

//         res.status(200).json({
//             expenses: expenses,
//             hasMoreExpenses: expenses.length === limit,
//             hasPreviousExpenses: page > 1
//         });
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(401).json({ message: "Unauthorized relogin required" });
//     }
// }

module.exports = {
  insertExpense,
  getExpenses,
  //   deleteExpense,
  downloadExpense,
  getDownloadedExpenses,
  getExpensesPerPage,
};
