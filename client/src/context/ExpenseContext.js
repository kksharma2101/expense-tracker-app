import { createContext, useContext, useState, useEffect } from "react";
import {
  getExpenses as fetchExpenses,
  addExpense as createExpense,
  deleteExpense as removeExpense,
} from "../services/expenses";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const categories = [
    "Food",
    "Travel",
    "Bills",
    "Shopping",
    "Entertainment",
    "Other",
  ];

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      try {
        const data = await fetchExpenses(filter.month, filter.year);
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [filter]);

  const addExpense = async (expense) => {
    try {
      const newExpense = await createExpense(expense);
      setExpenses((prev) => [...prev, newExpense]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await removeExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateFilter = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        loading,
        error,
        filter,
        addExpense,
        deleteExpense,
        updateFilter,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
