import Expense from "../models/expense.model.js";
import AppError from "../utils/error.utils.js";

// Add new expense
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;
    // console.log(req.user.id);
    if (!(title, amount, category)) {
      return next(new AppError("All field is required", 405));
    }

    const data = new Expense({
      title,
      amount,
      category,
      date,
      user: req.user.id || req.user._id,
    });

    if (!data) {
      return next(new AppError("Add expense is faild, try again", 404));
    }

    await data.save();

    res.status(201).json({
      message: "Expense add successfully",
      data,
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

// Get Monthly Expense
const getMonthlyExpense = async (req, res) => {
  try {
    const { userId, month, year } = req.query;

    if (!month || !year || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
      return res.status(400).json({
        message: "Month and year are required and must be valid numbers.",
      });
    }

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    if (monthInt < 1 || monthInt > 12) {
      return res
        .status(400)
        .json({ message: "Month must be between 1 and 12." });
    }

    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 1); // Start of next month

    const expenses = await Expense.find({
      user: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: -1 });

    res.json({ expenses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", message: error.message });
  }
};

export { createExpense, deleteExpense, getAllExpenses, getMonthlyExpense };
