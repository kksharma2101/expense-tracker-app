import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getMonthlyExpense,
} from "../controllers/expense.controller.js";
import { userVerify } from "../middleware/auth.middleware.js";

const expenseRoutes = express.Router();

expenseRoutes.post("/create-expense", userVerify, createExpense);
expenseRoutes.delete("/delete-expense/:id", userVerify, deleteExpense);
expenseRoutes.get("/get-expense", getAllExpenses);
expenseRoutes.get("/get-monthly-expense", userVerify, getMonthlyExpense);

export default expenseRoutes;
