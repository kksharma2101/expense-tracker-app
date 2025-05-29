// const express = require('express');
// const router = express.Router();
// const Expense = require('../models/Expense');
import Expense from "../models/expense.model.js";
import AppError from "../utils/error.utils.js";

// Get all expenses
// router.get("/", async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ date: -1 });
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Add new expense
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!(title, amount, category)) {
      return next(new AppError("All field is required", 405));
    }

    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      user: req.user.id,
    });

    if (!newExpense) {
      return next(new AppError("Add expense is faild, try again", 404));
    }

    await newExpense.save();

    res.status(201).json({
      message: "Expense add successfully",
      newExpense,
    });
  } catch (e) {
    return next(new AppError(e.message, 400));
  }
};

// Delete expense
const deleteExpense = async (req, res, next) => {
  try {
    const deleteEx = await Expense.findByIdAndDelete(req.params.id);
    if (!deleteEx) {
      return next(new AppError("Expense is not Delete, try again", 400));
    }
    res.json({ message: "Expense deleted" });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find();
    res.status(201).json({
      success: true,
      expenses,
    });
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};

// // Delete expense
// router.delete("/:id", async (req, res) => {
//   try {
//
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get expenses summary
// router.get("/summary", async (req, res) => {
//   try {
//     const summary = await Expense.aggregate([
//       {
//         $group: {
//           _id: "$category",
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { total: -1 } },
//     ]);
//     res.json(summary);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get monthly expenses
// router.get("/monthly", async (req, res) => {
//   try {
//     const monthlyExpenses = await Expense.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$date" },
//             month: { $month: "$date" },
//           },
//           total: { $sum: "$amount" },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);
//     res.json(monthlyExpenses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

export { createExpense, deleteExpense, getAllExpenses };
