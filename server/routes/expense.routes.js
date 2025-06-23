import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getMonthlyExpense,
} from "../controllers/expense.controller.js";
import { userVerify } from "../middleware/auth.middleware.js";
import exportCSV from "../controllers/export.expense.controller.js";

const expenseRoutes = express.Router();

expenseRoutes.post("/create-expense", userVerify, createExpense);

expenseRoutes.delete("/delete-expense/:id", userVerify, deleteExpense);

expenseRoutes.get("/get-expense", getAllExpenses);

expenseRoutes.get("/get-monthly-expense", userVerify, getMonthlyExpense);

expenseRoutes.get("/export-expense", userVerify, exportCSV);

export default expenseRoutes;
