const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  paymentid: {
    type: String,
  },
  orderid: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
//     Paymentid: Sequelize.STRING,
//     Orderid: Sequelize.STRING,
//     Status: Sequelize.STRING
// });
