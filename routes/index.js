import { promisify } from "util";
import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import axios from "axios";

dotenv.config();
const { RAZOR_PAY_KEY_ID, RAZOR_PAY_KEY_SECRET } = process.env;
const router = express.Router();

const instance = new Razorpay({
  key_id: RAZOR_PAY_KEY_ID,
  key_secret: RAZOR_PAY_KEY_SECRET
});

/**
 * Fires an order API
 */
router.get("/order", async (req, res) => {
  const options = {
    amount: 10 * 100, // currency in subunit. (amount 299.35 -> 29935)
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: 0
  };
  const createOrder = promisify(instance.orders.create);
  const order = await createOrder(options);
  res.json(order);
});

router.post("/capture/:paymentId", async (req, res) => {
  const params = new URLSearchParams();
  params.append("amount", 10 * 100);
  params.append("currency", "INR");
  const response = await axios({
    method: "POST",
    url: `https://${RAZOR_PAY_KEY_ID}:${RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
    data: params,
    headers: {
      contentType: "x - www - form - urlencoded"
    }
  });
  res.json(response.data);
});

export default router;
