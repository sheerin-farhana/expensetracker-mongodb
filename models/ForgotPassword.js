const mongoose = require("mongoose");
const uuid = require("uuid");

const forgotpasswordSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: function () {
      return uuid.v4();
    },
  },
  active: {
    type: Boolean,
  },
  expiresby: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const ForgotPassword = mongoose.model("NewPassword", forgotpasswordSchema);

module.exports = ForgotPassword;
