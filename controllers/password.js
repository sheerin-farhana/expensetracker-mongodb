const { User } = require("../models/User");
const ForgotPassword = require("../models/ForgotPassword");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Sib = require("sib-api-v3-sdk");
const { param } = require("../routes/password");
const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    const sender = {
      email: "sheerinfarhana25@gmail.com",
      name: "From Expense tracker app",
    };
    const receivers = [
      {
        email: email,
      },
    ];

    const resetResponse = await user.createForgotPasswordRequest({});
    const { _id } = resetResponse;
    const mailresponse = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Reset Your password",
      htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
            <title>Password Reset</title>
            </head>
            <body>
            <h1>Reset Your Password</h1>
            <p>Click the button below to reset your password:</p>
            <a href="http://3.109.201.50:3000/password/reset/${id}" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </body>
            </html>
            `,
      params: {
        role: id,
      },
    });
    console.log("Email Sent");
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send reset email",
        error: error.message,
      });
  }
};

const resetPassword = async (req, res, next) => {
  const { id } = req.params;
  console.log("Requested ID:", id);

  try {
    const passwordReset = await ForgotPassword.findByPk(id);
    console.log("Retrieved Password Reset:", passwordReset);

    if (!passwordReset) {
      return res
        .status(404)
        .json({ message: "Password reset request not found" });
    }

    if (passwordReset.isactive === true || passwordReset.isactive === 1) {
      passwordReset.isactive = false;
      await passwordReset.save();
      const filePath = path.join(
        __dirname,
        "../resetPassword/resetpassword.html"
      );
      res.sendFile(filePath);
      console.log("Link clicked");
    } else {
      return res.status(401).json({ message: "Link does not work" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
  }
};

const resetPasswordSuccess = async (Req, res, next) => {
  try {
    const { newpassword, resetId } = req.body;

    console.log(newpassword);
    console.log(resetId);
    const passwordReset = await ForgotPassword.findOne({
      where: { id: resetId },
    });

    bcrypt.hash(newpassword, 10, async (err, hash) => {
      await User.update(
        {
          password: hash,
        },
        {
          where: { id: passwordReset.UserId },
        }
      );
      console.log("password reset");
      res.status(200).json({ success: true, message: "Password was reset" });
    });

    console.log("Password changed ");
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { forgotPassword, resetPassword, resetPasswordSuccess };
