const Expense = require("../models/Expense");

const getExpenses = async (userId, where) => {
  try {
    const expenses = await Expense.find({
      userId: userId,
      ...where, // Additional conditions can be passed using the 'where' parameter
    }).lean();
    return expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getExpenses,
};
