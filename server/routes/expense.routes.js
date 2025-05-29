import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
} from "../controllers/expense.controller.js";
import { userVerify } from "../middleware/auth.middleware.js";

const expenseRoutes = express.Router();

expenseRoutes.post("/create-expense", createExpense);
expenseRoutes.delete("/delete-expense/:id", userVerify, deleteExpense);
expenseRoutes.get("/get-expense/", getAllExpenses);

export default expenseRoutes;
