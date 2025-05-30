import mongoose, { Schema, model } from "mongoose";

const ExpenseSchema = new Schema({
  title: { type: String, required: true },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Bills", "Travel", "Other"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const expense = model("Expenses", ExpenseSchema);
export default expense;
