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
