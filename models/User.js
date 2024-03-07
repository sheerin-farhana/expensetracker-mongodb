const mongoose = require("mongoose");
const { FLOAT } = require("sequelize");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
  },
  totalexpense: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database');

// const User = sequelize.define('Users', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull:false
//     },
//     Name: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     Email: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     Phone: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     Password: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },
//     Ispremiumuser: Sequelize.BOOLEAN,
//     TotalExpenses: Sequelize.FLOAT,
// });

// module.exports = { User };
