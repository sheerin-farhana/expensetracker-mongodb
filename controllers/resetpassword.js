const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPassword");

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      const id = uuid.v4();
      const newPasswordData = new ForgotPassword({
        _id: id,
        userId: user._id,
        active: true,
      });
      const data = await newPasswordData.save();

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: "sheerinfarhana25@gmail.com",
        subject: "Reset Password",
        text: "Follow the link to reset your password",
        html: `<a href="http://localhost:3000/password/reset/${id}">Reset password</a>`,
      };

      sgMail
        .send(msg)
        .then((response) => {
          console.log("Email sent");
          return res.status(response[0].statusCode).json({
            message: "Link to reset password sent to your email",
            success: true,
          });
        })
        .catch((error) => {
          console.error(error);
          throw new Error(error);
        });
    } else {
      throw new Error("User doesn't exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err.message, success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const id = req.params._id;
    const forgotPasswordRequest = await ForgotPassword.findOne({ _id: id });

    if (forgotPasswordRequest) {
      await forgotPasswordRequest.updateOne({}, { $set: { active: false } });

      res.status(200).send(`
                <html>
                    <script>
                        function formsubmitted(e){
                            e.preventDefault();
                            console.log('called');
                        }
                    </script>
                    <form action="/password/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>reset password</button>
                    </form>
                </html>`);
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    console.log(newpassword);
    console.log(resetpasswordid);

    const resetpasswordrequest = await ForgotPassword.findOne({
      _id: resetpasswordid,
    });

    if (resetpasswordrequest) {
      const user = await User.findOne({ _id: resetpasswordrequest.userId });

      if (user) {
        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, async (err, salt) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }

          bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
              console.log(err);
              throw new Error(err);
            }

            await user.updateOne({ password: hash });

            res.status(201).json({
              message: "Successfully updated the new password",
              success: true,
            });
          });
        });
      } else {
        return res
          .status(404)
          .json({ error: "No user exists", success: false });
      }
    } else {
      return res
        .status(404)
        .json({ error: "Reset request not found", success: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { forgotpassword, resetpassword, updatepassword };
