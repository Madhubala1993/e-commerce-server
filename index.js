import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { productsRouter } from "./products.js";
import { usersRouter } from "./users.js";
import Razorpay from "razorpay";
import shortid from "shortid";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

export const client = await createConnection();

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.use("/users", usersRouter);

app.use("/products", productsRouter);

app.get("/razorpay", (req, res) => {
  res.send("Razorpay payment");
});

app.post("/razorpay", async (request, res) => {
  let amount = 1;
  amount = request.body;
  console.log(amount.amount);
  const cost = amount.amount;
  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: cost * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log("SERVER STARTED ON PORT", PORT));
