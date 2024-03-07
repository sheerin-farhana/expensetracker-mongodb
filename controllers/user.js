const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  console.log(name, email, phone, password);

  try {
    //Check if the email already exists
    const existingUser = await User.findOne({
      email: email,
    }).exec();

    // console.log("EXISTING USER", existingUser);

    if (existingUser) {
      //throw error , if email exixts
      console.log("email id already exixts");
      res.status(403).json({ data: true });
      return;
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      // create new user if email is unique
      const user = new User({
        name: name,
        email: email,
        phone: phone,
        password: hash,
        ispremiumuser: false,
        totalexpense: 0,
      });
      const newUserData = await user.save();
      console.log("Usr data", newUserData);
      res.status(200).json({ data: newUserData });
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.TOKEN);
}

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (isStringValid(email) || isStringValid(password)) {
    return res
      .status(400)
      .json({ success: false, message: "Email or password is missing" });
  }

  try {
    const user = await User.findOne({
      email: email,
    });

    console.log("USER OBJECT", user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.status(200).json({
          success: true,
          message: "User login successful",
          token: generateAccessToken(user.id, user.name),
          ispremiumUser: user.ispremiumuser,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Password  does not match" });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: "Emaild does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

function isStringValid(data) {
  if (data == undefined || data.length === 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = { signup, login };
