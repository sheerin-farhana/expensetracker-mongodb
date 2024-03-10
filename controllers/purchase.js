const dotenv = require("dotenv");
dotenv.config();
const Razorpay = require("razorpay");
const Order = require("../models/Order");

const purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 5000;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error creating order" });
      }

      const orderData = new Order({
        paymentid: null, // Initialize as null since payment is not done yet
        orderid: order.id,
        status: "PENDING",
        userId: req.user._id,
      });

      await orderData.save();
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    const order = await Order.findOne({ orderid: order_id });

    if (payment_id == null) {
      await order.updateOne(
        {},
        {
          $set: {
            paymentid: payment_id,
            status: "FAILED",
            userId: req.user._id,
          },
        }
      );
      return res
        .status(202)
        .json({ success: false, message: "Payment failed" });
    }

    const promise1 = order.updateOne(
      {},
      {
        $set: {
          paymentid: payment_id,
          status: "SUCCESSFUL",
          userId: req.user._id,
        },
      }
    );

    const promise2 = req.user.updateOne({ ispremiumuser: true });

    await Promise.all([promise1, promise2]);

    return res
      .status(202)
      .json({ success: true, message: "Transaction successful" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { purchasePremium, updateTransactionStatus };
